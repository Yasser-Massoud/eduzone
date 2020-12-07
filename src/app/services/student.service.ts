import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const serverUrl = 'http://localhost:8080/student/';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) {}

  studentRegister(studentInfo: any): Observable<any> {
    return this.http.post(serverUrl + 'studentRegistration', studentInfo);
  }
  studentLogin(userInfo: any): Observable<any> {
    return this.http.post(serverUrl + 'login', userInfo);
  }
  studentProfile(id: any): Observable<any> {
    return this.http.get(serverUrl + id);
  }
  updateInfo(id: any, updatedInfo: any): Observable<any> {
    return this.http.put(serverUrl + id, updatedInfo);
  }
  ////send email to student
  sendEmail(studentEmail: any): Observable<any> {
    return this.http.post(serverUrl + '/sendemail', studentEmail);
  }

     //send request to join a  room via email
     sendRequest(email:any ,roomNumber:any,firstName:any,lastName:any): Observable<any>{
      return this.http.post(serverUrl +'/sendRequestVideo',{email,roomNumber,firstName,lastName})
    }


  //buy course
  buyCourse(id: any, data: any): Observable<any> {
    return this.http.put(serverUrl + '/likeCourse/' + id, data);
  }
}
