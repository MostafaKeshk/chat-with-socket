import React, { useState, useRef, useEffect } from "react";
import Form from "./components/UsernameForm";
import Chat from "./components/Chat";
import io from "socket.io-client";
import immer from "immer";
import "./App.css";

const initialMessagesState = {
  room1: [],
  room2: [],
};

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "room1",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["room1"]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    setMessage("");
  }, [messages]);

  const sendMessage = () => {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send message", payload);
    const newMessage = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessage);
  };

  const roomJoinCallback = (incomingMessages, room) => {
    const newMessages = immer(messages, (draft) => {
      draft[room] = incomingMessages;
    });
    setMessages(newMessages);
  };

  const joinRoom = (room) => {
    const newConnectedRooms = immer(connectedRooms, (draft) => {
      draft.push(room);
    });

    socketRef.current.emit("join room", room, (messages) =>
      roomJoinCallback(messages, room)
    );
    setConnectedRooms(newConnectedRooms);
  };

  const toggleChat = (currentChat) => {
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });
      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  };

  const connect = () => {
    setConnected(true);
    socketRef.current = io.connect("http://localhost:8000/");
    socketRef.current.emit("join server", username);
    socketRef.current.emit("join room", "room1", (messages) =>
      roomJoinCallback(messages)
    );
    socketRef.current.on("new user", (allUsers) => {
      setAllUsers(allUsers);
    });
    socketRef.current.on("new message", ({ content, sender, chatName }) => {
      setMessages((messages) => {
        const newMessages = immer(messages, (draft) => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = { content, sender };
          }
        });
        return newMessages;
      });
    });
  };

  let body;

  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    );
  }

  return <div className="App">{body}</div>;
}

export default App;
