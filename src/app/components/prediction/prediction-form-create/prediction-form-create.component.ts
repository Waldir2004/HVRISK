import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-prediction-form-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './prediction-form-create.component.html',
  styleUrl: './prediction-form-create.component.scss'
})
export class PredictionFormCreateComponent {
  predictionForm: FormGroup;
  hide = true;
  tabaquismoOptions: any[] = [];
  actividadFisicaOptions: any[] = [];
  consumoAlcoholOptions: any[] = [];
  consumoCafeinaOptions: any[] = [];
  calidadSuenoOptions: any[] = [];
  nivelEstresOptions: any[] = [];
  patients: any[] = [];
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  currentUserId: number | null = null;

  private getTabaquismo = 'http://127.0.0.1:8000/parametros-valor/por-parametro/10';
  private getActividadFisica = 'http://127.0.0.1:8000/parametros-valor/por-parametro/3';
  private getConsumoAlcohol = 'http://127.0.0.1:8000/parametros-valor/por-parametro/4';
  private getConsumoCafeina = 'http://127.0.0.1:8000/parametros-valor/por-parametro/5';
  private getCalidadSueno = 'http://127.0.0.1:8000/parametros-valor/por-parametro/6';
  private getNivelEstres = 'http://127.0.0.1:8000/parametros-valor/por-parametro/7';
  private getPatients = 'http://127.0.0.1:8000/usuarios/pacientes/por-doctor';
  private createEvaluacionUrl = 'http://127.0.0.1:8000/evaluaciones-completas/crear';


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PredictionFormCreateComponent>,
    private http: HttpClient
  ) {
    this.predictionForm = this.fb.group({
      pacienteAsignado: ['', Validators.required],
      // Datos clínicos
      peso_kg: ['', [Validators.required, Validators.min(20), Validators.max(300)]],
      altura_cm: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      circ_cintura_cm: ['', [Validators.required, Validators.min(50), Validators.max(200)]],
      presion_sistolica: ['', [Validators.required, Validators.min(70), Validators.max(250)]],
      presion_diastolica: ['', [Validators.required, Validators.min(40), Validators.max(150)]],
      frecuencia_cardiaca: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      ldl: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      hdl: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      trigliceridos: ['', [Validators.required, Validators.min(0), Validators.max(1000)]],
      glucosa_ayunas: ['', [Validators.required, Validators.min(0), Validators.max(300)]],
      hba1c: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      creatinina: ['', [Validators.required, Validators.min(0), Validators.max(10)]],

      // Antecedentes médicos
      diabetes: [false],
      hipertension: [false],
      enfermedad_renal: [false],
      apnea_sueno: [false],
      dislipidemia: [false],
      epoc: [false],
      familia_cardiopatia: [false],
      familia_diabetes: [false],
      tabaquismo_id: ['', Validators.required],

      // Estilo de vida
      actividad_fisica_id: ['', Validators.required],
      horas_ejercicio_semana: ['', [Validators.min(0), Validators.max(168)]],
      consumo_alcohol_id: ['', Validators.required],
      consumo_cafeina_id: ['', Validators.required],
      dieta_alta_sodio: [false],
      dieta_alta_grasas: [false],
      horas_sueno_diario: ['', [Validators.min(0), Validators.max(24)]],
      calidad_sueno_id: ['', Validators.required],
      nivel_estres_id: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.predictionForm.get('predictionStatus')?.disable();
    this.loadTabaquismo();
    this.loadActividadFisica();
    this.loadConsumoAlcohol();
    this.loadConsumoCafeina();
    this.loadCalidadSueno();
    this.loadNivelEstres();
    this.loadPatients();
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

        this.loadPatients();

      } catch (error) {
        console.error('Error parsing decoded token:', error);
      }
    }
  }

  loadPatients(): void {
    this.http.get<any>(`${this.getPatients}/${this.currentUserId}`).subscribe(
      (response) => {
        this.patients = response.usuarios;
      },
      (error) => {
        console.error('Error al cargar los pacientes:', error);
      }
    );
  }

  loadTabaquismo(): void {
    this.http.get<any>(this.getTabaquismo).subscribe(
      (response) => {
        this.tabaquismoOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de tabaquismo:', error);
      }
    );
  }

  loadActividadFisica(): void {
    this.http.get<any>(this.getActividadFisica).subscribe(
      (response) => {
        this.actividadFisicaOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de actividad fisica:', error);
      }
    );
  }

  loadConsumoAlcohol(): void {
    this.http.get<any>(this.getConsumoAlcohol).subscribe(
      (response) => {
        this.consumoAlcoholOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de consumo de alcohol:', error);
      }
    );
  }

  loadConsumoCafeina(): void {
    this.http.get<any>(this.getConsumoCafeina).subscribe(
      (response) => {
        this.consumoCafeinaOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de consumo de cafeina:', error);
      }
    );
  }

  loadCalidadSueno(): void {
    this.http.get<any>(this.getCalidadSueno).subscribe(
      (response) => {
        this.calidadSuenoOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de calidad de sueño:', error);
      }
    );
  }

  loadNivelEstres(): void {
    this.http.get<any>(this.getNivelEstres).subscribe(
      (response) => {
        this.nivelEstresOptions = response.valores || [];
      },
      (error) => {
        console.error('Error al cargar los tipos de nivel de estres:', error);
      }
    );
  }


  onSubmit(): void {
    if (this.predictionForm.valid) {
      const formData = this.predictionForm.value;
  
      // Asegúrate de enviar también el ID del doctor si lo necesitas en el backend
     
  
      this.http.post<any>(this.createEvaluacionUrl, formData).subscribe(
        (response) => {
          console.log('Evaluación creada con éxito:', response);
          this.dialogRef.close(response); // Cierra el modal y devuelve la respuesta
        },
        (error) => {
          console.error('Error al crear la evaluación:', error);
          // Podrías mostrar un mensaje de error aquí si quieres
        }
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
