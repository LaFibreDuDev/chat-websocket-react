import {ChangeEvent, FormEvent, KeyboardEvent} from "react";
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
    if(usersAreWriting && usersAreWriting.length > 0) {
      if(usersAreWriting.length === 1) {
        return `${usersAreWriting[0].username} écrit...`
      } else if (usersAreWriting.length < 3) {
        const usersAreWritingString = usersAreWriting.map(user => user.username).join(', ')
        return `${usersAreWritingString} écrivent...`
      } else {
        return `${usersAreWriting.length} utilisateurs écrivent...`
      }
    }
  }

  return <div className="card w-full bg-base-100 shadow-xl">
    <div className="card-body p-0">
      <div className="bg-primary text-primary-content p-4 rounded-t-box">
        <h2 className="card-title">Chat en direct</h2>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4 relative" id="messageContainer">
          {receivedMessages.map((message, index) => (
            <ChatMessage key={index} user={user} message={message} />
          ))}
          {usersAreWriting.length > 0 && <div className="absolute bottom-0 left-0 w-full bg-neutral p-2">
            <p className="italic">
              {messageIsWriting()}
            </p>
          </div>}
        </div>
        <div className="p-4 bg-base-200 rounded-b-box">
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
    </div>
  </div>
}