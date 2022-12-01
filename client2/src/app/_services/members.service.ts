import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseurl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  
getMembers(){
  return this,this.http.get<Member[]>(this.baseurl + 'users');
}


  getMember(username: string){
    return this.http.get<Member> (this.baseurl + 'users/'+username);
  }


}
