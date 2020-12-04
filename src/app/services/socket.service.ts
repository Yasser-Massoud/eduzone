import {Injectable} from '@angular/core'

import { Socket } from 'ngx-socket-io';

import {Observable} from "rxjs"

@Injectable({
    providedIn:"root"
})


export class SocketService{


constructor( private socket:Socket){
   
}
 listen(eventName : string ){
     return new Observable ((subscriber)=>{
         this.socket.on(eventName , (data :any)=>{
             console.log("listen")
             console.log(eventName)
             console.log(data)
             subscriber.next(data)
         })
     })
 }
 emit(eventName : string , data:any){
     console.log("emit")
     console.log(eventName)
     console.log(data)
     this.socket.emit(eventName , data)
 }

}