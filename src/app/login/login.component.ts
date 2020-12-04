import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: '',
  };
  loggedIn = false;

  validationError = '';

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {}

  login() {
    const userInfo = this.user;
    this.studentService.studentLogin(userInfo).subscribe(
      (res) => {
        this.loggedIn = true;
        window.localStorage.setItem('token', res.token);
        window.localStorage.setItem('id', res.id);
        console.log(res);
        location.reload();
      },
      (error) => {
        this.validationError = error.error;
        console.log(this.validationError);
      }
    );
  }
}
