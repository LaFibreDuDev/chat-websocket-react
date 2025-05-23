import {FormEvent} from "react";
import {Message, User} from "../types";
import ChatMessage from "./ChatMessage.tsx";

interface ChatProps {
  receivedMessages: Message[];
  handleMessageSubmit: (e: FormEvent<HTMLFormElement>) => void;
  user: User;
  message: string;
  setMessage: (message: string) => void;
}

export default function Chat({receivedMessages, handleMessageSubmit, user, message, setMessage}: ChatProps) {
  return <div className="card w-full bg-base-100 shadow-xl">
    <div className="card-body p-0">
      <div className="bg-primary text-primary-content p-4 rounded-t-box">
        <h2 className="card-title">Chat en direct</h2>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4" id="messageContainer">
          {receivedMessages.map((message, index) => (
            <ChatMessage key={index} user={user} message={message} />
          ))}
        </div>
        <div className="p-4 bg-base-200 rounded-b-box">
          <form className="flex gap-2" onSubmit={handleMessageSubmit}>
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
}