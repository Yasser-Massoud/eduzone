import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../services/teacher.service';

@Component({
  selector: 'app-all-teachers',
  templateUrl: './all-teachers.component.html',
  styleUrls: ['./all-teachers.component.css'],
})
export class AllTeachersComponent implements OnInit {
  teachers: any;
  constructor(private teacherService: TeacherService) {}

  ngOnInit() {
    this.teacherService.getAllTeachers().subscribe((res) => {
      console.log(res);
      this.teachers = res;
      console.log(res);
    });
  }
}
