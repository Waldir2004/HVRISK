import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatListModule
  ],
  styleUrls: ['./edit-role-dialog.component.scss']
})
export class EditRoleDialogComponent implements OnInit {
  editRoleForm: FormGroup;
  modules: any[] = [];

  private modulesUrl ='http://127.0.0.1:8000/get_modulos';
  private permisosUrl = 'http://127.0.0.1:8000/get_permisos_por_rol';
  private editRoleUrl = 'http://127.0.0.1:8000/edit_role';
  private editPermisosUrl = 'http://127.0.0.1:8000/edit_permisos_por_rol';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.editRoleForm = this.fb.group({
      nombre: ['', Validators.required],
      estado: ['', Validators.required],
      modules: [[]]
    });
  }

  ngOnInit(): void {
    this.loadRoleData();
    this.loadModules();
    this.loadPermisos();
  }

  loadRoleData(): void {
    console.log('Role ID:', this.data.roleId);
    this.http.get(`http://127.0.0.1:8000/get_role/${this.data.roleId}`).subscribe((role: any) => {
      this.editRoleForm.patchValue({
        nombre: role.resultado.nombre,
        estado: role.resultado.estado === 1 ? 'activo' : 'inactivo'
      });
    });
  }

  loadModules() {
    this.http.get<any>(this.modulesUrl).subscribe(
      response => {
        this.modules = response.resultado;
      },
      error => {
        console.error('Error al cargar los módulos:', error);
      }
    );
  }

  loadPermisos(): void {
    this.http.get<any>(`${this.permisosUrl}/${this.data.roleId}`).subscribe(
      response => {
        const permisos = response.modulos;
        this.editRoleForm.patchValue({
          modules: permisos
        });
      },
      error => {
        console.error('Error al cargar los permisos:', error);
      }
    );
  }

  onSave(): void {
    if (this.editRoleForm.valid) {
      const updatedRole = {
        nombre: this.editRoleForm.value.nombre,
        estado: this.editRoleForm.value.estado === 'activo' ? 1 : 0
      };

      // Actualizar el rol
      this.http.put(`${this.editRoleUrl}/${this.data.roleId}`, updatedRole).subscribe(
        (response: any) => {
          console.log('Rol actualizado:', response);

          // Actualizar los permisos
          const permisos = this.editRoleForm.value.modules.map((moduloId: number) => ({
            modulo_id: moduloId,
            rol_id: this.data.roleId,
            estado: true // Asumiendo que el estado es true para todos los permisos
          }));

          console.log('Permisos a actualizar:', permisos);

          this.http.put(`${this.editPermisosUrl}/${this.data.roleId}`, permisos).subscribe(
            (response: any) => {
              console.log('Permisos actualizados:', response);
              this.dialogRef.close(updatedRole);
            },
            (error) => {
              console.error('Error al actualizar los permisos:', error);
            }
          );
        },
        (error) => {
          console.error('Error al actualizar el rol:', error);
        }
      );
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
}