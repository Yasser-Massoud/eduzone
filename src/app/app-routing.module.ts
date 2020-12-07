import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutUsComponent } from './About-us/About-us.component';
import { TeacherRegisterComponent } from './teacher-register/teacher-register.component';
import { TeacherLoginComponent } from './teacher-login/teacher-login.component';
import { HomeComponent } from './home/home.component';

import { CourseFormComponent } from './course-form/course-form.component';
import { StudentInfoComponent } from './student-update-info/student-update-info.component';
import { UpdateTeacherComponent } from './update-teacher/update-teacher.component';
import { TermOfServiceComponent } from './termOfService/termOfService.component';

import { VideoPlayerComponent } from './videoPlayer/videoPlayer.component';

import { StudentProfileComponent } from './student-profile/student-profile.component';
import { FilterComponent } from './filter/filter.component';
import { TypeComponent } from './type/type.component';
// import { RatingComponent } from './rating/rating.component';
import { TestStarComponent } from './test-star/test-star.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { SearchComponent } from './search/search.component';
import { SearchResultComponent } from './searchResult/searchResult.component';
import { BalanceComponent } from './Balance/Balance.component';
import { VideoChatComponent } from './video-chat/video-chat.component';
import { CheckOutPayementComponent } from './checkOutPayement/checkOutPayement.component';
import { ScienceFilterComponent } from './science-filter/science-filter.component';
import { GDfilterComponent } from './GDfilter/GDfilter.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },

  { path: 'balance', component: BalanceComponent },
  { path: 'rating', component: TestStarComponent },
  { path: 'home', component: HomeComponent },
  { path: 'type', component: FilterComponent },
  { path: 'design', component: TypeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'aboutUs', component: AboutUsComponent },
  { path: 'teacherRegister', component: TeacherRegisterComponent },
  { path: 'teacherLogin', component: TeacherLoginComponent },
  { path: 'Profile', component: StudentProfileComponent },
  { path: 'updateTeacher', component: UpdateTeacherComponent },
  { path: 'updateStudentInfo', component: StudentInfoComponent },
  { path: 'servicesTerms', component: TermOfServiceComponent },
  { path: 'videoPlayer', component: VideoPlayerComponent },
  { path: 'addCourse', component: CourseFormComponent },
  { path: 'dashboard', component: TeacherProfileComponent },
  { path: 'search', component: SearchComponent },
  { path: 'searchResult', component: SearchResultComponent },
  { path: 'payement', component: CheckOutPayementComponent },
  { path: 'sciencefilter', component: ScienceFilterComponent },
  { path: 'gdfilter', component: GDfilterComponent },
  { path: 'videoChat', component: VideoChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
