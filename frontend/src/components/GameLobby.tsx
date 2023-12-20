import { useState, useEffect } from 'react'
import { RoundedButton } from '../assets/StyledComponents/FormComponents'
import {
  initializeSocket,
  createRoom,
  joinRoom,
  onRoomCreated,
  onMessageReceived,
  sendMessage,
  getRooms,
  onRoomsReceived,
} from '../api/socket'

const GameLobby = () => {
  const [roomName, setRoomName] = useState('')
  const [rooms, setRooms] = useState([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    initializeSocket()

    onRoomCreated((roomName) => {
      setRooms((prevRooms) => [...prevRooms, roomName])
    })

    onRoomsReceived((rooms) => {
      setRooms(rooms)
    })

    getRooms()
  }, [])

  const handleSendMessage = () => {
    sendMessage(roomName, message)
  }

  const handleCreateTable = () => {
    createRoom(roomName)
  }

  const handleJoinTable = (room: string) => {
    setRoomName(room)
    joinRoom(room)
  }

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value)
  }

  const handleMessageChange = (event) => {
    setMessage(event.target.value)
    onMessageReceived((message) => {
      console.log('New message:', message)
      setMessages((prevMessages) => [...prevMessages, message])
    })
  }

  return (
    <div>
      <h1>Game Lobby</h1>
      <input
        type="text"
        placeholder="Enter table name"
        value={roomName}
        onChange={handleRoomNameChange}
      />
      <RoundedButton id="create-table" onClick={handleCreateTable}>
        Create table
      </RoundedButton>
      <h2>Existing Rooms</h2>
      <ul>
        {rooms.map((room, index) => (
          <RoundedButton key={index} onClick={() => handleJoinTable(room)}>
            {room}
          </RoundedButton>
        ))}
      </ul>
      <input type="text" placeholder="message" value={message} onChange={handleMessageChange} />
      <p>Message</p>
      <p>
        {messages.map((message) => (
          <p> {message}</p>
        ))}
      </p>
      <button onClick={handleSendMessage}>Send message</button>
    </div>
  )
}

export default GameLobby
