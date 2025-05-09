package main

import (
	"fmt"
	socketio "github.com/googollee/go-socket.io"
)

func onconnect(s socketio.Conn) error {
	fmt.Println("New client connected", s.ID())
	s.Emit("Welcome to the go socket server")
	return nil
}

func main() {
	server := socketio.NewServer(nil)
	
	server.OnConnect("/", onconnect)

}
