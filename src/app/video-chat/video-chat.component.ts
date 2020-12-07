import { Component, OnInit , ViewChild, ElementRef  } from '@angular/core';
import { TeacherService } from '../services/teacher.service';
import { StudentService } from '../services/student.service';
import{SocketService} from '../services/socket.service'

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
})
export class VideoChatComponent implements OnInit {
  teachers: any;

  sendToName:any;
  sendToLastName:any;
  sendToEmail:any;


  @ViewChild('selectRoom', { static: true }) selectRoom!: ElementRef;
  @ViewChild('consultingRoom', { static: true }) consultingRoom!: ElementRef;
  @ViewChild('localVideo', { static: true }) localVideo!: ElementRef;
  @ViewChild('remoteVideo', { static: true }) remoteVideo!: ElementRef;
  roomNumber: any;
  localStream: any;
  remoteStream: any;
  rtcPeerConnection: any;
  iceServers: any = {
    iceServers: [
      { urls: 'stun:stun.services.mozilla.com' },
      { urls: 'stun:stun.l.google.com:19302' },
    ],
  };
  streamConstraints: any = { audio: true, video: true };
  isCaller: any;
  end: any = false;


  constructor(private socket:SocketService , private teacherService: TeacherService ,private studentService: StudentService) {
    this.onIceCandidate=this.onIceCandidate.bind(this)
    this.onAddStream=this.onAddStream.bind(this)
   }

launchCall(){
   this.sendToEmail=this.selectRoom.nativeElement.children.email.value
   this.roomNumber=this.selectRoom.nativeElement.children.roomNumber.value
   this.teachers.map((teacher:any)=>{
      
          if(teacher.email===this.sendToEmail){
            this.sendToLastName=teacher.lastName
            this.sendToName=teacher.firstName
          }
    })
    if(this.sendToEmail){
      this.studentService.sendRequest(this.sendToEmail,this.roomNumber,this.sendToName,this.sendToLastName)
      .subscribe((res)=>{
       console.log(res)
      })
    }
   
       
     if(!this.roomNumber){
        alert("Please enter a room number")
      }else{
  //trigger the event create or join to socket io server
    this.socket.emit('create or join', this.roomNumber);
    this.selectRoom.nativeElement.style = "display: none;";
    this.consultingRoom.nativeElement.style = "display: block;";
      }
  //  console.log(this.sendToEmail,this.sendToLastName,this.sendToName)

  }

  endCall() {
    var media = this.localStream.getTracks();
    media.forEach((track: any) => {
      console.log(track);
      track.stop();
    });

    console.log(media, this.isCaller);
  }

  muteAudio() {
    var mic = this.localStream.getTracks()[0];
    mic.enabled = !mic.enabled;
    console.log(mic, this.isCaller);
  }
  disableVideo() {
    var camera = this.localStream.getTracks()[1];
    camera.enabled = !camera.enabled;
    console.log(camera, this.isCaller);
  }

  ngOnInit() {

     
    this.teacherService.getAllTeachers().subscribe((res) => {
      console.log(res);
  
      this.teachers = res;
      

      console.log(res);
    });
    // listening to the event  created
    this.socket.listen('created').subscribe(() => {
      navigator.mediaDevices
        .getUserMedia(this.streamConstraints)
        .then((stream) => {
          this.localStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.isCaller = true;
        })
        .catch((err) => {
          console.log(err);
        });
    });
    // listening to the event joined
    this.socket.listen('joined').subscribe(() => {
      navigator.mediaDevices
        .getUserMedia(this.streamConstraints)
        .then((stream) => {
          this.localStream = stream;
          this.localVideo.nativeElement.srcObject = stream;
          this.isCaller = false;
          //trigger the event ready to socket io server
          this.socket.emit('ready', this.roomNumber);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    // listening to the event candidate
    this.socket.listen('candidate').subscribe((event: any) => {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      });
      this.rtcPeerConnection.addIceCandidate(candidate);
    });
    // listening to the event
    this.socket.listen('ready').subscribe(() => {
      if (this.isCaller) {
        this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
        this.rtcPeerConnection.onicecandidate = this.onIceCandidate;
        this.rtcPeerConnection.ontrack = this.onAddStream;
        this.rtcPeerConnection.addTrack(
          this.localStream.getTracks()[0],
          this.localStream
        );
        this.rtcPeerConnection.addTrack(
          this.localStream.getTracks()[1],
          this.localStream
        );
        //start an offer
        this.rtcPeerConnection
          .createOffer()
          .then((sessionDescription: any) => {
            this.rtcPeerConnection.setLocalDescription(sessionDescription);
            //trigger the event offer
            this.socket.emit('offer', {
              type: 'offer',
              sdp: sessionDescription,
              room: this.roomNumber,
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    });

    this.socket.listen('offer').subscribe((event: any) => {
      if (!this.isCaller) {
        this.rtcPeerConnection = new RTCPeerConnection(this.iceServers);
        this.rtcPeerConnection.onicecandidate = this.onIceCandidate;
        this.rtcPeerConnection.ontrack = this.onAddStream;
        this.rtcPeerConnection.addTrack(
          this.localStream.getTracks()[0],
          this.localStream
        );
        this.rtcPeerConnection.addTrack(
          this.localStream.getTracks()[1],
          this.localStream
        );
        this.rtcPeerConnection.setRemoteDescription(
          new RTCSessionDescription(event)
        );
        this.rtcPeerConnection
          .createAnswer()
          .then((sessionDescription: any) => {
            this.rtcPeerConnection.setLocalDescription(sessionDescription);
            this.socket.emit('answer', {
              type: 'answer',
              sdp: sessionDescription,
              room: this.roomNumber,
            });
          })
          .catch((error: any) => {
            console.log(error);
          });
      }
    });

    this.socket.listen('answer').subscribe((event: any) => {
      this.rtcPeerConnection.setRemoteDescription(
        new RTCSessionDescription(event)
      );
    });
  }
  onIceCandidate(event: any) {
    if (event.candidate) {
      console.log('sending ice candidate');
      //trigger the event candidate
      this.socket.emit('candidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        room: this.roomNumber,
      });
    }
  }

  onAddStream(event: any) {
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
    this.remoteStream = event.stream;
  }
}
