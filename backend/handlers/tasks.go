package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pektezol/journal/backend/database"
	"github.com/pektezol/journal/backend/models"
)

func GetTasks(c *gin.Context) {
	userID, _ := c.Get("user_id")
	tasks := []models.Task{}
	result := database.DB.Where("owner = ?", userID).Find(&tasks).Order("updated_at DESC")
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tasks": tasks})
}

func CreateTask(c *gin.Context) {
	userID, _ := c.Get("user_id")
	type CreateTaskRequest struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
	}
	var req CreateTaskRequest
	err := c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := models.Task{
		Owner:       userID.(int),
		Title:       req.Title,
		Description: req.Description,
		Finished:    false,
		Position:    0,
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
	}
	result := database.DB.Create(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": task.ID})
}

func UpdateTask(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramTaskID := c.Param("id")
	taskID, err := strconv.Atoi(paramTaskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	type UpdateTaskRequest struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description"`
		Finished    *bool  `json:"finished" binding:"required"`
	}
	var req UpdateTaskRequest
	err = c.BindJSON(&req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := models.Task{
		ID:    taskID,
		Owner: userID.(int),
	}
	result := database.DB.First(&task)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	task.Title = req.Title
	task.Description = req.Description
	task.Finished = *req.Finished
	result = database.DB.Save(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": task.ID})
}

func DeleteTask(c *gin.Context) {
	userID, _ := c.Get("user_id")
	paramTaskID := c.Param("id")
	taskID, err := strconv.Atoi(paramTaskID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := models.Task{
		ID:    taskID,
		Owner: userID.(int),
	}
	result := database.DB.First(&task)
	if result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": result.Error.Error()})
		return
	}
	result = database.DB.Delete(&task)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": taskID})
}
