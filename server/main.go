package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/middleware"
	"gitlab.com/ayd1_practica2_g5/server/route"
)

func main() {

	// Setup
	gin.SetMode(gin.DebugMode)
	router := gin.Default()

	// http://www.socialapp-g5.tk
	// middlewares
	router.Use(middleware.GinMiddleware("*"))

	// Static files
	router.Use(static.Serve("/", static.LocalFile("./public", true)))

	// Public routes
	route.PublicRoutes(router)
	// Private routes
	route.PrivateRoutes(router)

	router.Run(":4000") // listen and serve on 0.0.0.0:4000 (for windows "localhost:8080")
}
