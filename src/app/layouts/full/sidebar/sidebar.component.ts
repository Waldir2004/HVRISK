import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    BrandingComponent, 
    TablerIconsModule, 
    MaterialModule, 
    RouterModule,
    CommonModule
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  userName: string = '';
  userPhoto: SafeUrl | string = 'assets/images/profile/profile.png';
  defaultPhoto = 'assets/images/profile/profile.png';

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const token = localStorage.getItem('decodedToken');
    if (!token) return;

    try {
      const decodedToken = JSON.parse(token);
      
      // Cargar nombre del usuario
      const nombre = decodedToken?.nombre;
      const apellido = decodedToken?.apellido;
      if (nombre && apellido) {
        this.userName = `${nombre} ${apellido}`;
      }

      // Cargar foto del usuario (Google o backend)
      if (decodedToken.photo_url) {
        this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(decodedToken.photo_url);
      } else if (decodedToken.foto_usuario) {
        this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(decodedToken.foto_usuario);
      }
    } catch (error) {
      console.error('Error parsing user data from token', error);
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('decodedToken');
    this.router.navigate(['/authentication/login']);
  }
}