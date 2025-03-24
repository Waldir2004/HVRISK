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
import { CreateUserDialogComponent } from 'src/app/components/users/create-user-dialog/create-user-dialog.component';


@Component({
  selector: 'app-usuarios',
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
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit{
  displayedColumns1: string[] = ['nombre', 'rol', 'correo', 'estado', 'actions'];
  dataUsers: any[] = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get('http://127.0.0.1:8000/get_users').subscribe((response: any) => {
      this.dataUsers = response.resultado;
    });
  }

  openCreateUserDialog() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes manejar el resultado del formulario
        console.log('Nuevo usuario creado:', result);
        this.loadUsers(); // Recargar la lista de roles
      }
    });
  }
}
