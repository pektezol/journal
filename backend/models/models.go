package models

import "time"

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Task struct {
	ID          int       `json:"id"`
	Owner       int       `json:"-"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Finished    bool      `json:"finished"`
	Position    int       `json:"position"`
	CreatedAt   time.Time `json:"created_at"`
}

type Folder struct {
	ID     int  `json:"id"`
	Owner  int  `json:"-"`
	Parent *int `json:"parent"`
}

type Note struct {
	ID     int    `json:"id"`
	Owner  int    `json:"-"`
	Folder int    `json:"folder,omitempty"`
	Note   string `json:"note"`
}

type FolderNote struct {
	ID         int          `json:"id"`
	Notes      []Note       `json:"notes"`
	Subfolders []FolderNote `json:"subfolders"`
}
