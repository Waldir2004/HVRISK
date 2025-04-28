import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { PredictionFormCreateComponent } from '../../../components/prediction/prediction-form-create/prediction-form-create.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';


@Component({
  selector: 'app-prediccion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  templateUrl: './prediccion.component.html',
  styleUrls: ['./prediccion.component.scss']
})
export class PrediccionComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'riesgoHvi', 'riesgoHvd', 'acciones'];
  dataSource: any[] = [];
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPredictions();
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
      } catch (error) {
        console.error('Error al analizar el token:', error);
      }
    }
  }

  loadPredictions(): void {
    // Ejemplo de carga de datos
    this.http.get<any>('api/evaluaciones').subscribe({
      next: (response) => {
        this.dataSource = response.data;
      },
      error: (err) => {
        console.error('Error al cargar predicciones:', err);
      }
    });
  }

  openPredictionModal(): void {
    const dialogRef = this.dialog.open(PredictionFormCreateComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: true,
      autoFocus: false,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPredictions(); // Recargar lista si se creó una nueva predicción
      }
    });
  }

  viewDetails(id: number): void {
    // Lógica para ver detalles completos
    console.log('Ver detalles de:', id);
  }

  getRiskClass(riskPercentage: number): string {
    if (riskPercentage < 30) {
      return 'risk-low';
    } else if (riskPercentage >= 30 && riskPercentage < 70) {
      return 'risk-medium';
    } else {
      return 'risk-high';
    }
  }
}