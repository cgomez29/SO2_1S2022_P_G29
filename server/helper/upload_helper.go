package helper

import (
	"fmt"
	"os"

	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
)

// Receives as parameters in gin context and the data of the image in base64
// returns the path to save
func UploadImage(ctx *gin.Context, image string) (string, error) {
	if image == "" {
		return "", nil
	}

	CLOUD_FOLDER := os.Getenv("CLOUD_FOLDER")

	myuuid, _ := uuid.NewV4()
	str_uuid := myuuid.String()

	cld, _ := cloudinary.NewFromParams(os.Getenv("CLOUD_NAME"), os.Getenv("API_KEY"), os.Getenv("API_SECRET"))
	_, errC := cld.Upload.Upload(ctx, image, uploader.UploadParams{PublicID: str_uuid, Folder: CLOUD_FOLDER})

	if errC != nil {
		return "", errC
	}

	str_src := fmt.Sprintf("%s/%s", CLOUD_FOLDER, str_uuid)
	// str_src path to save
	return str_src, errC
}
