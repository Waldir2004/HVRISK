import { Component, HostListener } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { GoogleAuthProvider } from 'firebase/auth';


@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    const token = localStorage.getItem('access_token');
  }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    const loginData = {
      correo_electronico: this.form.value.uname,
      contraseña: this.form.value.password,
    };

    this.http.post('http://127.0.0.1:8000/token', loginData).subscribe(
      (response: any) => {
        // Guardar el token en el almacenamiento local
        const token = response.access_token;
        localStorage.setItem('access_token', token);

        // Decodificar el token y guardarlo en el almacenamiento local
        const decodedToken = this.parseJwt(token);
        console.log('Decoded Token: ', decodedToken);
        localStorage.setItem('decodedToken', JSON.stringify(decodedToken));

        // Mostrar mensaje de éxito
        this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'], // Clase CSS personalizada
        });
        // Navegar al dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error de autenticación', error);
        let errorMessage = 'Error al iniciar sesión';

        if (error.status === 403) {
          errorMessage = 'Usuario inactivo';
        } else if (error.status === 401) {
          errorMessage = 'Usuario o contraseña incorrectos';
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }
    );
  }

  async onClickGoogle() {
    try {
      const result = await this.authService.loginGoogle();
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      // Verificar el usuario en tu backend con los datos de Google
      const response = await this.http
        .post<any>('http://127.0.0.1:8000/verify-google-user', {
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          displayName: user.displayName,
        })
        .toPromise();

      if (!response) {
        this.snackBar.open('Usuario no registrado en el sistema', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
        return;
      }

      // Almacenar el token y decodificarlo
      localStorage.setItem('access_token', response.access_token);
      const decodedToken = this.parseJwt(response.access_token);
      localStorage.setItem('decodedToken', JSON.stringify(decodedToken));

      // También almacenar los datos combinados por si acaso
      localStorage.setItem(
        'user_data',
        JSON.stringify({
          ...decodedToken, // Esto incluye todos los datos del token
          google_access_token: credential?.accessToken,
        })
      );

      this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Error en Google Login:', error);
      this.snackBar.open('Error al iniciar sesión con Google', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
