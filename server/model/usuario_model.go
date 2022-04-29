package model

type User struct {
	UserId   uint   `json:"idUsuario" gorm:"column:idUsuario"`
	Username string `json:"username" gorm:"column:usuario"`
	Name     string `json:"name" gorm:"column:nombre"`
	Password string `json:"password" gorm:"column:contrasena"`
	Image    string `json:"image" gorm:"column:rutaFotoPerfil"`
}

type LoginUser struct {
	UserId   uint   `json:"idUsuario" gorm:"column:idUsuario"`
	Username string `json:"username" gorm:"column:usuario"`
	Name     string `json:"name" gorm:"column:nombre"`
	Token    string `json:"token" `
	Image    string `json:"image" gorm:"column:rutaFotoPerfil"`
}
