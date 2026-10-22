import { Component, computed, input } from '@angular/core';

import { STOCK_MINIMO } from '../../../core/models/producto.model';

// Stock: número normal; resaltado solo cuando está bajo o agotado
@Component({
  selector: 'app-stock-badge',
  standalone: true,
  template: `
    @switch (estado()) {
      @case ('agotado') { <span class="etiqueta agotado"><span class="punto"></span>Agotado</span> }
      @case ('bajo') { <span class="etiqueta bajo"><span class="punto"></span>{{ stock() }} · bajo</span> }
      @default { <span class="normal">{{ stock() }}</span> }
    }
  `,
  styles: [`
    .etiqueta {
      display: inline-flex; align-items: center; gap: .35rem; padding: .2rem .6rem; border-radius: 999px;
      font-size: .8rem; font-weight: 700; white-space: nowrap;
    }
    .punto { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
    .bajo { background: #fef3c7; color: #b45309; }
    .agotado { background: #fee2e2; color: #dc2626; }
    .normal { font-weight: 600; }
  `]
})
export class StockBadgeComponent {
  readonly stock = input.required<number>();

  readonly estado = computed(() => {
    const s = this.stock();
    if (s === 0) return 'agotado';
    return s <= STOCK_MINIMO ? 'bajo' : 'ok';
  });
}
