import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { LoginResponse, ResendOtpRes, User, VerifyOtpResponse } from '../../interfaces/interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  baseUrl = enviroment.baseUrl

  constructor(private http: HttpClient) { }

  registerUser(userDetails:User){
    return this.http.post(`${this.baseUrl}/user/signup`,userDetails)
  }

  verifyOtp(userData: string, otp: number): Observable<VerifyOtpResponse> {
    const requestBody = { userData: userData, enteredOtp: otp };
    return this.http.post<VerifyOtpResponse>(`${this.baseUrl}/user/signup/verify-otp`, requestBody)
  }  

  resendOtp(userDetails:User):Observable<ResendOtpRes>{
    return this.http.post<ResendOtpRes>(`${this.baseUrl}/user/resendotp`,userDetails)
  }

  userLogin(email: string,password: string): Observable<LoginResponse>{
    const requestBody = {email:email,password:password}
    return this.http.post<LoginResponse>(`${this.baseUrl}/user/login`,requestBody)
  }

  getClients(loggedUserId:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/getclient`,{loggedUserId})
  }

  getGroups(loggedUserId:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/getgroup`,{loggedUserId})
  }

  getmemberName(senderId: any):Observable<any>{
    console.log("SECOND");
    return this.http.post(`${this.baseUrl}/user/getmembername`,{senderId})
  }

  getUsername(senderId: any):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/getusername`,{senderId})
  }

  loadName(senderId: any):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/loadname`,{senderId})
  }
    // Method to create a new group
    createGroup(userId: string, groupName: string,memberIds: string[]): Observable<any> {
      return this.http.post(`${this.baseUrl}/user/creategroup`, { userId, groupName, memberIds });
    }
  
    // Method to join an existing group
    joinGroup(groupId: string, userId: string): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/user/${groupId}/joingroup`, { userId });
    }
  
    // Method to leave a group
    leaveGroup(groupId: string, userId: string): Observable<void> {
      return this.http.post<void>(`${this.baseUrl}/user/${groupId}/leavegroup`, { userId });
    }
  
    


}
