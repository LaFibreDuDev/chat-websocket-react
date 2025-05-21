import {useEffect, useState} from 'react'
import './App.css'
import io from 'socket.io-client'
import type { FormEvent } from "react";

const socket = io('http://localhost:3000')

interface Message {
  message: string,
  sender: string,
  time: string
}

function App() {

  const [message, setMessage] = useState('')
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log(`Mon identifiant est ${socket.id}`)
    })

    socket.on('receive_message', (message: Message) => {
      setReceivedMessages((prevReceivedMessages) => [...prevReceivedMessages, message])
    })

    return () => {
      socket.off('receive_message')
      socket.off('connect')
    }
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`envoi du message : ${message}`)
    socket.emit('send_message', message)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="bg-primary text-primary-content p-4 rounded-t-box">
            <h2 className="card-title">Chat en direct</h2>
          </div>
          <div className="flex flex-col h-[80vh]">
            <div className="flex-grow overflow-y-auto p-4 space-y-4" id="messageContainer">
              {receivedMessages.map((message, index) => (
                <div key={index} className="chat chat-start">
                  <div className="chat-header">
                    Inconnu
                    <time className="text-xs opacity-50">{message.time}</time>
                  </div>
                  <div className="chat-bubble">{message.message}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-base-200 rounded-b-box">
              <form className="flex gap-2" onSubmit={handleSubmit}>
                <input
                  type="text"
                  id="messageInput"
                  placeholder="Tapez votre message..."
                  className="input input-bordered w-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="btn btn-primary">Envoyer</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
