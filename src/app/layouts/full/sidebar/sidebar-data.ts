import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
    route: '/dashboard',
  },
  {
    navCap: 'Modulos',
  },
  {
    displayName: 'Prediccion',
    iconName: 'heart-rate-monitor',
    route: '/prediccion',
  },
  {
    displayName: 'ECG',
    iconName: 'heartbeat',
    route: '/ecg',
  },
  {
    displayName: 'Evaluaciones',
    iconName: 'clipboard-check',
    route: '/evaluaciones',
  },
  {
    displayName: 'Resultados',
    iconName: 'report-analytics',
    route: '/resultados',
  },
  {
    displayName: 'NutriAnalizador',
    iconName: 'salad',
    route: '/nutrianalizador',
  },
  {
    navCap: 'Configuraciones',
  },
  {
    displayName: 'Pacientes',
    iconName: 'user-plus',
    route: '/pacientes',
  },
  {
    displayName: 'Perfil',
    iconName: 'user-circle',
    route: '/perfil',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users',
    route: '/usuarios',
  },
  {
    displayName: 'Roles',
    iconName: 'shield-lock',
    route: '/roles',
  },
  {
    displayName: 'Parametros',
    iconName: 'settings-cog',
    route: '/parametros',
  },
];

export function getFilteredNavItems(permisos: string[]): NavItem[] {
  const mapaPermisosRutas: { [key: string]: string } = {
    '1': '/dashboard',
    '2': '/pacientes',
    '3': '/prediccion',
    '4': '/ecg',
    '5': '/resultados',
    '6': '/nutrianalizador',
    '7': '/perfil',
    '8': '/usuarios',
    '9': '/roles',
    '10': '/parametros',
    '11': '/evaluaciones',
  };

  const rutasPermitidas = permisos.map(id => mapaPermisosRutas[id]).filter(route => route);

  return navItems.filter(item => {
    return !item.route || rutasPermitidas.includes(item.route);
  });
}