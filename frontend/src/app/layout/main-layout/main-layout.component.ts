import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

// Layout de la zona privada: navbar + contenido + footer
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly sesion = this.auth.sesion;
  readonly inicial = computed(() => this.sesion()?.nombre?.charAt(0).toUpperCase() ?? '?');
  readonly menuAbierto = signal(false);
  readonly anio = new Date().getFullYear();

  alternarMenu(event: Event): void {
    event.stopPropagation();
    this.menuAbierto.update(v => !v);
  }

  // Cierra el menú al hacer clic fuera o con Escape
  @HostListener('document:click')
  @HostListener('document:keydown.escape')
  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  cerrarSesion(): void {
    this.menuAbierto.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
