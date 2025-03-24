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
    displayName: 'Historial Paciente',
    iconName: 'history',
    route: '/historial',
  },
  {
    displayName: 'Reservas',
    iconName: 'calendar-clock',
    route: '/reservas',
  },
  {
    displayName: 'Citas',
    iconName: 'calendar-event',
    route: '/citas',
  },
  {
    navCap: 'Configuraciones',
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
  // Otros elementos comentados...
];

export function getFilteredNavItems(permisos: string[]): NavItem[] {
  const mapaPermisosRutas: { [key: string]: string } = {
    '1': '/dashboard',
    '2': '/paciente',
    '3': '/historial',
    '4': '/reservas',
    '5': '/citas',
    '6': '/usuarios',
    '7': '/roles',
    '8': '/prediccion',
    // Añadir más mapeos según sea necesario
  };

  const rutasPermitidas = permisos.map(id => mapaPermisosRutas[id]).filter(route => route);

  return navItems.filter(item => {
    return !item.route || rutasPermitidas.includes(item.route);
  });
}