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
	UpdatedAt   time.Time `json:"updated_at"`
}

type Folder struct {
	ID        int       `json:"id"`
	Owner     int       `json:"-"`
	Name      string    `json:"name"`
	Parent    *int      `json:"parent"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Note struct {
	ID        int       `json:"id"`
	Owner     int       `json:"-"`
	Folder    int       `json:"folder"`
	Title     string    `json:"title"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type FolderNote struct {
	ID         int          `json:"id"`
	Name       string       `json:"name"`
	Parent     *int         `json:"parent"`
	Notes      []Note       `json:"notes"`
	Subfolders []FolderNote `json:"subfolders"`
}
