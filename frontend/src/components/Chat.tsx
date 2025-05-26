import {ChangeEvent, FormEvent, KeyboardEvent, useEffect, useRef} from "react";
import {Message, User} from "../types";
import ChatMessage from "./ChatMessage.tsx";

interface ChatProps {
  receivedMessages: Message[];
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
  user: User;
  usersAreWriting: User[];
  message: string;
  onMessageWriting: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyUpMessage: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export default function Chat({
                               receivedMessages,
                               handleMessageSubmit,
                               user,
                               usersAreWriting,
                               message,
                               onMessageWriting,
                               onKeyUpMessage}: ChatProps) {

  const messageIsWriting = () => {
    if (usersAreWriting && usersAreWriting.length > 0) {
      if (usersAreWriting.length === 1) {
        return `${usersAreWriting[0].username} est en train d'écrire...`
      } else if (usersAreWriting.length < 3) {
        const usersAreWritingString = usersAreWriting.map(user => user.username).join(', ')
        return `${usersAreWritingString} sont en train d'écrire...`
      } else {
        return `${usersAreWriting.length} utilisateurs sont en train d'écrire...`
      }
    }
  }

  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [receivedMessages, usersAreWriting]);

  return <div className="flex-1 flex flex-col bg-base-200">
    <div className="bg-primary text-primary-content p-4">
      <h1 className="text-xl font-bold">Chat en direct</h1>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-3 relative" ref={chatRef} id="messageContainer">
      {receivedMessages.map((message, index) => (
        <ChatMessage key={index} user={user} message={message}/>
      ))}
      {usersAreWriting.length > 0 && <div className="chat chat-start" id="typing-indicator">
          <div className="alert alert-info">
              <div className="flex items-center gap-2">
                  <div className="loading loading-dots loading-sm"></div>
                  <span>{messageIsWriting()}</span>
              </div>
          </div>
      </div>}
    </div>
    <div className="p-4 bg-base-100">

      <form className="flex gap-2" onSubmit={handleMessageSubmit}>
        <input
          type="text"
          id="messageInput"
          placeholder="Tapez votre message..."
          className="input input-bordered w-full"
          value={message}
          onChange={(e) => onMessageWriting(e)}
          onKeyUp={(e) => onKeyUpMessage(e)}
        />
        <button className="btn btn-primary">Envoyer</button>
      </form>
    </div>
  </div>
}