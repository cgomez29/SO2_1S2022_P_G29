package model

import (
	"time"
)

type Post struct {
	Name      string    `json:"name" gorm:"column:nombre"`
	Username  string    `json:"username" gorm:"column:usuario"`
	Image     string    `json:"image" gorm:"column:rutaFotoPerfil"`
	Post      string    `json:"post" gorm:"column:descripcion"`
	PostImage string    `json:"postImage" gorm:"column:rutaFoto"`
	Date      time.Time `json:"date" gorm:"column:fecha"`
}

type NewPost struct {
	IdUsuario   int    `json:"idUsuario"`
	Descripcion string `json:"descripcion"`
	RutaFoto    string `json:"rutaFoto"`
}
