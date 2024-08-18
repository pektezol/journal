package api

import (
	"github.com/gin-gonic/gin"
	"github.com/pektezol/journal/backend/handlers"
)

func InitializeRoutes(r *gin.Engine) {
	api := r.Group("/api")

	api.POST("/login", handlers.Login)
	api.POST("/register", handlers.Register)

	api.GET("/notes", IsAuthenticated, handlers.GetNotes)
	api.POST("/notes", IsAuthenticated, handlers.CreateNote)
	api.PUT("/notes/:id", IsAuthenticated, handlers.UpdateNote)
	api.DELETE("/notes/:id", IsAuthenticated, handlers.DeleteNote)

	api.GET("/folders", IsAuthenticated, handlers.GetFolders)
	api.POST("/folders", IsAuthenticated, handlers.CreateFolder)
	api.PUT("/folders/:id", IsAuthenticated, handlers.UpdateFolder)
	api.DELETE("/folders/:id", IsAuthenticated, handlers.DeleteFolder)

	api.GET("/tasks", IsAuthenticated, handlers.GetTasks)
	api.POST("/tasks", IsAuthenticated, handlers.CreateTask)
	api.PUT("/tasks/:id", IsAuthenticated, handlers.UpdateTask)
	api.DELETE("/tasks/:id", IsAuthenticated, handlers.DeleteTask)
}
