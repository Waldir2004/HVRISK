import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  hide = true;
  userForm: FormGroup;
  roles: any[] = [];
  generos: any[] = [];
  tiposIdentificacion: any[] = [];

  selectedFile: File | null = null;
  statuses = [
    { value: 1, viewValue: 'Activo' },
    { value: 2, viewValue: 'Inactivo' },
  ];

  private createUser = 'http://127.0.0.1:8000/create_user';
  private getRoles = 'http://127.0.0.1:8000/get_roles';
  private getGeneros =
    'http://127.0.0.1:8000/get_parametro_valor_por_parametro_id/1';
  private getTipoIdentificacion =
    'http://127.0.0.1:8000/get_parametro_valor_por_parametro_id/5';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/)],],
      userRole: ['', Validators.required],
      userGender: ['', Validators.required],
      userDate: ['', Validators.required],
      userTipoIdentificacion: ['', Validators.required],
      userNumberIdentification: ['', Validators.required],
      userPhone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      userAdress: ['', Validators.required],
      userStatus: [{ value: 1, disabled: true }, Validators.required],
    });
  }

  ngOnInit() {
    this.userForm.get('userStatus')?.disable();
    this.loadRoles();
    this.loadGeneros();
    this.loadTipoIdentificacion();
  }

  loadRoles(): void {
    this.http.get<any>(this.getRoles).subscribe(
      (response) => {
        this.roles = response.resultado;
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
      }
    );
  }

  loadGeneros(): void {
    this.http.get<any>(this.getGeneros).subscribe(
      (response) => {
        this.generos = response.resultado;
      },
      (error) => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  loadTipoIdentificacion(): void {
    this.http.get<any>(this.getTipoIdentificacion).subscribe(
      (response) => {
        this.tiposIdentificacion = response.resultado;
      },
      (error) => {
        console.error('Error al cargar los tipos de identificacion:', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const user = {
        nombre: this.userForm.get('userName')?.value,
        apellido: this.userForm.get('userLastName')?.value,
        correo_electronico: this.userForm.get('userEmail')?.value,
        contraseña: this.userForm.get('userPassword')?.value,
        rol_id: this.userForm.get('userRole')?.value,
        genero: this.userForm.get('userGender')?.value,
        fecha_nacimiento: this.userForm.get('userDate')?.value,
        tipo_identificacion: this.userForm.get('userTipoIdentificacion')?.value,
        numero_identificacion: this.userForm.get('userNumberIdentification')
          ?.value,
        telefono: this.userForm.get('userPhone')?.value,
        direccion: this.userForm.get('userAdress')?.value,
        foto_usuario: this.selectedFile ? this.selectedFile.name : null, // Enviar solo el nombre del archivo
        estado: true, // Si es necesario incluirlo
      };

      console.log('Formulario de usuario:', user);

      this.http.post(this.createUser, user).subscribe(
        (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.error('Error al crear el usuario:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
