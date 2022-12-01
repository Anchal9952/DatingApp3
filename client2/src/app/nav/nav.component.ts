import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
model:any = {}
// loggedIn =false;
currentUsers$:Observable<User | null> = of(null)


  constructor(public accountService:AccountService, private router: Router) { }

  ngOnInit(): void {
    this.currentUsers$ = this.accountService.currentUsers$;
  }


  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl('/members'),      
      // error: error =>this.toastr.error(error.error)
    })    
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/')
    }
    
}
