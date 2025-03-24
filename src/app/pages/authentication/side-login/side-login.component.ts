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

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  private inactivityTimeout: any;

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem("access_token");

    if (token) {
        this.validateToken(token);
        this.resetInactivityTimeout();
    } else {
        alert("Token no encontrado. Por favor, inicia sesión.");
        this.router.navigate(['/authentication/login']);
    }
}


  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  submit() {
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
        console.log("Decoded Token: ", decodedToken);
        localStorage.setItem("decodedToken", JSON.stringify(decodedToken));

        // Navegar al dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        // Manejar errores
        console.error('Error de autenticación', error);
        alert('Usuario o contraseña incorrectos');
      }
    );
  }

  private parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  private validateToken(token: string) {
    this.http.post("http://127.0.0.1:8000/verifytoken", {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(
      (response: any) => {
        console.log("Token valido: ", response.data);
      },
      (error) => {
        if (error.status === 401) {
          alert(error.error.message);
          localStorage.removeItem("access_token");
          localStorage.removeItem("decodedToken");
          window.location.href = "../../index.html";
        } else {
          console.error("Error durante la validación del token: ", error);
          alert("Error durante la validación del token. Inténtalo de nuevo.");
        }
      }
    );
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      alert("Sesión expirada por inactividad. Por favor, inicia sesión de nuevo.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("decodedToken");
      window.location.href = "../../index.html";
    }, 300000); // 5 minutos en milisegundos
  }
}