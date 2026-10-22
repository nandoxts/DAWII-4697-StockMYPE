import { Component, input } from '@angular/core';

export type StatVariante = 'normal' | 'alerta';
export type StatTono = 'verde' | 'teal' | 'azul' | 'ambar';

// Tarjeta de indicador (KPI) reutilizable
@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <div class="card h-100 tarjeta" [class.alerta]="variante() === 'alerta'">
      <div class="card-body d-flex align-items-center gap-3">
        <span class="chip" [class]="'chip ' + tono()"><i [class]="'bi ' + icono()"></i></span>
        <div class="min-w-0">
          <div class="etiqueta">{{ etiqueta() }}</div>
          @if (cargando()) {
            <span class="esqueleto mt-2" style="width: 90px; height: 1.5rem"></span>
          } @else {
            <div class="valor">{{ valor() }}</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tarjeta { border: none; }
    .chip {
      flex: none; width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center;
      font-size: 1.35rem; color: #fff;
    }
    .verde { background: linear-gradient(135deg, #10b981, #047857); }
    .teal  { background: linear-gradient(135deg, #14b8a6, #0f766e); }
    .azul  { background: linear-gradient(135deg, #38bdf8, #0369a1); }
    .ambar { background: linear-gradient(135deg, #fbbf24, #d97706); }
    .etiqueta { font-size: .82rem; font-weight: 600; color: var(--bs-secondary-color); }
    .valor { font-size: 1.6rem; font-weight: 800; letter-spacing: -.02em; white-space: nowrap; animation: aparecer .25s ease-out; }
    .alerta { background: #fffbeb; box-shadow: inset 0 0 0 1px #fde68a, 0 8px 24px rgba(217, 119, 6, .12); }
    .alerta .valor { color: #b45309; }
    .min-w-0 { min-width: 0; }
    @keyframes aparecer { from { opacity: 0; } }
    @media (max-width: 575px) { .valor { font-size: 1.25rem; } .chip { width: 40px; height: 40px; font-size: 1.1rem; } }
  `]
})
export class StatCardComponent {
  readonly icono = input.required<string>();
  readonly etiqueta = input.required<string>();
  readonly valor = input.required<string | number>();
  readonly variante = input<StatVariante>('normal');
  readonly tono = input<StatTono>('verde');
  readonly cargando = input(false);
}
