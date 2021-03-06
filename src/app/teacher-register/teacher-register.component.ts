import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-teacher-register',
  templateUrl: './teacher-register.component.html',
  styleUrls: ['./teacher-register.component.css'],
})
export class TeacherRegisterComponent implements OnInit {
  teacher = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };
  registred = false;
  validationError = '';
  constructor(private teacherService: TeacherService, private router: Router) {}

  ngOnInit() {}

  register() {
    const teacherInfo = this.teacher;
    this.teacherService.teacherRegister(teacherInfo).subscribe(
      (res) => {
        this.registred = !this.registred;
        console.log(res);
        //send email to teacher
        this.teacherService.sendEmail({ email: this.teacher.email });
      },
      (error) => {
        this.validationError = error.error;
        console.log(this.validationError);
      }
    );
  }
}
