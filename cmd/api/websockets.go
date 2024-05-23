package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"social-network/internal/data"
	"social-network/internal/validator"
	"sync"

	"github.com/gorilla/websocket"
)

type WSPayload struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Message  string `json:"message"`
	GroupID  string `json:"group_id"`
	Online   string `json:"online"`
	Type     string `json:"type"`
}

type Client struct {
	UserID string
	conn   *websocket.Conn
}

type ChatService struct {
	mu      *sync.Mutex
	Clients []*Client
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func (app *application) newChatMessage(payload *WSPayload, client *Client) *data.Message {
	id, err := app.generateUUID()
	if err != nil {
		return nil
	}
	return &data.Message{
		ID:       id,
		Sender:   client.UserID,
		Receiver: payload.Receiver,
		Message:  payload.Message,
		GroupID:  payload.GroupID,
	}
}

func NewClient(userID string, conn *websocket.Conn) *Client {
	return &Client{
		UserID: userID,
		conn:   conn,
	}
}

func NewChatService(mu *sync.Mutex, clients []*Client) *ChatService {
	return &ChatService{
		mu:      mu,
		Clients: clients,
	}
}

func (app *application) wsHandler(w http.ResponseWriter, r *http.Request) {
	user := app.contextGetUser(r)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {

		fmt.Println(err)
	}

	client := NewClient(user.ID, conn)
	app.ChatService.addClient(client)
	fmt.Println(app.ChatService.Clients)

	go app.handleConnection(client, r)
}

func (cs *ChatService) addClient(nc *Client) {
	cs.mu.Lock()
	defer cs.mu.Unlock()
	for _, client := range cs.Clients {
		if client.conn == nc.conn {
			return
		}
	}
	cs.Clients = append(cs.Clients, nc)
}

func (cs *ChatService) removeClient(client *Client) {
	cs.mu.Lock()
	defer cs.mu.Unlock()
	newClients := []*Client{}
	for _, cl := range cs.Clients {
		if cl.conn != client.conn {
			newClients = append(newClients, cl)
		}
	}
	cs.Clients = newClients
}


func (app *application) handleConnection(client *Client, r *http.Request) {
	for {
		mt, messageRaw, err := client.conn.ReadMessage()
		if err != nil {
			app.ChatService.removeClient(client)
			return
		}

		var payload WSPayload
		err = json.Unmarshal(messageRaw, &payload)
		if err != nil {
			fmt.Println(err)
			continue
		}

		payload.Sender = app.contextGetUser(r).ID

		v := validator.New()

		switch payload.Type {
		case "private_message":
			message := app.newChatMessage(&payload, client)
			if data.ValidateChatMessage(v, message); !v.Valid() {
				fmt.Println("jouuu", v.Errors)
				continue
			}
			err := app.models.Messages.Insert(message)
			if err != nil {
				fmt.Println(err)
				return
			}
		case "group_message":
			message := app.newChatMessage(&payload, client)
			if data.ValidateGroupMessage(v, message); !v.Valid() {
				fmt.Println("jouuu", v.Errors)
				continue
			}
			_, err := app.models.GroupMembers.CheckIfMember(payload.GroupID, client.UserID)
			if err != nil {
				log.Println("Not a group member", err)
				continue
			}
			err = app.models.Messages.Insert(message)
			if err != nil {
				fmt.Println(err)
				return
			}
		}
		app.sendMessage(&payload, client, mt)
	}
}

func (app *application) sendMessage(payload *WSPayload, currentClient *Client, messageType int) {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("krt", err)
		return
	}
	for _, client := range app.ChatService.Clients {
		if client.conn != currentClient.conn {
			switch payload.Type {
			case "private_message":
				if payload.Receiver == client.UserID {
					client.conn.WriteMessage(messageType, jsonPayload)
				}

			case "group_message":
				members, err := app.models.GroupMembers.GetAllGroupMembers(payload.GroupID)
				if err != nil {
					log.Println(err)
					continue
				}

				for _, member := range members {
					if member.UserID == client.UserID {
						client.conn.WriteMessage(messageType, jsonPayload)
					}
				}
			case "notification":
				if payload.Receiver == client.UserID {
					client.conn.WriteMessage(messageType, jsonPayload)
				} else if payload.Receiver == "" && payload.GroupID != "" {
						members, err := app.models.GroupMembers.GetAllGroupMembers(payload.GroupID)
				if err != nil {
					log.Println(err)
					continue
				}

				for _, member := range members {
					if member.UserID == client.UserID {
						client.conn.WriteMessage(messageType, jsonPayload)
					}
				}
				}
			}
		}
	}
}
