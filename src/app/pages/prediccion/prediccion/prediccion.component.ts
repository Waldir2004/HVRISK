import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './../../../components/dialog-content/dialog-content.component';

@Component({
  selector: 'app-prediccion',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './prediccion.component.html',
  styleUrl: './prediccion.component.scss'
})
export class PrediccionComponent implements OnInit {
  prediccionForm: FormGroup;
  generos: any[] = [];
  colesterol: any[] = [];
  glucosa: any[] = [];

  private getGeneros = 'http://127.0.0.1:8000/get_parametro_valor_por_parametro_id/1';
  private getColesterol = 'http://127.0.0.1:8000/get_parametro_valor_por_parametro_id/2';
  private getGlucosa = 'http://127.0.0.1:8000/get_parametro_valor_por_parametro_id/3';
  private createPrediccionUrl = 'http://127.0.0.1:8000/create_prediccion';


  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    this.prediccionForm = this.fb.group({
      edad: ['', [Validators.required, Validators.min(0)]],
      genero: ['', Validators.required],
      altura_cm: ['', [Validators.required, Validators.min(0)]],
      peso_kg: ['', [Validators.required, Validators.min(0)]],
      presion_sistolica: ['', [Validators.required, Validators.min(0)]],
      presion_diastolica: ['', [Validators.required, Validators.min(0)]],
      colesterol: ['', Validators.required],
      glucosa: ['', Validators.required],
      fuma: [Validators.required],
      alcohol: [Validators.required],
      dieta: [Validators.required],
      actividad_fisica: [Validators.required],
      antecedentes_familiares: [Validators.required],
      diabetes: [Validators.required],
      usuario_id: [Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadGeneros();
    this.loadColesterol();
    this.loadGlucosa();
  }

  loadGeneros(): void {
    this.http.get<any>(this.getGeneros).subscribe(
      response => {
        this.generos = response.resultado;
        console.log('Generos cargados:', this.generos);
      },
      error => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  loadColesterol(): void {
    this.http.get<any>(this.getColesterol).subscribe(
      response => {
        this.colesterol = response.resultado;
      },
      error => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  loadGlucosa(): void {
    this.http.get<any>(this.getGlucosa).subscribe(
      response => {
        this.glucosa = response.resultado;
        console.log('Generos cargados:', this.generos);
      },
      error => {
        console.error('Error al cargar los generos:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.prediccionForm.valid) {
      const token = localStorage.getItem('decodedToken');
      if (token) {
        try {
          const decodedToken = JSON.parse(token);
          const id = decodedToken?.id;
          if (id) {
            this.prediccionForm.patchValue({ usuario_id: id });
          }
        } catch (error) {
          console.error('Error parsing token from localStorage', error);
        }
      }
      console.log('Formulario válido:', this.prediccionForm.value);
      this.http.post(this.createPrediccionUrl, this.prediccionForm.value).subscribe(
        (response: any) => {
          console.log('Predicción creada exitosamente:', response);
          this.openDialog(response.mensaje, response.recomendaciones);
        },
        error => {
          console.error('Error al crear la predicción:', error);
        }
      );
    } else {
      console.error('Formulario no válido');
    }
  }

  openDialog(mensaje: string, recomendaciones: string[]): void {
    this.dialog.open(DialogContentComponent, {
      data: {
        mensaje: mensaje,
        recomendaciones: recomendaciones
      }
    });
  }

  resetForm(): void {
    this.prediccionForm.reset();
  }
}
