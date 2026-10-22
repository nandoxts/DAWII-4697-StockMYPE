import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

import { Producto, STOCK_MINIMO } from '../../../../core/models/producto.model';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';

// Fila de KPIs del inventario
@Component({
  selector: 'app-productos-resumen',
  standalone: true,
  imports: [StatCardComponent],
  providers: [CurrencyPipe, DecimalPipe],
  template: `
    <div class="row g-3">
      <div class="col-6 col-lg-3">
        <app-stat-card icono="bi-box-seam" tono="verde" etiqueta="Productos" [valor]="resumen().total" [cargando]="cargando()" />
      </div>
      <div class="col-6 col-lg-3">
        <app-stat-card icono="bi-stack" tono="teal" etiqueta="Unidades en stock" [valor]="resumen().unidades" [cargando]="cargando()" />
      </div>
      <div class="col-6 col-lg-3">
        <app-stat-card icono="bi-cash-coin" tono="azul" etiqueta="Valor del inventario" [valor]="resumen().valor" [cargando]="cargando()" />
      </div>
      <div class="col-6 col-lg-3">
        <app-stat-card icono="bi-exclamation-triangle" tono="ambar" [etiqueta]="'Stock bajo (≤ ' + stockMinimo + ')'"
                       [variante]="resumen().bajos > 0 ? 'alerta' : 'normal'" [valor]="resumen().bajos" [cargando]="cargando()" />
      </div>
    </div>
  `
})
export class ProductosResumenComponent {

  readonly productos = input.required<Producto[]>();
  readonly cargando = input(false);
  readonly stockMinimo = STOCK_MINIMO;

  private readonly moneda = inject(CurrencyPipe);
  private readonly numero = inject(DecimalPipe);

  readonly resumen = computed(() => {
    const lista = this.productos();
    const valor = lista.reduce((acc, p) => acc + p.precio * p.stock, 0);
    return {
      total: lista.length,
      unidades: this.numero.transform(lista.reduce((acc, p) => acc + p.stock, 0)) ?? '0',
      valor: this.moneda.transform(valor, 'PEN', 'S/ ', '1.2-2') ?? '',
      bajos: lista.filter(p => p.stock <= STOCK_MINIMO).length
    };
  });
}
