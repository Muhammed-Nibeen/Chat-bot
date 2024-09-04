import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { OtpVerifyComponent } from './components/otp-verify/otp-verify.component';
import { LoginComponent } from './components/login/login.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { GroupComponent } from './components/group/group.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import {DialogModule} from 'primeng/dialog'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    OtpVerifyComponent,
    LoginComponent,
    UserHomeComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,           
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CommonModule,
    PickerModule,
    DialogModule,
    BrowserAnimationsModule,
    MessagesModule,
    MessageModule
  ],
  providers: [
    provideClientHydration(),
    MessageService,
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
