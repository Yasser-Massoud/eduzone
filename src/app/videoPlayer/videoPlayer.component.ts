import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../services/shared.service';
import { CousesService } from '../services/course.service';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-videoPlayer',
  templateUrl: './videoPlayer.component.html',
  styleUrls: [
    './videoPlayer.component.scss',
    '../test-star/test-star.component.css',
  ],
})
export class VideoPlayerComponent implements OnInit {
  course: any;
  student: any;
  selectedValue: any;
  Url: any;
  comments: any;
  studentID: any;
  comment = {
    author: '',
    text: '',
  };
  constructor(
    private sharedService: SharedService,
    private cousesService: CousesService,
    private studentService: StudentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.course = this.sharedService.getCourse();
    this.student = this.sharedService.getStudent();
    this.comments = this.course.comments.reverse();
    this.course.numberOfViews++;
    console.log(this.course.numberOfViews);
    this.sharedService.sendValue(this.course._id);
    this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.course.videoUrl
    );
    this.cousesService
      .updateCourse(this.course._id, {
        numberOfViews: this.course.numberOfViews,
      })
      .subscribe((res) => {
        console.log(res);
      });
  }

  countChange(event: any) {
    console.log('event', event);
    this.selectedValue = event;
    // this.sharedService.sendValue(this.course._id)
    console.log('selected in video player', this.selectedValue);
  }

  addComment() {
    const data = {
      author: this.student.firstName,
      text: this.comment.text,
    };
    console.log(data);
    this.course.comments.push(data);
    console.log(this.course.comments);
    console.log('course', this.course);
    this.cousesService
      .updateCourse(this.course._id, { comments: this.course.comments })
      .subscribe((res) => {
        console.log(res);
      });
  }
}
