package model

type Friend struct {
	UserId   uint   `json:"idUsuario" gorm:"column:idUsuario"`
	Username string `json:"username" gorm:"column:usuario"`
	Name     string `json:"name" gorm:"column:nombre"`
	Image    string `json:"image" gorm:"column:rutaFotoPerfil"`
}

type FriendRequest struct {
	UserIdA uint `json:"idUsuario"`
	UserIdB uint `json:"idUsuarioB"`
}

type AnswerDataBase struct {
	Operacion int    `gorm:"column:operacion"`
	Msg       string `gorm:"column:msg"`
}

//idUsuario usuario que envia solicitud de amistad
//idUsuarioB usuario que recibe solicitud de amistad
