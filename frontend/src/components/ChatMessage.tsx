import {Message, User} from "../types";
import {clsx} from "clsx";

interface ChatMessageProps {
  user: User;
  message: Message;
}

export default function ChatMessage({user, message}: ChatMessageProps) {
  return <div className={clsx("chat", user.id === message.sender.id ? "chat-end" : "chat-start")}>
    <div className="chat-header">
      {message.sender.username}
      <time className="text-xs opacity-50">{message.time}</time>
    </div>
    <div className="chat-bubble">{message.message}</div>
  </div>
}