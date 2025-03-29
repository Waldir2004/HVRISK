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

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem("access_token");

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
}