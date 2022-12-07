import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../_models/member';
import { map, of, take } from 'rxjs';
import { PaginationResult } from '../_models/pagination';
import { UserParams } from '../_models/userParam';
import { AccountService } from './account.service';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
baseurl = environment.apiUrl;
members: Member[] = [];
memberCache = new Map();
user: User | undefined;
userParams: UserParams | undefined;
// paginationResults: PaginationResult<Member[]> = new PaginationResult<Member[]>;

  constructor(private http:HttpClient,private accountService: AccountService) {
    this.accountService.currentUsers$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          this.userParams = new UserParams(user);
          this.user = user;          
        }
      }
    })
   }

getUserParams(){
  return this.userParams;
}

setUserParams(params: UserParams)
{
  this.userParams = params;
}
  
resetUserParams(){
  if(this.user){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  return;
}

getMembers(userParams: UserParams){
  const response = this.memberCache.get(Object.values(userParams).join('_'));

  if(response) return of(response);

  let params = this.getPaginationheader(userParams.pageNumber,userParams.pageSize);

  params = params.append('minAge',userParams.minAge);
  params = params.append('maxAge',userParams.maxAge);
  params = params.append('gender',userParams.gender);
  params = params.append('orderBy',userParams.orderBy);

  return this.getPaginationResult<Member[]>(this.baseurl+ 'users',params).pipe(
    map(response => {
      this.memberCache.set(Object.values(userParams).join('-'),response);
      return response;
    })
  )
}

  getMember(username: string){
    const member = [...this.memberCache.values()]
   .reduce((arr, elem) => arr.concat(elem.result),[])
   .find((member: Member) => member.userName ===username);

   if(member) return of (member);
    return this.http.get<Member> (this.baseurl + 'users/'+username);
  }

updateMember(member: Member){
  return this.http.put(this.baseurl + 'users',member).pipe(
    map(() =>{
      const index = this.members.indexOf(member);
      this.members[index] = {...this.members[index], ...member}
    })
  );
}

setMainPhoto(photoId:number){
  return this.http.put(this.baseurl + 'users/set-main-photo/'+photoId,{});
}

deletePhoto(photoId: number){
  return this.http.delete(this.baseurl + 'users/delete-photo/'+ photoId);
}

addLike(username: string ){
  return this.http.post(this.baseurl + 'likes/'+ username,{});
}

getLikes(predicate: string,pageNumber: number,pageSize: number){
let params = this.getPaginationheader(pageNumber,pageSize);

params = params.append('predicate', predicate);

  return this.getPaginationResult<Member[]>(this.baseurl + 'likes',params);
}

private getPaginationResult<T>(url:string, params: HttpParams) {
  const paginationResult: PaginationResult<T> = new PaginationResult<T>;
  return this.http.get<T>(url, { observe: 'response', params }).pipe(
    map(response => {
      if (response.body) {
        paginationResult.result = response.body;
      }
      const pagination = response.headers.get('Pagination');
      if (pagination) {
        paginationResult.pagination = JSON.parse(pagination);
      }
      return paginationResult;
    })
  );
}

private getPaginationheader(pageNumber:number,pageSize:number) {
  let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);

  return params;
}
}
