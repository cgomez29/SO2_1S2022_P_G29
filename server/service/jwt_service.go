package service

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

type JWTService interface {
	GenerateToken(UserID string) string
	ValidateToken(token string) (*jwt.Token, error)
}

type jwtCustomClaim struct {
	UserID string `json: "user_id"`
	jwt.StandardClaims
}

type jwtService struct {
	secretKey string
	issuer    string
}

func getSecretKey() string {
	secretKey := os.Getenv("JWT_SECRET")
	if secretKey != "" {
		secretKey = "cristian"
	}
	return secretKey
}

func NewJWTService() JWTService {
	return &jwtService{
		issuer:    "cristian",
		secretKey: "cristian",
	}
}

func (j *jwtService) GenerateToken(UserID string) string {
	claims := &jwtCustomClaim{
		UserID,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(), //1 hour
			Issuer:    j.issuer,
			IssuedAt:  time.Now().Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		panic(err)
	}
	return t
}

func (j *jwtService) ValidateToken(token string) (*jwt.Token, error) {
	return jwt.Parse(token, func(t_ *jwt.Token) (interface{}, error) {
		if _, ok := t_.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method %v", t_.Header["alg"])
		}
		return []byte(j.secretKey), nil
	})
}
