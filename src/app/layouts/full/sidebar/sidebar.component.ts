import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router) {} // Inyecta Router

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  userName: string = '';

  ngOnInit(): void {
    const token = localStorage.getItem('decodedToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(token);
        const nombre = decodedToken?.nombre;
        const apellido = decodedToken?.apellido;
        if (nombre && apellido) {
          this.userName = `${nombre} ${apellido}`;
        }
      } catch (error) {
        console.error('Error parsing token from localStorage', error);
      }
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('decodedToken');
    this.router.navigate(['/authentication/login']);
  }
}