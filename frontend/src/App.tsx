import {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react'
import './App.css'
import io from 'socket.io-client'
import type { FormEvent } from "react";
import {Message, User} from "./types";
import Chat from "./components/Chat";
import ChatUsers from "./components/ChatUsers.tsx";
import {debounce} from "lodash";

const socket = io('http://localhost:3000')
const emitStoppedWriting = debounce(() => { socket.emit('stopped_writing_message') }, 4000)
const emitIsWriting = debounce(() => { socket.emit('is_writing_message') }, 500)

function App() {

  const [user, setUser] = useState<null | User>(null)
  const [users, setUsers] = useState<User[]>([])

  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([])

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
    <div className="h-screen bg-base-200 p-4">
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
        <div className="grid grid-cols-[1fr_200px] h-full gap-4">
          <Chat
            receivedMessages={receivedMessages}
            handleMessageSubmit={handleMessageSubmit}
            message={message}
            user={user}
            usersAreWriting={usersAreWriting}
            onMessageWriting={onMessageWriting}
            onKeyUpMessage={onKeyUpMessage}
          />
          <ChatUsers users={users} />
        </div>
      )}
    </div>
  )
}

export default App
