export interface User {
  id: string,
  username: string
  isWriting: boolean
}

export interface Message {
  message: string,
  sender: User,
  time: string
}