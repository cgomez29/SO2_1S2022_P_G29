package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/helper"
	"gitlab.com/ayd1_practica2_g5/server/model"
	"gorm.io/gorm"
)

type PostController interface {
	GetPosts(ctx *gin.Context)
	NewPost(ctx *gin.Context)
}

type postController struct {
	db *gorm.DB
}

func NewPostController(db *gorm.DB) PostController {
	return &postController{
		db: db,
	}
}

//URL api/post/getPosts
//ENTRADA getPosts
/*
	{
    	"idUsuario" : 18
	}
*/

//SALIDA getPosts
/*
	si existen posts
	{
    	"status": true,
    	"message": "Successful",
    	"errors": null,
    	"data": [
			{
				"name": "Wilfred Perez",
				"username": "willop",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9",
				"post": "Nuevo post desde Postman",
				"postImage": "www.postmanfoto.com/foto",
				"date": "2022-03-20T19:15:33.07Z"
			},
			{
				"name": "Santiago Rivadeneira",
				"username": "Santi",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9",
				"post": "Publicacion 3",
				"postImage": "www.somebucket.com/image3",
				"date": "2022-03-20T18:30:22.19Z"
			},
			...
		]
	}

	si no existen posts
	{
		"status": false,
		"message": "There are no Posts",
		"errors": [
			""
		],
		"data": null
	}
*/

func (c *postController) GetPosts(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var posts []model.Post

	query := `SELECT u.nombre, u.usuario, u.rutaFotoPerfil, pub.descripcion, pub.rutaFoto, pub.fecha
	FROM [social-app-schema].Publicacion pub
	LEFT JOIN (
	SELECT idUsuarioB as amigo
	FROM [social-app-schema].Amigo
	WHERE idUsuarioA = ?
	UNION
	SELECT idUsuarioA as amigo
	FROM [social-app-schema].Amigo
	WHERE idUsuarioB = ?
	) a ON pub.idUsuario = a.amigo
	JOIN [social-app-schema].Usuario u ON pub.idUsuario = u.idUsuario
	WHERE amigo IS NOT NULL
	OR pub.idUsuario = ?
	ORDER BY fecha DESC`

	c.db.Raw(query, data.UserId, data.UserId, data.UserId).Scan(&posts)

	if len(posts) > 0 {
		response := helper.BuildResponse("Successful", posts)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse("There are no Posts", "", make([]string, 0))
		ctx.JSON(http.StatusBadRequest, response)
	}
}

//URL api/post/newPost
//ENTRADA newPost
/*
	{
		"idUsuario": 21,
		"descripcion": "Nuevo post desde Postman",
		"rutaFoto" : "www.postmanfoto.com/foto"
	}
*/

//SALIDA newPost
/*
	en caso de exito
	{
		"status": true,
		"message": "Post Created",
		"errors": null,
		"data": null
	}

	en caso de error
	{
		"status": false,
		"message": "Couldn't create new Post ",
		"errors": [
			""
		],
		"data": null
	}
*/

func (c *postController) NewPost(ctx *gin.Context) {
	var data model.NewPost

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	url := ""
	var err error

	if len(data.RutaFoto) != 0 {
		url, err = helper.UploadImage(ctx, data.RutaFoto)
		if err != nil {
			response := helper.BuildErrorResponse("Couldn't create new Post, Image upload error ", "", nil)
			ctx.JSON(http.StatusBadRequest, response)
			return
		}
	}

	query := `insert into [social-app-schema].Publicacion(fecha, descripcion, rutaFoto, idUsuario)
	VALUES (CURRENT_TIMESTAMP, ?, ?, ?)`

	if res := c.db.Exec(query, data.Descripcion, url, data.IdUsuario); res.Error != nil {
		response := helper.BuildErrorResponse("Couldn't create new Post ", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	} else {
		response := helper.BuildResponse("Post Created", nil)
		ctx.JSON(http.StatusOK, response)
	}

}
