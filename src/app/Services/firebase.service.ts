import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SpinnerService } from '../components/spinner/spinner.service';
import { ToastService } from './toast.service';
import { FirebaseCodeError } from '../Components/utils/firebase-code-error';
import { Router } from '@angular/router';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  errors = new Map<string, string>();
  
  constructor(
    private firebaseService: AngularFireAuth,
    private toast: ToastService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    this.errors.set(FirebaseCodeError.InUse,
      'El correo ya se encuentra registrado, por favor ingrese un correo diferente.');
    this.errors.set(FirebaseCodeError.WeakPassword,
      'La clave es tiene menos de 8 caracteres, ingrese una nueva clave.');
    this.errors.set(FirebaseCodeError.InvalidEmail, 
      'El correo no tiene el formato correcto.');
    this.errors.set(FirebaseCodeError.MissingEmail, 
      'El correo no se encuentra registrado. Verifique la dirección de correo');
    this.errors.set(FirebaseCodeError.WrongPassword, 
      'La contraseña es incorrecta.');
    this.errors.set(FirebaseCodeError.UserNotFound, 
      'No se encontró el usuario, por favor valide el correo ingresado');
    this.errors.set(FirebaseCodeError.TooManyRequests, 
      'Su cuenta ha sido bloqueada temporalmente, ha superado el máximo de intentos');
  }

  createUser(user: User): Promise<void> {
    this.spinner.show();
    return this.firebaseService
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((user) => {
        this.verifyEmail();
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        var message = this.errors.get(error.code);
        this.spinner.hide();
        if (!message) {
          message = "Verifique los datos ingresados por favor" 
        }
        this.toast.error(message, 'Error al crear usuario');
      });
  }

  signIn(user: User): Promise<void> {
    this.spinner.show();
    return this.firebaseService
      .signInWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        if(response.user?.emailVerified) {
          this.router.navigate(['/dashboard']);
        }
        else {
          this.router.navigate(['/verify-email']);
        }
        this.spinner.hide(); 
      })
      .catch((error) => {
        var message = this.errors.get(error.code);
        this.spinner.hide();
        if (!message) {
          message = "Verifique los datos ingresados por favor" 
        }
        this.toast.error(message, 'Error al iniciar sesión');
      });
  }

  recoveryPassword(email: string): Promise<void> {
    this.spinner.show();
    return this.firebaseService.sendPasswordResetEmail(email)
      .then((response) => {
        this.spinner.hide();
        this.toast.success(
          'Hemos enviado un correo con el cual podrás recuperar el ingreso a tu cuenta',
          'Correo enviado exitosamente');
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        var message = this.errors.get(error.code);
        this.spinner.hide();
        if (!message) {
          message = "Verifique el correo ingresado";
        }
        this.toast.error(message, 'Error al recuperar contraseña');
      });
  }

  verifyEmail(): void {
    this.firebaseService.currentUser
    .then(response => {
      response?.sendEmailVerification()
      .then(res => {
        this.spinner.hide();
        this.toast.info(
          'El usuario se encuentra registrado correctamente, por favor revise su correo y active su cuenta',
          'Usuario registrado'
        );
      });
    })
    .catch(error => {
      this.toast.info(
        'Ha ocurrido un error al envia correo de verificación', error
      );
    });
  }
}
