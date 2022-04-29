package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/helper"
	"gitlab.com/ayd1_practica2_g5/server/model"
	"gitlab.com/ayd1_practica2_g5/server/service"
	"gorm.io/gorm"
)

type AuthController interface {
	SignUp(ctx *gin.Context)
	SignIn(ctx *gin.Context)
	Test(ctx *gin.Context)
}

type authController struct {
	jwtService service.JWTService
	db         *gorm.DB
}

func NewAuthController(authService service.JWTService, db *gorm.DB) AuthController {
	return &authController{
		jwtService: authService,
		db:         db,
	}
}

func (c *authController) SignIn(ctx *gin.Context) {
	data := model.User{}

	// Call BindJSON to bind the received JSON to
	// data.
	if err := ctx.BindJSON(&data); err != nil {
		return
	}

	user := model.User{}
	query := "SELECT * FROM [social-app-schema].Usuario WHERE usuario = ?"
	resDB := c.db.Raw(query, data.Username).Scan(&user)

	if resDB.Error != nil {
		return
	}

	// validate password
	comparePassword := helper.ComparePassword(user.Password, []byte(data.Password))

	userLogin := model.LoginUser{}

	if comparePassword {

		userLogin.Username = user.Username
		userLogin.Name = user.Name
		userLogin.UserId = user.UserId
		userLogin.Image = user.Image

		generateToken := c.jwtService.GenerateToken(strconv.FormatUint(uint64(user.UserId), 10))

		userLogin.Token = generateToken

		// preformatting data
		//response := helper.BuildResponse("Successful", userLogin)
		// asnwer
		ctx.JSON(http.StatusOK, userLogin)
	} else {
		// preformatting data
		// response := helper.BuildErrorResponse("Username or Password incorrect", "", nil)
		// asnwer
		ctx.JSON(http.StatusBadRequest, userLogin)
	}

}

func (c *authController) SignUp(ctx *gin.Context) {
	newUser := model.User{}

	// Call BindJSON to bind the received JSON to
	// data.
	if err := ctx.BindJSON(&newUser); err != nil {
		return
	}

	if newUser.Username == "" || newUser.Password == "" {
		response := helper.BuildErrorResponse("No data", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
		return
	}

	user := model.LoginUser{}

	// encript password
	newUser.Password = helper.HashAndSalt([]byte(newUser.Password))

	// upload image
	str_src, _ := helper.UploadImage(ctx, newUser.Image)
	newUser.Image = str_src

	// Insert to database
	query := "INSERT INTO [social-app-schema].Usuario(usuario, nombre, contrasena, rutafotoperfil) VALUES(?,?,?,?)"
	resDB := c.db.Raw(query, newUser.Username, newUser.Name, newUser.Password, newUser.Image).Scan(&user)

	if resDB.Error != nil {
		fmt.Println(resDB.Error)
		response := helper.BuildErrorResponse("Error DB, Unique Username", "", nil)
		ctx.JSON(http.StatusBadRequest, response)
		return
	}
	// preformatting data
	response := helper.BuildResponse("Successful", user)
	// asnwer
	ctx.JSON(http.StatusOK, response)
}

func (c *authController) Test(ctx *gin.Context) {
	// asnwer
	ctx.JSON(http.StatusOK, gin.H{
		"status": "true",
	})
}
