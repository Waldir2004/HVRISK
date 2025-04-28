import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit
} from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule, Router } from '@angular/router'; // Importa Router
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrandingComponent } from '../sidebar/branding.component';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule, BrandingComponent],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  userPhoto: SafeUrl | string = '/assets/images/profile/profile.png';
  defaultPhoto = '/assets/images/profile/profile.png';

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadUserPhoto();
  }

  loadUserPhoto(): void {
    try {
      const decodedToken = localStorage.getItem('decodedToken');
      if (decodedToken) {
        const tokenData = JSON.parse(decodedToken);
        
        // Verifica si hay photo_url de Google
        if (tokenData.photo_url) {
          // Sanitiza la URL para seguridad
          this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(tokenData.photo_url);
          console.log('Google photo URL:', tokenData.photo_url); // Para depuración
        } 
        // Si no hay photo_url, verifica foto_usuario del backend
        else if (tokenData.foto_usuario) {
          this.userPhoto = this.sanitizer.bypassSecurityTrustUrl(tokenData.foto_usuario);
        }
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
      this.userPhoto = this.defaultPhoto;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('decodedToken');
    this.router.navigate(['/authentication/login']);
  }
}