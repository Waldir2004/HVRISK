import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PermisosService } from './services/permisos.service';
import { getFilteredNavItems } from 'src/app/layouts/full/sidebar/sidebar-data';
import { NavItem } from 'src/app/layouts/full/sidebar/nav-item/nav-item';
import { SidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component'; // Importa el ChatbotComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, SidebarComponent, ChatbotComponent], // Añade ChatbotComponent a los imports
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'Modernize Angular Admin Template';
  filteredNavItems: NavItem[] = [];

  constructor(private permisosService: PermisosService) {}

  ngOnInit() {
    const token = localStorage.getItem('decodedToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(token);
        const rolId = decodedToken?.rol_id;
        console.log(rolId);

        if (rolId) {
          this.permisosService.getPermisos(rolId).subscribe((response: any) => {
            console.log('Permisos recibidos:', response);
            const permisos = response.modulos;
            if (Array.isArray(permisos)) {
              this.filteredNavItems = getFilteredNavItems(permisos);
              console.log('Elementos filtrados:', this.filteredNavItems);
            } else {
              console.error('Permisos no es un array:', permisos);
            }
          });
        }
      } catch (error) {
        console.error('Error parsing token from localStorage', error);
      }
    }
  }
}