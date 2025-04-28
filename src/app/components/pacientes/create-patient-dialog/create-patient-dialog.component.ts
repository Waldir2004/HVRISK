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
  selector: 'app-create-patient-dialog',
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
  templateUrl: './create-patient-dialog.component.html',
  styleUrl: './create-patient-dialog.component.scss',
})
export class CreatePatientDialogComponent {

  hide = true;
  userForm: FormGroup;
  generos: any[] = [];
  doctores: any[] = []; 
  tiposIdentificacion: any[] = [];
  selectedFile: File | null = null;
  statuses = [
    { value: 1, viewValue: 'Activo' },
    { value: 2, viewValue: 'Inactivo' },
  ];

  private createUser = 'http://127.0.0.1:8000/usuarios/crear';
  private getGeneros = 'http://127.0.0.1:8000/parametros-valor/por-parametro/2';
  private getTipoIdentificacion = 'http://127.0.0.1:8000/parametros-valor/por-parametro/1';
  private getDoctores = 'http://127.0.0.1:8000/usuarios/por-rol/2';

  isAdmin: boolean = false;
  isDoctor: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatePatientDialogComponent>,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      userLastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userGender: ['', Validators.required],
      userDate: ['', Validators.required],
      userTipoIdentificacion: ['', Validators.required],
      userNumberIdentification: ['', Validators.required],
      userPhone: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      userAdress: ['', Validators.required],
      userStatus: [{ value: 1, disabled: true }, Validators.required],
      doctorAsignado: [null]
    });

    this.checkUserRole();
  }

  private checkUserRole(): void {
    const token = localStorage.getItem('decodedToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(token);
        this.currentUserId = decodedToken?.id;
        this.isAdmin = decodedToken?.rol_id === 1 || decodedToken?.role_name?.toLowerCase() === 'administrador';
        this.isDoctor = decodedToken?.rol_id === 2 || decodedToken?.role_name?.toLowerCase() === 'doctor';
        
        console.log('Rol del usuario:', {
          isAdmin: this.isAdmin,
          isDoctor: this.isDoctor,
          userId: this.currentUserId
        });

        // Si es doctor, asignarse automáticamente
        if (this.isDoctor && this.currentUserId) {
          this.userForm.patchValue({
            doctorAsignado: this.currentUserId
          });
        }

      } catch (error) {
        console.error('Error parsing decoded token:', error);
      }
    }
  }

  ngOnInit() {
    this.userForm.get('userStatus')?.disable();
    this.loadGeneros();
    this.loadTipoIdentificacion();
    if (this.isAdmin) {
      this.loadDoctores();
    }
  }

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


  // Generar nombre de usuario automático
  private generateUsername(
    nombre: string,
    apellido: string,
    identificacion: string
  ): string {
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

      // Generar usuario automático
      const username = this.generateUsername(
        formData.userName,
        formData.userLastName,
        formData.userNumberIdentification
      );

      // Generar contraseña automática si es paciente
      const password = this.generatePatientPassword(
        formData.userName,
        formData.userLastName,
        formData.userDate
      );

      const user = {
        nombre: formData.userName,
        apellido: formData.userLastName,
        correo_electronico: formData.userEmail,
        contraseña: password,
        rol_id: 3, // Asignar rol de paciente por defecto
        genero: formData.userGender,
        fecha_nacimiento: formData.userDate,
        tipo_identificacion: formData.userTipoIdentificacion,
        numero_identificacion: formData.userNumberIdentification,
        telefono: formData.userPhone,
        direccion: formData.userAdress,
        foto_usuario: this.selectedFile ? this.selectedFile.name : null,
        estado: true,
        usuario: username, // Nuevo campo para el nombre de usuario
      };

      console.log('Datos del usuario a crear:', user);

      this.http.post(this.createUser, user).subscribe(
        (response: any) => {
          console.log('Usuario creado exitosamente:', response);

          // Si es paciente y el creador es doctor, crear relación
          // Determinar doctor_id según el rol del usuario autenticado
          const doctorId = this.isAdmin ? formData.doctorAsignado : this.currentUserId;
          
          if (doctorId && response.id) {
            const relacion = {
              doctor_id: doctorId,
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
