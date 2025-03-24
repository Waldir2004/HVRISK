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
import { CreateRoleDialogComponent } from 'src/app/components/create-role-dialog/create-role-dialog.component';
import { EditRoleDialogComponent } from 'src/app/components/edit-role-dialog/edit-role-dialog.component';

@Component({
  selector: 'app-roles',
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
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  displayedColumns1: string[] = ['name', 'estado', 'actions'];
  dataSource1: any[] = [];

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.http.get('http://127.0.0.1:8000/get_roles').subscribe((response: any) => {
      this.dataSource1 = response.resultado;
    });
  }

  openCreateRoleDialog() {
    const dialogRef = this.dialog.open(CreateRoleDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes manejar el resultado del formulario
        console.log('Nuevo rol creado:', result);
        this.loadRoles(); // Recargar la lista de roles
      }
    });
  }

  openEditRoleDialog(roleId: number) {
    const dialogRef = this.dialog.open(EditRoleDialogComponent, {
      data: { roleId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí puedes manejar el resultado del formulario
        console.log('Rol editado:', result);
        this.loadRoles(); // Recargar la lista de roles
      }
    });
  }
}