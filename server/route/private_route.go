package route

import (
	"github.com/gin-gonic/gin"
	"gitlab.com/ayd1_practica2_g5/server/controller"
)

var (
	//authController   controller.AuthController   = controller.NewAuthController(jwtService, db)
	friendController controller.FriendController = controller.NewFriendController(db)
	postController   controller.PostController   = controller.NewPostController(db)
	userController   controller.UserController   = controller.NewUserController(db)
)

func PrivateRoutes(router *gin.Engine) {
	userRoutes := router.Group("api")
	{
		userRoutes.GET("/test", authController.Test)
	}

	friendRoutes := router.Group("api/friend")
	{
		// /api/friend/getFriend
		friendRoutes.POST("/getFriend", friendController.GetFriends)
		// /api/friend/sendFriendRequest
		friendRoutes.POST("/sendFriendRequest", friendController.SendFriendRequest)
		// /api/friend/acceptRequest
		friendRoutes.POST("/acceptRequest", friendController.AcceptRequest)
		// /api/friend/addFriends
		friendRoutes.POST("/addFriends", friendController.AddFriends)
		// /api/friend/getListRequests
		friendRoutes.POST("/getListRequests", friendController.GetListRequests)
	}

	postsRoutes := router.Group("api/post")
	{
		postsRoutes.POST("/getPosts", postController.GetPosts)
		postsRoutes.POST("/newPost", postController.NewPost)
	}

	userProfileRoutes := router.Group("api/user")
	{
		userProfileRoutes.POST("/getProfile", userController.GetProfile)
		userProfileRoutes.PUT("/updateProfile", userController.UpdateProfile)
	}
}
