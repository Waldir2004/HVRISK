import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-grid-add',
    route: '/dashboard',
  },
  {
    navCap: 'Modulos',
  },
  {
    displayName: 'Pacientes',
    iconName: 'user',
    route: '/paciente',
  },
  {
    displayName: 'Prediccion',
    iconName: 'nurse',
    route: '/prediccion',
  },
  {
    displayName: 'ECG',
    iconName: 'history',
    route: '/ecg',
  },
  {
    displayName: 'Resultados',
    iconName: 'calendar-clock',
    route: '/resultados',
  },
  {
    displayName: 'NutriAnalizador',
    iconName: 'calendar-clock',
    route: '/nutrianalizador',
  },
  {
    navCap: 'Configuraciones',
  },
  {
    displayName: 'Perfil',
    iconName: 'user',
    route: '/perfil',
  },
  {
    displayName: 'Usuarios',
    iconName: 'users-group',
    route: '/usuarios',
  },
  {
    displayName: 'Roles',
    iconName: 'user-circle',
    route: '/roles',
  },
  {
    displayName: 'Parametros',
    iconName: 'user-circle',
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
  };

  const rutasPermitidas = permisos.map(id => mapaPermisosRutas[id]).filter(route => route);

  return navItems.filter(item => {
    return !item.route || rutasPermitidas.includes(item.route);
  });
}