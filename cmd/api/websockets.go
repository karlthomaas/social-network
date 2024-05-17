package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"social-network/internal/data"
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

	go app.handleConnection(w, r, client)
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

func (app *application) handleConnection(w http.ResponseWriter, r *http.Request, client *Client) {
	for {
		mt, message, err := client.conn.ReadMessage()
		if err != nil {
			app.ChatService.removeClient(client)
			return
		}

		var payload WSPayload
		err = json.Unmarshal(message, &payload)
		if err != nil {
			fmt.Println(err)
			continue
		}
		if payload.Type == "message" {
			message := app.newChatMessage(&payload, client)
			err := app.models.Messages.Insert(message)
			if err != nil {
				app.serverErrorResponse(w, r, err)
				return
			}
		}
		app.ChatService.sendMessage(&payload, client, mt)
	}
}

func (cs *ChatService) sendMessage(payload *WSPayload, currentClient *Client, messageType int) {
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("krt", err)
		return
	}
	for _, client := range cs.Clients {
		if client.conn != currentClient.conn {
			switch payload.Receiver != "" {
			case payload.Receiver == client.UserID && payload.Type == "message":
				client.conn.WriteMessage(messageType, jsonPayload)
			case payload.Receiver != client.UserID:
				continue
			default:
				client.conn.WriteMessage(messageType, jsonPayload)
			}
		}
	}
}
