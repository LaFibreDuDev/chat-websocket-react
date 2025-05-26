import {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react'
import './App.css'
import io from 'socket.io-client'
import type { FormEvent } from "react";
import {Message, User} from "./types";
import Chat from "./components/Chat";
import ChatUsers from "./components/ChatUsers.tsx";
import {debounce, throttle} from "lodash";

const socketUri = import.meta.env.VITE_SOCKET_URI || 'http://localhost:3000';
const socket = io(socketUri)
const emitStoppedWriting = debounce(() => { socket.emit('stopped_writing_message') }, 2000)
const emitIsWriting = throttle(() => { socket.emit('is_writing_message') }, 500)

function App() {

  const [user, setUser] = useState<null | User>(null)
  const [users, setUsers] = useState<User[]>([])

  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([])

  /*useEffect(() => {

    // define username
    const username = 'Bob'
    const user: User = {id: socket.id!, username, isWriting: false}
    setUser(user)

    // define 20 users
    const users: User[] = [
      {id: '1', username: 'Bob', isWriting: true},
      {id: '2', username: 'Alice', isWriting: false},
      {id: '3', username: 'Charlie', isWriting: false},
      {id: '4', username: 'Dave', isWriting: false},
      {id: '5', username: 'Eve', isWriting: false},
      {id: '6', username: 'Frank', isWriting: false},
      {id: '7', username: 'George', isWriting: false},
      {id: '8', username: 'Harry', isWriting: false},
      {id: '9', username: 'Ivan', isWriting: false},
      {id: '10', username: 'Jane', isWriting: false},
      {id: '15', username: 'Eve', isWriting: false},
      {id: '16', username: 'Frank', isWriting: false},
      {id: '17', username: 'George', isWriting: false},
      {id: '18', username: 'Harry', isWriting: false},
      {id: '19', username: 'Ivan', isWriting: false},
      {id: '20', username: 'Jane', isWriting: false},
      {id: '15', username: 'Eve', isWriting: false},
      {id: '16', username: 'Frank', isWriting: false},
      {id: '17', username: 'George', isWriting: false},
      {id: '18', username: 'Harry', isWriting: false},
      {id: '19', username: 'Ivan', isWriting: false},
      {id: '20', username: 'Jane', isWriting: false},
    ]
    setUsers(users)

    // define 10 messages
    const randomMessage: Message = {
      message: 'Salut !',
      sender: {id: '1', username: 'Bob', isWriting: false},
      time: new Date().toLocaleTimeString()
    }
    // generate 10 messages
    const messages: Message[] = []
    for (let i = 0; i < 10; i++) {
      messages.push(randomMessage)
    }
    messages.push({
      message: 'Comment ça va ce soir le chat ?',
      sender: {id: socket.id!, username: 'LaFibre', isWriting: false},
      time: new Date().toLocaleTimeString()
    })
    setReceivedMessages(messages)
  }, [])*/

  const usersAreWriting = users.filter(currentUser => currentUser.isWriting && user?.id !== currentUser.id)

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Mon identifiant est ${socket.id}`)
    })

    socket.on('users_connected', (connectedUsers: User[]) => {
      setUsers(connectedUsers)
    })

    socket.on('receive_message', (message: Message) => {
      setReceivedMessages((prevReceivedMessages) => [...prevReceivedMessages, message])
    })

    return () => {
      socket.off('receive_message')
      socket.off('users_connected')
      socket.off('connect')
      socket.disconnect()
    }
  }, [])

  const onMessageWriting = (e: ChangeEvent<HTMLInputElement>) => {
    const message = e.target.value
    setMessage(message)
    emitIsWriting()
  }

  const onKeyUpMessage = (e: KeyboardEvent<HTMLInputElement>)=> {
    e.preventDefault()
    emitStoppedWriting()
  }

  const handleUsernameSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const user: User = {id: socket.id!, username, isWriting: false}
    setUser(user)
    setUsers((prevUsers) => [...prevUsers, user])
    socket.emit('set_username', username)
  }
  const handleMessageSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`envoi du message : ${message}`)
    socket.emit('stopped_writing_message')
    socket.emit('send_message', message)
    setMessage('')
  }

  return (
    <div className="h-screen overflow-hidden">
      {user === null ? (
        <form className=" h-full flex justify-center items-center gap-2" onSubmit={handleUsernameSubmit}>
          <div className="card bg-base-100 w-96 shadow-sm">
            <div className="card-body items-center text-center">
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Tapez votre pseudo..."
                className="input input-bordered w-full"
              />
              <button className="btn btn-primary">Envoyer</button>
            </div>
          </div>
        </form>
        ): (
        <div className="flex h-full">
          <Chat
            receivedMessages={receivedMessages}
            handleMessageSubmit={handleMessageSubmit}
            message={message}
            user={user}
            usersAreWriting={usersAreWriting}
            onMessageWriting={onMessageWriting}
            onKeyUpMessage={onKeyUpMessage}
          />
          <ChatUsers users={users}/>
        </div>
      )}
    </div>
  )
}

export default App
