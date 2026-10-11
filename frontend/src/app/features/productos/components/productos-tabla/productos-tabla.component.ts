import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { Producto } from '../../../../core/models/producto.model';
import { StockBadgeComponent } from '../../../../shared/components/stock-badge/stock-badge.component';

export type CampoOrden = 'codigo' | 'nombre' | 'categoria' | 'precio' | 'stock';
export interface Orden { campo: CampoOrden; asc: boolean; }

// Tabla de productos (presentacional): solo muestra y emite eventos
@Component({
  selector: 'app-productos-tabla',
  standalone: true,
  imports: [CurrencyPipe, StockBadgeComponent],
  templateUrl: './productos-tabla.component.html',
  styleUrl: './productos-tabla.component.css',
  animations: [
    // Filas nuevas aparecen en cascada; las eliminadas se desvanecen
    trigger('filas', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(4px)' }),
          stagger(25, animate('180ms ease-out', style({ opacity: 1, transform: 'none' })))
        ], { optional: true }),
        query(':leave', [animate('150ms ease-in', style({ opacity: 0 }))], { optional: true })
      ])
    ])
  ]
})
export class ProductosTablaComponent {

  readonly productos = input.required<Producto[]>();
  readonly orden = input.required<Orden>();
  readonly cargando = input(false);

  readonly editar = output<Producto>();
  readonly eliminar = output<Producto>();
  readonly ordenar = output<CampoOrden>();

  readonly columnas: { campo: CampoOrden; titulo: string; derecha?: boolean }[] = [
    { campo: 'codigo', titulo: 'Código' },
    { campo: 'nombre', titulo: 'Producto' },
    { campo: 'categoria', titulo: 'Categoría' },
    { campo: 'precio', titulo: 'Precio', derecha: true },
    { campo: 'stock', titulo: 'Stock', derecha: true }
  ];

  readonly filasEsqueleto = [1, 2, 3, 4, 5];

  iconoOrden(campo: CampoOrden): string {
    const o = this.orden();
    if (o.campo !== campo) return 'bi-arrow-down-up opacity-25';
    return o.asc ? 'bi-sort-up' : 'bi-sort-down';
  }
}
