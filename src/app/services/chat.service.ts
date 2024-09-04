import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  private _socket: Socket;
  baseUrl = enviroment.baseUrl

  constructor(private http: HttpClient) { 
    this._socket = io(this.baseUrl,{})

    this._socket.on('connect_error',(error)=>{
      console.log('Socket connection error',error);
    })
   
    this._socket.on('connect',()=>{
      console.log('Successfully connected to socket server')
    })
  }

  joinRoom(roomId: string){
    this._socket.emit('joinRoom',roomId)
  }

  leaveRoom(roomId: string){
    this._socket.emit('leaveRoom',roomId)
  }
  sendMessage(senderId: string,receiverId: string,message: string,roomId: string, sendername: string){
    this._socket.emit('sendMessage',{senderId,receiverId,message,roomId,sendername})
  }

  receiveMessage(): Observable<any>{
    return new Observable(observer => {
      this._socket.on('receiverMessage',(data)=>{
        console.log('Message received from socket:', data);
        if (data) {
          observer.next(data);
        } else {
          console.log('Received undefined data from socket.');
        }
      })
    })
  }

  getMessages(senderId: string,receiverId: string): Observable<any>{
    const requestBody = {senderId: senderId,receiverId: receiverId};
    return this.http.post(`${this.baseUrl}/user/getmessages`,requestBody)
  }

  // Group

  sendGroupMessage(senderId: string, groupId: string, message: string): void {
    this._socket.emit('groupMessage', { senderId, groupId, message });
  }
  
  receiveGroupMessage(groupId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this._socket.on('groupMessage', (message: any) => {
        if (message.roomId === groupId) {
          observer.next(message);
        }
      });
    });
  }

}
