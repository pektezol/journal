package database

import (
	"log"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var err error
	DB, err = gorm.Open(sqlite.Open("journal.db"), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	log.Println("INFO: Connected to the database")
}
