import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-role-dialog',
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
  templateUrl: './create-role-dialog.component.html',
  styleUrls: ['./create-role-dialog.component.scss']
})
export class CreateRoleDialogComponent {
  roleForm: FormGroup;
  statuses = [
    { value: 1, viewValue: 'Activo' },
    { value: 2, viewValue: 'Inactivo' }
  ];

  modules: any[] = [];
  private apiUrl = 'http://127.0.0.1:8000/roles/crear';
  private modulesUrl ='http://127.0.0.1:8000/modulos/listar';
  private permisosUrl = 'http://127.0.0.1:8000/permisos/crear';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateRoleDialogComponent>,
    private http: HttpClient
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      roleStatus: [{ value: 1, disabled: true }, Validators.required], // Estado por defecto: Activo y deshabilitado
      modules: [[]] // Inicializar el control de módulos
    });
  }

  ngOnInit() {
    this.roleForm.get('roleStatus')?.disable();
    this.loadModules();
  }

  loadModules() {
    this.http.get<any>(this.modulesUrl).subscribe(
      response => {
        this.modules = response.modulos;
      },
      error => {
        console.error('Error al cargar los módulos:', error);
      }
    );
  }

  onSubmit() {
    if (this.roleForm.valid) {
      const roleName = this.roleForm.get('roleName')?.value;
      const role = { nombre: roleName, estado: true }; // Solo enviar el nombre
      console.log('Enviando rol:', role); // Mensaje de depuración
      this.http.post<any>(this.apiUrl, role).subscribe(
        response => {
          console.log('Rol creado:', response);
          const roleId = response.id; // Obtener el ID del rol creado
          const selectedModules = this.roleForm.get('modules')?.value;
          console.log('ID del rol:', roleId); // Mensaje de depuración
          console.log('modulos seleccionados', selectedModules) // Obtener los módulos seleccionados
          selectedModules.forEach((moduleId: number) => {
            const permiso = { modulo_id: moduleId, rol_id: roleId, estado: true };
            this.http.post<any>(this.permisosUrl, permiso).subscribe(
              permisoResponse => {
                console.log('Permiso creado:', permisoResponse);
              },
              permisoError => {
                console.error('Error al crear el permiso:', permisoError);
              }
            );
          });
          this.dialogRef.close(response);
        },
        error => {
          console.error('Error al crear el rol:', error);
        }
      );
    } else {
      console.log('Formulario no válido'); // Mensaje de depuración
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}