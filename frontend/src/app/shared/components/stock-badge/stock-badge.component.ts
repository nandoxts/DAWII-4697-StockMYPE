import { Component, computed, input } from '@angular/core';

import { STOCK_MINIMO } from '../../../core/models/producto.model';

// Stock: número normal; resaltado solo cuando está bajo o agotado
@Component({
  selector: 'app-stock-badge',
  standalone: true,
  template: `
    @switch (estado()) {
      @case ('agotado') { <span class="etiqueta agotado">Agotado</span> }
      @case ('bajo') { <span class="etiqueta bajo">{{ stock() }} · bajo</span> }
      @default { <span>{{ stock() }}</span> }
    }
  `,
  styles: [`
    .etiqueta { display: inline-block; padding: .15rem .5rem; border-radius: 4px; font-size: .8rem; font-weight: 500; white-space: nowrap; }
    .bajo { background: #fef3c7; color: #92400e; }
    .agotado { background: #fde8e7; color: #b42318; }
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
