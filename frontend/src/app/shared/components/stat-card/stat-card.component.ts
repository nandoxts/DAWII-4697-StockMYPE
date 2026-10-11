import { Component, input } from '@angular/core';

export type StatVariante = 'primary' | 'success' | 'warning' | 'danger' | 'info';

// Tarjeta de indicador (KPI) reutilizable
@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card stat h-100">
      <div class="card-body d-flex align-items-center gap-3">
        <div class="stat-icono" [class]="'stat-icono bg-' + variante() + '-subtle text-' + variante() + '-emphasis'">
          <i class="bi" [class]="'bi ' + icono()"></i>
        </div>
        <div class="min-w-0">
          <div class="text-body-secondary small fw-medium">{{ etiqueta() }}</div>
          <div class="valor fw-bold">{{ valor() }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-icono {
      width: 48px; height: 48px; border-radius: 14px; flex-shrink: 0;
      display: grid; place-items: center; font-size: 22px;
    }
    .min-w-0 { min-width: 0; }
    .valor { font-size: clamp(1.05rem, 4.2vw, 1.5rem); line-height: 1.2; white-space: nowrap; }
    @media (max-width: 575px) { .card-body { padding: .85rem; gap: .65rem !important; } .stat-icono { width: 38px; height: 38px; font-size: 18px; border-radius: 11px; } }
  `]
})
export class StatCardComponent {
  readonly icono = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string | number>();
  readonly variante = input<StatVariante>('primary');
}
