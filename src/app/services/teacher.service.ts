import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const teacherUrl = 'http://localhost:8080/teacher/';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  loggedIn: boolean = false;
  constructor(private http: HttpClient) {}

  teacherRegister(teacherInfo: any): Observable<any> {
    return this.http.post(teacherUrl + 'add', teacherInfo);
  }
  teacherLogin(teacherInfo: any): Observable<any> {
    return this.http.post(teacherUrl + 'login', teacherInfo);
  }

  teacherUpdate(teacherInfo: any, id: any): Observable<any> {
    return this.http.put(teacherUrl + `${id}`, teacherInfo);
  }

  getConnectedTeacher(id: any): Observable<any> {
    return this.http.get(teacherUrl + id);
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(teacherUrl);
  }

  //send mail to teacher
  sendEmail(teacherEmail: any): Observable<any> {
    return this.http.post(teacherUrl + '/sendemail', teacherEmail);
  }

  teacherUpdateBalance(id: any, teacherInfo: any): Observable<any> {
    return this.http.put(teacherUrl + 'balance/' + `${id}`, teacherInfo);
  }
}
