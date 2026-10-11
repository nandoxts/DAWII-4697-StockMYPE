import { Component, input } from '@angular/core';

export type StatVariante = 'normal' | 'alerta';

// Tarjeta de indicador (KPI) reutilizable
@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center text-body-secondary small">
          <span>{{ etiqueta() }}</span>
          <i class="bi" [class]="'bi ' + icono()"></i>
        </div>
        @if (cargando()) {
          <span class="esqueleto mt-2" style="width: 60%; height: 1.6rem"></span>
        } @else {
          <div class="valor" [class.alerta]="variante() === 'alerta'">{{ valor() }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .valor { font-size: 1.5rem; font-weight: 600; margin-top: .25rem; white-space: nowrap; animation: aparecer .25s ease-out; }
    .alerta { color: #b45309; }
    @keyframes aparecer { from { opacity: 0; } }
    @media (max-width: 575px) { .valor { font-size: 1.2rem; } }
  `]
})
export class StatCardComponent {
  readonly icono = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string | number>();
  readonly variante = input<StatVariante>('normal');
  readonly cargando = input(false);
}
