package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/helper"
	"gitlab.com/ayd1_practica2_g5/server/model"
	"gorm.io/gorm"
)

type UserController interface {
	GetProfile(ctx *gin.Context)
	UpdateProfile(ctx *gin.Context)
}

type userController struct {
	db *gorm.DB
}

func NewUserController(db *gorm.DB) UserController {
	return &postController{
		db: db,
	}
}

func (c *postController) GetProfile(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var user model.User

	query := `select *
	from [social-app-schema].Usuario
	where idUsuario = ?`

	resDB := c.db.Raw(query, data.UserId).Scan(&user)

	if resDB.Error != nil || user.UserId == 0 {
		response := helper.BuildErrorResponse("Couldn't find the User ", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}

	response := helper.BuildResponse("User Found", user)
	ctx.JSON(http.StatusOK, response)
}

func (c *postController) UpdateProfile(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	query := `UPDATE [social-app-schema].Usuario
				SET usuario = ?,
				nombre = ?`

	if len(data.Password) != 0 {
		query += `, contrasena = '` + helper.HashAndSalt([]byte(data.Password)) + `'`
	}

	var err error
	if len(data.Image) != 0 {

		data.Image, err = helper.UploadImage(ctx, data.Image)
		if err != nil {
			response := helper.BuildErrorResponse("Couldn't update Profile, Image upload error ", "", nil)
			ctx.JSON(http.StatusBadRequest, response)
			return
		}
		query += `, rutaFotoPerfil = '` + data.Image + `'`
	}

	query += ` where idUsuario = ?`

	if res := c.db.Exec(query, data.Username, data.Name, data.UserId); res.Error != nil {
		response := helper.BuildErrorResponse("Couldn't update user profile", "", nil)
		println(res.Error.Error())
		ctx.JSON(http.StatusBadRequest, response)
	} else {
		response := helper.BuildResponse("User Profile Updated", nil)
		ctx.JSON(http.StatusOK, response)
	}

}
