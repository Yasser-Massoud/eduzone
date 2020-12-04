import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../services/student.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  student = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  registred = false;
  validationError = '';

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {}

  register() {
    const studentInfo = this.student;
    this.studentService.studentRegister(studentInfo).subscribe(
      (res) => {
        this.registred = !this.registred;
        console.log(res);
        ///send email to student
        this.studentService.sendEmail({ email: this.student.email });
      },
      (error) => {
        this.validationError = error.error;
        console.log(this.validationError);
      }
    );
  }
}

