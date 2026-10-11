import { Component, computed, input } from '@angular/core';

import { STOCK_MINIMO } from '../../../core/models/producto.model';

// Badge de stock: verde (ok), ámbar (bajo) o rojo (agotado)
@Component({
  selector: 'app-stock-badge',
  standalone: true,
  template: `
    <span class="badge rounded-pill" [class]="'badge rounded-pill ' + estilo().clase">
      <i class="bi me-1" [class]="'bi me-1 ' + estilo().icono"></i>{{ stock() }}
      @if (estilo().texto) { <span class="ms-1">· {{ estilo().texto }}</span> }
    </span>
  `
})
export class StockBadgeComponent {
  readonly stock = input.required<number>();

  readonly estilo = computed(() => {
    const s = this.stock();
    if (s === 0) return { clase: 'text-bg-danger', icono: 'bi-x-circle', texto: 'Agotado' };
    if (s <= STOCK_MINIMO) return { clase: 'bg-warning-subtle text-warning-emphasis', icono: 'bi-exclamation-triangle', texto: 'Bajo' };
    return { clase: 'bg-success-subtle text-success-emphasis', icono: 'bi-check-circle', texto: '' };
  });
}
