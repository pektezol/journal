package main

import (
	"fmt"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/pektezol/journal/backend/api"
	"github.com/pektezol/journal/backend/database"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	if os.Getenv("ENV") == "PROD" {
		gin.SetMode(gin.ReleaseMode)
	}
	database.Connect()
}

func main() {
	router := gin.Default()
	api.InitializeRoutes(router)
	router.Run(fmt.Sprintf(":%s", os.Getenv("PORT")))
}
