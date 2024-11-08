package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
	"os"

	"github.com/pektezol/journal/backend/database"
	"github.com/pektezol/journal/backend/models"
)

func Encrypt(text string) (string, error) {
	block, err := aes.NewCipher([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonce := make([]byte, aesGCM.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	ciphertext := aesGCM.Seal(nonce, nonce, []byte(text), nil)
	return base64.URLEncoding.EncodeToString(ciphertext), nil
}

func Decrypt(ciphertextBase64 string) (string, error) {
	ciphertext, err := base64.URLEncoding.DecodeString(ciphertextBase64)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher([]byte(os.Getenv("SECRET_KEY")))
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	if len(ciphertext) < nonceSize {
		return "", errors.New("ciphertext too short")
	}

	nonce, ciphertext := ciphertext[:nonceSize], ciphertext[nonceSize:]
	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}

// internal function for encrypting all existing unencrypted notes from the db
func _encryptall() {
	var notes []models.Note
	err := database.DB.Find(&notes).Error
	if err != nil {
		panic(err)
	}
	for i := 0; i < len(notes); i++ {
		notes[i].Title, err = Encrypt(notes[i].Title)
		if err != nil {
			panic(err)
		}
		notes[i].Note, err = Encrypt(notes[i].Note)
		if err != nil {
			panic(err)
		}
	}
}
