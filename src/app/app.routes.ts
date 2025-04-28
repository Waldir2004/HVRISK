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
        path: 'evaluaciones',
        loadChildren: () =>
          import('./pages/evaluaciones/evaluaciones.module').then(
            (m) => m.EvaluacionesModule
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
        path: 'ecg',
        loadChildren: () =>
          import('./pages/ecg/ecg.module').then(
            (m) => m.ECGModule
          ),
      },
      {
        path: 'resultados',
        loadChildren: () =>
          import('./pages/resultados/resultados.module').then(
            (m) => m.ResultadosModule
          ),
      },
      {
        path: 'nutrianalizador',
        loadChildren: () =>
          import('./pages/nutrianalizador/nutrianalizador.module').then(
            (m) => m.NutrianalizadorModule
          ),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./pages/perfil/perfil.module').then(
            (m) => m.PerfilModule
          ),
      },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('./pages/pacientes/pacientes.module').then(
            (m) => m.PacientesModule
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
      {
        path: 'parametros',
        loadChildren: () =>
          import('./pages/parametros/parametros.module').then(
            (m) => m.ParametrosModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];