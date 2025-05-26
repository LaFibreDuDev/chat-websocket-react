import {User} from "../types";

interface ChatUsersProps {
  users: User[];
}

export default function ChatUsers({users}: ChatUsersProps) {
  return <div className="w-80 text-secondary-content flex flex-col ">
    <div className="p-4 bg-secondary">
      <h2 className="text-lg font-bold">Utilisateurs</h2>
    </div>
    <div className="flex-1 overflow-y-auto p-2 bg-base-300">
      <div className="space-y-2">
        {users.map((user, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <div className="avatar avatar-placeholder">
              <div className="bg-secondary text-neutral-content w-10 rounded-full">
                <span className="text-sm font-bold">{ user.username[0] }</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-medium">{user.username}</div>
              <div className="text-sm opacity-70">En ligne</div>
            </div>
            <div className="status status-success"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
}