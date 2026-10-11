import { Component, input } from '@angular/core';

// Estado vacío / de error con ícono y contenido proyectado (ej: un botón)
@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="text-center text-body-secondary py-5 px-3">
      <i class="bi fs-1 d-block mb-2 opacity-50" [class]="'bi fs-1 d-block mb-2 opacity-50 ' + icono()"></i>
      <p class="mb-3">{{ mensaje() }}</p>
      <ng-content />
    </div>
  `
})
export class EmptyStateComponent {
  readonly icono = input('bi-inbox');
  readonly mensaje = input.required<string>();
}
