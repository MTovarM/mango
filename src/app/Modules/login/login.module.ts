import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Component
import { LoginRoutingModule } from './login-routing.module';
import { RegisterComponent } from './components/register/register.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { LoginPageComponent } from './loginPage.component';
import { LoginComponent } from './components/login/login.component';

//Modules
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire/compat";
import { enviroment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list'; 
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    LoginPageComponent,
    LoginComponent,
    RegisterComponent,
    PasswordRecoveryComponent,
    VerifyEmailComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(enviroment.firebaseConfig),
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatListModule
  ]
})
export class LoginModule { }
