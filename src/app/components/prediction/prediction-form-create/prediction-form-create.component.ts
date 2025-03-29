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

  // Opciones para los selects
  tabaquismoOptions = [
    { id: 1, nombre: 'No fuma' },
    { id: 2, nombre: 'Ex-fumador' },
    { id: 3, nombre: 'Fumador ocasional' },
    { id: 4, nombre: 'Fumador regular' }
  ];

  actividadFisicaOptions = [
    { id: 1, nombre: 'Sedentario' },
    { id: 2, nombre: 'Poca actividad' },
    { id: 3, nombre: 'Activo' },
    { id: 4, nombre: 'Muy activo' }
  ];

  consumoAlcoholOptions = [
    { id: 1, nombre: 'Nunca' },
    { id: 2, nombre: 'Ocasionalmente' },
    { id: 3, nombre: 'Regularmente' },
    { id: 4, nombre: 'Excesivamente' }
  ];

  consumoCafeinaOptions = [
    { id: 1, nombre: 'Nada' },
    { id: 2, nombre: 'Poco (1-2 tazas/día)' },
    { id: 3, nombre: 'Moderado (3-4 tazas/día)' },
    { id: 4, nombre: 'Mucho (más de 4 tazas/día)' }
  ];

  calidadSuenoOptions = [
    { id: 1, nombre: 'Muy mala' },
    { id: 2, nombre: 'Mala' },
    { id: 3, nombre: 'Regular' },
    { id: 4, nombre: 'Buena' },
    { id: 5, nombre: 'Excelente' }
  ];

  nivelEstresOptions = [
    { id: 1, nombre: 'Muy bajo' },
    { id: 2, nombre: 'Bajo' },
    { id: 3, nombre: 'Moderado' },
    { id: 4, nombre: 'Alto' },
    { id: 5, nombre: 'Muy alto' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PredictionFormCreateComponent>
  ) {
    this.predictionForm = this.fb.group({
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

  onSubmit(): void {
    if (this.predictionForm.valid) {
      this.dialogRef.close(this.predictionForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
