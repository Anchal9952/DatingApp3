import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { ToastrModule } from 'ngx-toastr';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { ErrorInterceptor } from './_interceptor/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { TestsComponent } from './nav/tests/tests.component';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { JwtInterceptor } from './_interceptor/jwt.interceptor';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from './_modules/shared.module';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { DatePickerComponent } from './_forms/date-picker/date-picker.component';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { HasRoleDirective } from './_directives/has-role.directive';
// import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
// import { HasRoleDirective } from './_directives/has-role.directive';
// import { UserMamagementComponent } from './admin/user-mamagement/user-mamagement.component';
// import { PhotoMamagementComponent } from './admin/photo-mamagement/photo-mamagement.component';
// import { UserManangementComponent } from './admin/user-manangement/user-manangement.component';
// import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    MemberDetailComponent,
    ListsComponent,
    MessagesComponent,    
    TestErrorComponent, NotFoundComponent, ServerErrorComponent, TestsComponent, MemberCardComponent, MemberEditComponent, PhotoEditorComponent, TextInputComponent, DatePickerComponent, MemberMessagesComponent, AdminPanelComponent, UserManagementComponent, PhotoManagementComponent,
    HasRoleDirective
    // , AdminPanelComponent, HasRoleDirective, UserMamagementComponent, PhotoMamagementComponent, UserManangementComponent, PhotoManagementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [
   {provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true},
   {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
   {provide:HTTP_INTERCEPTORS,useClass:LoadingInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
