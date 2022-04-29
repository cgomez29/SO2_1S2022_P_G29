package route

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/config"
	"gitlab.com/ayd1_practica2_g5/server/controller"
	"gitlab.com/ayd1_practica2_g5/server/service"
	"gorm.io/gorm"
)

var (
	db             *gorm.DB                  = config.SetupDatabaseConnection()
	jwtService     service.JWTService        = service.NewJWTService()
	authController controller.AuthController = controller.NewAuthController(jwtService, db)
)

func PublicRoutes(router *gin.Engine) {

	authRoutes := router.Group("api/auth")
	{
		authRoutes.POST("/signIn", authController.SignIn)
		authRoutes.POST("/signUp", authController.SignUp)
	}

}
