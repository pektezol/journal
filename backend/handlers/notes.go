package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/journal/backend/database"
	"github.com/pektezol/journal/backend/models"
	"github.com/pektezol/journal/backend/utils"
)

func GetNotes(c *gin.Context) {
	userID, _ := c.Get("user_id")
	db, err := database.DB.DB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	folders, err := fetchFolders(db, userID.(int), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"folders": folders})
}

func fetchFolders(db *sql.DB, userID int, parentID *int) ([]models.FolderNote, error) {
	rows, err := db.Query(`
    SELECT f.id, f.name, f.parent FROM folders f WHERE f.parent is $1 AND f.owner is $2;
    `, parentID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	folders := []models.FolderNote{}
	for rows.Next() {
		var folderID int
		var folderName string
		var folderParent *int
		err := rows.Scan(&folderID, &folderName, &folderParent)
		if err != nil {
			return nil, err
		}

		notes, err := fetchNotes(db, userID, folderID)
		if err != nil {
			return nil, err
		}

		subfolders, err := fetchFolders(db, userID, &folderID)
		if err != nil {
			return nil, err
		}

		folders = append(folders, models.FolderNote{
			ID:         folderID,
			Name:       folderName,
			Parent:     folderParent,
			Notes:      notes,
			Subfolders: subfolders,
		})
	}
	return folders, nil
}

func fetchNotes(db *sql.DB, userID int, folderID int) ([]models.Note, error) {
	rows, err := db.Query(`
    SELECT n.id, n.title, n.note, n.folder, n.created_at, n.updated_at FROM notes n WHERE n.folder is $1 AND n.owner is $2;
    `, folderID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	notes := []models.Note{}
	for rows.Next() {
		var note models.Note
		err := rows.Scan(&note.ID, &note.Title, &note.Note, &note.Folder, &note.CreatedAt, &note.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if note.Note != "" {
			note.Note, err = utils.Decrypt(note.Note)
			if err != nil {
				return nil, err
			}
		}
		note.Title, err = utils.Decrypt(note.Title)
		if err != nil {
			return nil, err
		}
		notes = append(notes, note)
	}
	return notes, nil
}

func CreateNote(c *gin.Context) {
	userID, _ := c.Get("user_id")
	type CreateNoteRequest struct {
		Folder int    `json:"folder" binding:"required"`
		Title  string `json:"title" binding:"required"`
	}
	var req CreateNoteRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	note := models.Note{
		Owner:  userID.(int),
		Title:  req.Title,
		Folder: req.Folder,
		Note:   "",
	}
	note.Title, err = utils.Encrypt(req.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	result := database.DB.Create(&note)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": note.ID})
}

func UpdateNote(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramNoteID := c.Param("id")
	noteID, err := strconv.Atoi(paramNoteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	type UpdateNoteRequest struct {
		Folder int    `json:"folder" binding:"required"`
		Title  string `json:"title" binding:"required"`
		Note   string `json:"note"`
	}
	var req UpdateNoteRequest
	err = c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	note := models.Note{
		ID:    noteID,
		Owner: userID.(int),
	}
	result := database.DB.First(&note)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	note.Title, err = utils.Encrypt(req.Title)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	note.Folder = req.Folder
	note.Note, err = utils.Encrypt(req.Note)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	result = database.DB.Save(&note)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": noteID})
}

func DeleteNote(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramNoteID := c.Param("id")
	noteID, err := strconv.Atoi(paramNoteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	note := models.Note{
		ID:    noteID,
		Owner: userID.(int),
	}
	result := database.DB.First(&note)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	result = database.DB.Delete(&note)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": noteID})
}
