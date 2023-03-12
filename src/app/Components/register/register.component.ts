import { 
  Component,
  OnInit
 } from '@angular/core';
import { 
  Validators, 
  FormBuilder, 
  FormGroup, 
  FormControl} from "@angular/forms";

import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ToastService } from 'src/app/Services/toast.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';

export interface userRegister {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;
  userRegister!: userRegister;
  isSamePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private fireAuth: AngularFireAuth,
    private toast: ToastService,
    private router: Router,
    private spinner: SpinnerService
  ){}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      firstPassword: ['', [Validators.required, Validators.minLength(8)]],
      secondPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngSubmit(): void {
    if ((<string>this.form.value.firstPassword).toLowerCase() !== 
    (<string>this.form.value.secondPassword).toLowerCase()) {
      this.isSamePassword = false;
      return; 
    }
    this.spinner.show();
    this.userRegister = {
      email: this.form.value.email,
      password: this.form.value.firstPassword
    };
    this.fireAuth.createUserWithEmailAndPassword(
      this.userRegister.email, 
      this.userRegister.password)
    .then(user => {
      this.spinner.hide();
      this.toast.success(
        'Usuario registrado',
        'El correo se ha registrado correctamente, por fovor revise su correo y active su cuenta');
      this.router.navigate(['/login']);
    })
    .catch(error => {
      var message = '';
      this.spinner.hide();
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 
          'El correo ya se encuentra registrado, por favor ingrese un correo diferente.'
          break;
        case 'auth/weak-password':
          message = 
          'La clave es tiene menos de 8 caracteres, ingrese una nueva clave.'
          break;
        case 'auth/invalid-email':
          message = 
          'El correo no tiene el formato correcto.'
          break;
        default:
          message = 'Revise los datos enviados.'
          break;
      }
      this.toast.error('Error al crear usuario', message);
    });
  }

  onChange(event: any): void {
    if ((<string>this.form.value.firstPassword).toLowerCase() !== 
    (<string>this.form.value.secondPassword).toLowerCase()) {
      this.isSamePassword = false;
      return; 
    }
    this.isSamePassword = true;
  }
}

//auth/email-already-in-use
//auth/weak-password
//auth/invalid-email