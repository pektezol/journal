package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/journal/backend/database"
	"github.com/pektezol/journal/backend/models"
)

func GetFolders(c *gin.Context) {
	userID, _ := c.Get("user_id")
	folders := []models.Folder{}
	err := database.DB.Where("owner = ?", userID.(int)).Find(&folders).Error
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"folders": folders})
}

func CreateFolder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	type CreateFolderRequest struct {
		Parent *int   `json:"parent"`
		Name   string `json:"name" binding:"required"`
	}
	var req CreateFolderRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	folder := models.Folder{
		Owner:  userID.(int),
		Parent: req.Parent,
		Name:   req.Name,
	}
	result := database.DB.Create(&folder)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": folder.ID})
}

func UpdateFolder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramFolderID := c.Param("id")
	folderID, err := strconv.Atoi(paramFolderID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	type UpdateFolderRequest struct {
		Parent *int   `json:"parent"`
		Name   string `json:"name" binding:"required"`
	}
	var req UpdateFolderRequest
	err = c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	folder := models.Folder{
		ID:    folderID,
		Owner: userID.(int),
	}
	result := database.DB.First(&folder)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	folder.Parent = req.Parent
	folder.Name = req.Name
	result = database.DB.Save(&folder)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": folderID})
}

func DeleteFolder(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramFolderID := c.Param("id")
	folderID, err := strconv.Atoi(paramFolderID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	folder := models.Folder{
		ID:    folderID,
		Owner: userID.(int),
	}
	result := database.DB.First(&folder)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	db, err := database.DB.DB()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	_, err = db.Exec("PRAGMA foreign_keys = ON; DELETE FROM folders WHERE id = $1;", folder.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": folderID})
}
