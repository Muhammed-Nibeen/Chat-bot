export interface User {
  _id: string
  fullName: string;
  email: string;
  password: string;
  isblocked: Boolean
  id: string
  name: string
}

export interface VerifyOtpResponse{
  message: string
}

export interface ResendOtpRes{
  message: string;
  email: string
}

export interface LoginResponse{
  user:User
  token:string
  refreshToken:string
  message:string
}

export interface ChatMessage{
  senderId: string;
  receiverId: string;
  message: string;
  _id: string;
  timestamp: Date;
  roomId: string
  senderName: string
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  _id: string
  fullName: string;
  email: string;
  password: string;
  isblocked: Boolean

}
