import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

const routes: Routes = [
  //{ path: '', redirectTo: 'login', pathMatch:'full' },
  { path: '', component: LoginComponent},
  { path: 'verify-email', component: VerifyEmailComponent},
  { path: 'password-recovery', component: PasswordRecoveryComponent},
  { path: 'register', component: RegisterComponent},
  //{ path: '**', redirectTo: 'login', pathMatch:'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
