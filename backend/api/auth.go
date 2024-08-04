package api

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/pektezol/journal/backend/database"
	"github.com/pektezol/journal/backend/models"
)

func IsAuthenticated(c *gin.Context) {
	tokenString := c.GetHeader("Authorization")
	bearer := strings.Contains(tokenString, "Bearer")
	if !bearer {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "token is not a bearer token"})
		return
	}
	tokenString = strings.Split(tokenString, " ")[1]
	// Validate token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if token == nil {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "token is null"})
		return
	}
	if err != nil {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check exp
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "token is expired"})
			return
		}
		user := models.User{}
		database.DB.Where("username = ?", claims["sub"]).First(&user)
		if user.ID == 0 {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "user not found"})
			return
		}
		c.Set("user_id", user.ID)
		c.Next()
	} else {
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "token is invalid"})
		return
	}
}
