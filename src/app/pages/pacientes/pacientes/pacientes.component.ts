import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from 'src/app/material.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePatientDialogComponent } from '../../../components/pacientes/create-patient-dialog/create-patient-dialog.component';
import { EditPatientDialogComponent } from '../../../components/pacientes/edit-patient-dialog/edit-patient-dialog.component';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog-deleted/confirm-dialog.component';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatCardModule,
    MaterialModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.scss'
})
export class PacientesComponent {
  displayedColumns1: string[] = ['nombre', 'rol', 'correo', 'estado', 'actions'];
  dataUsers: any[] = [];
  isAdmin: boolean = false;
  isDoctor: boolean = false;
  currentUserId: number | null = null;

  constructor(private dialog: MatDialog, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadPatients();
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

      } catch (error) {
        console.error('Error parsing decoded token:', error);
      }
    }
  }

  loadPatients(): void {
    if (this.isAdmin) {
      // Admin: carga todos los pacientes
      this.http.get('http://127.0.0.1:8000/usuarios/por-rol/3').subscribe((response: any) => {
        this.dataUsers = response.usuarios;
      });
    } else if (this.isDoctor && this.currentUserId) {
      // Doctor: carga solo sus pacientes
      this.http.get(`http://127.0.0.1:8000/usuarios/pacientes/por-doctor/${this.currentUserId}`).subscribe((response: any) => {
        this.dataUsers = response.usuarios;
      });
    }
  }

  openCreatePatientDialog() {
    const dialogRef = this.dialog.open(CreatePatientDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes manejar el resultado del formulario
        console.log('Nuevo usuario creado:', result);
        this.loadPatients(); // Recargar la lista de roles
      }
    });
  }

  openEditPatientDialog(usuario: any) {
    console.log('Abriendo modal para usuario:', usuario);

    const dialogRef = this.dialog.open(EditPatientDialogComponent, {
      width: '500px',
      data: usuario, // Enviamos todo el usuario
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado', result);
    });
  }

  deletePatient(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: '¿Estás seguro de que deseas eliminar este usuario?' },
    });
  
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.http.delete(`http://127.0.0.1:8000/usuarios/eliminar/${userId}`).subscribe(
          () => {
            console.log(`Usuario con ID ${userId} eliminado`);
            this.loadPatients(); // Refrescar la lista de usuarios
          },
          (error) => {
            console.error('Error al eliminar usuario:', error);
          }
        );
      }
    });
  }
}
