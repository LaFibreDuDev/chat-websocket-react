import {User} from "../types";

interface ChatUsersProps {
  users: User[];
}

export default function ChatUsers({users}: ChatUsersProps) {
  return <div className="card w-full bg-base-100 shadow-xl">
    <div className="card-body p-0">
      <div className="bg-secondary text-primary-content p-4 rounded-t-box">
        <h2 className="card-title">Utilisateurs</h2>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-y-auto p-4 space-y-4" id="messageContainer">
          {users.map((user, index) => (
            <div key={index} className="chat chat-start">{user.username}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
}