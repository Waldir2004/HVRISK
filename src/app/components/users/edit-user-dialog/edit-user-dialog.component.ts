import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-user-dialog',
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
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {
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

  private editUserUrl = 'http://127.0.0.1:8000/usuarios/actualizar';
  private getRolesUrl = 'http://127.0.0.1:8000/roles/listar';
  private getGenerosUrl = 'http://127.0.0.1:8000/parametros-valor/por-parametro/2';
  private getTipoIdentificacionUrl = 'http://127.0.0.1:8000/parametros-valor/por-parametro/1';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('Datos recibidos en el modal:', this.data);

    // Inicializar el formulario con los datos recibidos
    this.userForm = this.fb.group({
      userName: [this.data?.nombre || '', Validators.required],
      userLastName: [this.data?.apellido || '', Validators.required],
      userEmail: [this.data?.correo_electronico || '', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.minLength(8), Validators.maxLength(12)]], // Contraseña opcional
      userRole: [this.data?.rol_id || '', Validators.required],
      userGender: [this.data?.genero || '', Validators.required],
      userDate: [this.data?.fecha_nacimiento || '', Validators.required],
      userTipoIdentificacion: [this.data?.tipo_identificacion || '', Validators.required],
      userNumberIdentification: [this.data?.numero_identificacion || '', Validators.required],
      userPhone: [this.data?.telefono || '', Validators.required],
      userAdress: [this.data?.direccion || '', Validators.required],
      userStatus: [this.data?.estado ? 1 : 2, Validators.required],
    });
  }

  ngOnInit() {
    this.loadRoles();
    this.loadGeneros();
    this.loadTipoIdentificacion();
  }

  loadRoles(): void {
    this.http.get<any>(this.getRolesUrl).subscribe(
      (response) => {
        this.roles = response.roles;
        console.log('Roles cargados:', this.roles);
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
      }
    );
  }

  loadGeneros(): void {
    this.http.get<any>(this.getGenerosUrl).subscribe(
      (response) => {
        this.generos = response.valores;
        console.log('Géneros cargados:', this.generos);
      },
      (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    );
  }

  loadTipoIdentificacion(): void {
    this.http.get<any>(this.getTipoIdentificacionUrl).subscribe(
      (response) => {
        this.tiposIdentificacion = response.valores;
        console.log('Tipos de identificación cargados:', this.tiposIdentificacion);
      },
      (error) => {
        console.error('Error al cargar los tipos de identificación:', error);
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
      const updatedUser = {
        id: this.data.id,
        rol_id: this.userForm.get('userRole')?.value,
        correo_electronico: this.userForm.get('userEmail')?.value,
        contraseña: this.userForm.get('userPassword')?.value || this.data.contraseña,
        nombre: this.userForm.get('userName')?.value,
        apellido: this.userForm.get('userLastName')?.value,
        fecha_nacimiento: this.userForm.get('userDate')?.value,
        tipo_identificacion: this.userForm.get('userTipoIdentificacion')?.value,
        numero_identificacion: this.userForm.get('userNumberIdentification')?.value,
        genero: this.userForm.get('userGender')?.value,
        telefono: this.userForm.get('userPhone')?.value,
        direccion: this.userForm.get('userAdress')?.value,
        foto_usuario: this.selectedFile ? this.selectedFile.name : this.data.foto_usuario,
        estado: this.userForm.get('userStatus')?.value === 1,
      };

      console.log('Usuario actualizado:', updatedUser);

      this.http.put(`${this.editUserUrl}/${updatedUser.id}`, updatedUser).subscribe(
        (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
