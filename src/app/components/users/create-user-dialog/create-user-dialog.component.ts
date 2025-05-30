import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCard, MatCardContent } from '@angular/material/card';
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
    MatIconModule,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss',
})
export class CreateUserDialogComponent {
  hide = true;
  userForm: FormGroup;
  roles: any[] = [];
  generos: any[] = [];
  doctores: any[] = []; 
  tiposIdentificacion: any[] = [];
  selectedFile: File | null = null;
  statuses = [
    { value: 1, viewValue: 'Activo' },
    { value: 2, viewValue: 'Inactivo' },
  ];

  private createUser = 'http://127.0.0.1:8000/usuarios/crear';
  private getRoles = 'http://127.0.0.1:8000/roles/listar';
  private getGeneros ='http://127.0.0.1:8000/parametros-valor/por-parametro/2';
  private getTipoIdentificacion ='http://127.0.0.1:8000/parametros-valor/por-parametro/1';
  private getDoctores = 'http://127.0.0.1:8000/usuarios/por-rol/2'; // Endpoint para obtener doctores

  currentUserRoleId: number | null = null;
  currentUserId: number | null = null;
  currentUserRoleName: string | null = null;

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
      doctorAsignado: [null] 
    });

    // Escuchar cambios en el rol para mostrar/ocultar campo de contraseña
    this.userForm.get('userRole')?.valueChanges.subscribe(roleId => {
      this.updatePasswordFieldState(roleId);
      this.updateDoctorFieldState(roleId);
    });

    this.getCurrentUserInfo();
  }

  private getCurrentUserInfo(): void {
    const token = localStorage.getItem('decodedToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(token);
        this.currentUserRoleId = decodedToken?.rol_id;
        this.currentUserId = decodedToken?.id;
        this.currentUserRoleName = decodedToken?.role_name;
        console.log('Current user info:', {
          id: this.currentUserId,
          roleId: this.currentUserRoleId,
          roleName: this.currentUserRoleName
        });
      } catch (error) {
        console.error('Error parsing decoded token:', error);
      }
    }
  }


  ngOnInit() {
    this.userForm.get('userStatus')?.disable();
    this.loadRoles();
    this.loadGeneros();
    this.loadTipoIdentificacion();
    this.loadDoctores();
  }

  // Nuevo método para cargar doctores
  loadDoctores(): void {
    this.http.get<any>(this.getDoctores).subscribe(
      (response) => {
        this.doctores = response.usuarios || [];
      },
      (error) => {
        console.error('Error al cargar los doctores:', error);
      }
    );
  }

  // Actualizar estado del campo doctor
  private updateDoctorFieldState(roleId: number): void {
    const doctorControl = this.userForm.get('doctorAsignado');
    const isPatient = roleId === 3 || (this.roles.find(r => r.id === roleId)?.nombre === 'Paciente');
    
    if (isPatient) {
      doctorControl?.setValidators([Validators.required]);
    } else {
      doctorControl?.clearValidators();
      doctorControl?.setValue(null);
    }
    doctorControl?.updateValueAndValidity();
  }


  loadRoles(): void {
    this.http.get<any>(this.getRoles).subscribe(
      (response) => {
        this.roles = response.roles;
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
      }
    );
  }

  loadGeneros(): void {
    this.http.get<any>(this.getGeneros).subscribe(
      (response) => {
        this.generos = response.valores;
      },
      (error) => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  loadTipoIdentificacion(): void {
    this.http.get<any>(this.getTipoIdentificacion).subscribe(
      (response) => {
        this.tiposIdentificacion = response.valores;
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

  // Método para actualizar el estado del campo de contraseña
  private updatePasswordFieldState(roleId: number): void {
    const passwordControl = this.userForm.get('userPassword');
    if (roleId === 3) { // Paciente
      passwordControl?.clearValidators();
      passwordControl?.disable();
    } else {
      passwordControl?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/)
      ]);
      passwordControl?.enable();
    }
    passwordControl?.updateValueAndValidity();
  }

  // Generar nombre de usuario automático
  private generateUsername(nombre: string, apellido: string, identificacion: string): string {
    const firstLetterName = nombre.charAt(0).toUpperCase();
    const firstLetterLastName = apellido.charAt(0).toUpperCase();
    return `${firstLetterName}${firstLetterLastName}${identificacion}`;
  }

  // Generar contraseña automática para pacientes
  private generatePatientPassword(
    nombre: string, 
    apellido: string, 
    fechaNacimiento: string
  ): string {
    const firstLetterName = nombre.charAt(0).toUpperCase();
    const firstLetterLastName = apellido.charAt(0).toUpperCase();
    
    const [year, month, day] = fechaNacimiento.split('-');
  const formattedDate = `${day}${month}${year}`;
    
    return `${firstLetterName}${firstLetterLastName}${formattedDate}*`;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      const isPatient = formData.userRole === 3 || 
                       (this.roles.find(r => r.id === formData.userRole)?.nombre === 'Paciente');
      
      // Verificar si el creador es doctor
      const isDoctor = this.currentUserRoleId === 2 || 
                      this.currentUserRoleName?.toLowerCase() === 'doctor';

      
      // Generar usuario automático
      const username = this.generateUsername(
        formData.userName,
        formData.userLastName,
        formData.userNumberIdentification
      );

      // Generar contraseña automática si es paciente
      const password = isPatient 
        ? this.generatePatientPassword(
            formData.userName,
            formData.userLastName,
            formData.userDate
          )
        : formData.userPassword;

      const user = {
        nombre: formData.userName,
        apellido: formData.userLastName,
        correo_electronico: formData.userEmail,
        contraseña: password,
        rol_id: formData.userRole,
        genero: formData.userGender,
        fecha_nacimiento: formData.userDate,
        tipo_identificacion: formData.userTipoIdentificacion,
        numero_identificacion: formData.userNumberIdentification,
        telefono: formData.userPhone,
        direccion: formData.userAdress,
        foto_usuario: this.selectedFile ? this.selectedFile.name : null,
        estado: true,
        usuario: username // Nuevo campo para el nombre de usuario
      };

      console.log('Datos del usuario a crear:', user);

      this.http.post(this.createUser, user).subscribe(
        (response: any) => {
          console.log('Usuario creado exitosamente:', response);
          
          // Si es paciente y se seleccionó un doctor, crear relación
          if (isPatient && formData.doctorAsignado && response.id) {
            const relacion = {
              doctor_id: formData.doctorAsignado,
              paciente_id: response.id
            };
            
            this.http.post('http://127.0.0.1:8000/doctor-paciente', relacion).subscribe(
              () => console.log('Relación doctor-paciente creada'),
              error => console.error('Error creando relación doctor-paciente:', error)
            );
          }
          
          this.dialogRef.close(response);
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
