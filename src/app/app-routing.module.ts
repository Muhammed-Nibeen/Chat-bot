import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupComponent } from './components/group/group.component';
import { LoginComponent } from './components/login/login.component';
import { OtpVerifyComponent } from './components/otp-verify/otp-verify.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserHomeComponent } from './components/user-home/user-home.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'verify-otp', component: OtpVerifyComponent },
  { path: 'home', component: UserHomeComponent },
  {path:'group',component:GroupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
