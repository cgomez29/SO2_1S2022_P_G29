package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/helper"
	"gitlab.com/ayd1_practica2_g5/server/model"
	"gorm.io/gorm"
)

type FriendController interface {
	GetFriends(ctx *gin.Context)
	SendFriendRequest(ctx *gin.Context)
	AcceptRequest(ctx *gin.Context)
	AddFriends(ctx *gin.Context)
	GetListRequests(ctx *gin.Context)
}

type friendController struct {
	db *gorm.DB
}

func NewFriendController(db *gorm.DB) FriendController {
	return &friendController{
		db: db,
	}
}

//obtener amigos
func (c *friendController) GetFriends(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var friends []model.Friend

	_ = c.db.Raw("getFriends", data.UserId).Scan(&friends)

	if len(friends) > 0 {
		response := helper.BuildResponse("Successful", friends)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse("Friends list empty", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}
}

//ENTRADA getFriends
/*
	{
    	"idUsuario" : 18
	}
*/
//SALIDA getFriends
/*
	si existen amigos

	{
		"status": true,
		"message": "Successful",
		"errors": null,
		"data": [
			{
				"idUsuario": 17,
				"username": "edwin",
				"name": "Edwin Lopez",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9"
			},
			{
				"idUsuario": 21,
				"username": "willop",
				"name": "Wilfred Perez",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9"
			}
		]
	}

	si no existen amigos
	{
		"status": false,
		"message": "Friends list empty",
		"errors": [
			""
		],
		"data": null
	}
*/

//enviar solicitud de amistad
func (c *friendController) SendFriendRequest(ctx *gin.Context) {
	var data model.FriendRequest

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var AnswerDataBase model.AnswerDataBase
	_ = c.db.Raw("sendFriendRequest ?,?", data.UserIdA, data.UserIdB).Scan(&AnswerDataBase)

	if AnswerDataBase.Operacion != 0 {
		response := helper.BuildResponse("Successful", nil)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse(AnswerDataBase.Msg, "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}

}

//ENTRADA SendFriendRequest
/*
	{
    "idUsuario" : 22,// usuario que envia la solicitud, el logueado
    "idUsuarioB" : 18//usuario que recibe la solicitud
	}
*/
//SALIDA
/*
	si se envio correctamente la solicitud
	{
		"status": true,
		"message": "Successful",
		"errors": null,
		"data": null
	}

	error al enviar la solicitud

	{
    "status": false,
    "message": "solicitud de amistad ya disponible",
    "errors": [
        ""
    ],
    "data": null
}
*/

//aceptar solicitud de amistad
func (c *friendController) AcceptRequest(ctx *gin.Context) {
	var data model.FriendRequest

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var AnswerDataBase model.AnswerDataBase
	_ = c.db.Raw("acceptRequest ?,?", data.UserIdA, data.UserIdB).Scan(&AnswerDataBase)

	if AnswerDataBase.Operacion != 0 {
		response := helper.BuildResponse("Successful", nil)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse(AnswerDataBase.Msg, "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}
}

/*
//ENTRADA
	{
		"idUsuario" : 13,
		"idUsuarioB" : 18
	}
//SALIDA
	//si la solicitud se acepto correctamente
	{
		"status": true,
		"message": "Successful",
		"errors": null,
		"data": null
	}
	//si hubo un error con la solicitud de amistad
	{
		"status": false,
		"message": "Friend request does not exist",
		"errors": [
			""
		],
		"data": null
	}


*/

//agregar amigos
func (c *friendController) AddFriends(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var people []model.Friend
	_ = c.db.Raw("addFriends", data.UserId).Scan(&people)

	if len(people) > 0 {
		response := helper.BuildResponse("Successful", people)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse("Cannot get list of people", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}
}

//preguntar si el badrequest se envia cuando no se obtienen datos
//arreglar transaccion 2

//ENTRADA SendFriendRequest
/*
	{
    "idUsuario" : 22,// usuario en sesion
	}
*/
//SALIDA
/*
	si se hizo correctamente la solicitud
	{
		"status": true,
		"message": "Successful",
		"errors": null,
		"data": [
			{
				"idUsuario": 6,
				"username": "admin",
				"name": "Cristian",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9"
			},
			{
				"idUsuario": 7,
				"username": "admin2",
				"name": "Cristian",
				"image": "ayd1-practica2/19f02de9-b58b-447d-a7dc-71f42aba30cf"
			}
		]
	}

	si no se pueden obtener los amigos

	{
    "status": false,
    "message": "Cannot get list of people",
    "errors": [
        ""
    ],
    "data": null
}
*/

//devuelve un listado de solicitudes de amistad disponibles
func (c *friendController) GetListRequests(ctx *gin.Context) {
	var data model.User

	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	var people []model.Friend
	_ = c.db.Raw("getListRequests", data.UserId).Scan(&people)

	if len(people) > 0 {
		response := helper.BuildResponse("Successful", people)
		ctx.JSON(http.StatusOK, response)
	} else {
		response := helper.BuildErrorResponse("Cannot get list of people", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
	}
}

/*
//Entrada
	{
		"idUsuario" : 23
	}
//Salida
	{
		"status": true,
		"message": "Successful",
		"errors": null,
		"data": [
			{
				"idUsuario": 21,
				"username": "willop",
				"name": "Wilfred Perez",
				"image": "ayd1-practica2/c4583fe5-299c-48cd-807f-449f0005c6b9"
			},
			{
				"idUsuario": 23,
				"username": "SevenPok",
				"name": "Gerber Colindres",
				"image": "ayd1-practica2/07375cae-a1d6-4787-a571-c1d22df5fe7b"
			}
		]
	}
//si existe algun error
	{
		"status": false,
		"message": "Cannot get list of people",
		"errors": [
			""
		],
		"data": null
	}

*/
