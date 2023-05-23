import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { SpinnerService } from '../Components/spinner/spinner.service';
import { ToastService } from './toast.service';
import { FirebaseCodeError } from '../Components/utils/firebase-code-error';
import { Router } from '@angular/router';
import { Observable, catchError, from, map, mergeMap, of } from 'rxjs';

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
    private db: AngularFireDatabase,
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

  //#region Autenticación

  /**
   * Crear usuario
   * @param user 
   * @returns 
   */
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

  /**
   * Ingresar
   * @param user 
   * @returns 
   */
  signIn(user: User): Promise<void> {
    this.spinner.show();
    return this.firebaseService
      .signInWithEmailAndPassword(user.email, user.password)
      .then((response) => {
        if (response.user?.emailVerified) {
          this.router.navigate(['/home']);
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

  /**
   * Recuperar clave
   * @param email 
   * @returns 
   */
  recoveryPassword(email: string): Promise<void> {
    this.spinner.show();
    return this.firebaseService.sendPasswordResetEmail(email)
      .then((response) => {
        this.spinner.hide();
        this.toast.success(
          'Hemos enviado un correo con el cual podrás recuperar el ingreso a tu cuenta',
          'Correo enviado succcesssamente');
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

  /**
   * verificar email
   */
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

  /**
   * Cerrar sesión
  */
  signOut(): void {
    this.firebaseService.signOut().then(() => this.router.navigate(['/login']));
  }
  //#endregion

  //#region CRUD
  /**
   * Obtener cualquier tabla
   * @param table Nombre de tabla
   * @returns registros
   */
  getAll(table?: string): Observable<any[]> {
    return this.db.list(`/${table}`).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({ key: action.key, ...(<object>action.payload.val()) }));
        })
      );
  }

  /**
   * Obtiene tipos o marcas
   * @param table Nombre de tabla
   * @returns registros
   */
  getTypesBrands(table?: string): Observable<any> {
    return this.db.list(`/${table}`).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => ({ key: action.key, ...(<object>action.payload.val()) }));
        })
      );
  }

  /**
   * Coloca un elemento en la base de datos
   * @param registro Registro a agregar
   * @returns resultado
   */
  putRegisters(register: any, table: string): Observable<any> {
    return new Observable((observer) => {
      const ref = this.db.list(`/${table}`).push(register);
      ref
        .then(() => {
          observer.next({ succcess: true, key: ref.key });
          observer.complete();
        })
        .catch((error) => {
          observer.next({ succcess: false, error: error.message });
          observer.complete();
        });
    });
  }

  //#endregion


}
