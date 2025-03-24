import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full',
      },
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('./pages/paciente/paciente.module').then(
            (m) => m.PacienteModule
          ),
      },
      {
        path: 'prediccion',
        loadChildren: () =>
          import('./pages/prediccion/prediccion.module').then(
            (m) => m.PrediccionModule
          ),
      },
      {
        path: 'historial',
        loadChildren: () =>
          import('./pages/historial/historial.module').then(
            (m) => m.HistorialModule
          ),
      },
      {
        path: 'reservas',
        loadChildren: () =>
          import('./pages/reservas/reservas.module').then(
            (m) => m.ReservasModule
          ),
      },
      {
        path: 'citas',
        loadChildren: () =>
          import('./pages/citas/citas.module').then(
            (m) => m.CitasModule
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./pages/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule
          ),
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('./pages/roles/roles.module').then(
            (m) => m.RolesModule
          ),
      },
      // {
      //   path: 'permisos',
      //   loadChildren: () =>
      //     import('./pages/permisos/permisos.module').then(
      //       (m) => m.PermisosModule
      //     ),
      // },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];