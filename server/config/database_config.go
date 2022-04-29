package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gitlab.com/ayd1_practica2_g5/server/model"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func SetupDatabaseConnection() *gorm.DB {

	errEnv := godotenv.Load()
	if errEnv != nil {
		panic("Failed to load env file")
	}

	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASSWORD")
	dbServer := os.Getenv("DB_SERVER")
	dbDatabase := os.Getenv("DB_DATABASE")

	dsn := fmt.Sprintf("sqlserver://%s:%s@%s:1433?database=%s", dbUser, dbPass, dbServer, dbDatabase)

	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})

	if err != nil {
		panic("Failed to create a connection to database")
	}

	fmt.Println("Database connection is successful")
	// Migración
	db.AutoMigrate(&model.User{}, &model.Friend{}, &model.Post{})
	return db
}

func CloseDatabaseConnection(db *gorm.DB) {
	dbSQL, err := db.DB()
	if err != nil {
		panic("Failed to close connection from database")
	}
	dbSQL.Close()
}
