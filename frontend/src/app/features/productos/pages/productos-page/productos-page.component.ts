import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Producto, STOCK_MINIMO } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { NotificacionService } from '../../../../shared/services/notificacion.service';
import { mensajeDeError } from '../../../../shared/utils/api-error.util';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ProductosResumenComponent } from '../../components/productos-resumen/productos-resumen.component';
import { CampoOrden, Orden, ProductosTablaComponent } from '../../components/productos-tabla/productos-tabla.component';
import { ProductoFormComponent } from '../../components/producto-form/producto-form.component';

type FiltroEstado = '' | 'ok' | 'bajo' | 'agotado';

const POR_PAGINA = 8;
const CATEGORIAS_BASE = ['Abarrotes', 'Lácteos', 'Bebidas', 'Limpieza', 'Snacks', 'Cuidado personal'];

// Página contenedora: carga datos, filtra/ordena/pagina y coordina los componentes hijos
@Component({
  selector: 'app-productos-page',
  standalone: true,
  imports: [EmptyStateComponent, ProductosResumenComponent, ProductosTablaComponent, ProductoFormComponent],
  templateUrl: './productos-page.component.html',
  styleUrl: './productos-page.component.css'
})
export class ProductosPageComponent implements OnInit {

  private readonly productoService = inject(ProductoService);
  private readonly notificacion = inject(NotificacionService);

  // ===== Estado =====
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  /** Solo la primera carga muestra esqueletos; las recargas mantienen la tabla visible */
  readonly primeraCarga = signal(true);
  readonly errorCarga = signal<string | null>(null);

  readonly busqueda = signal('');
  readonly categoria = signal('');
  readonly estado = signal<FiltroEstado>('');
  readonly orden = signal<Orden>({ campo: 'nombre', asc: true });
  readonly pagina = signal(1);

  /** undefined = modal cerrado, null = nuevo, Producto = editando */
  readonly enFormulario = signal<Producto | null | undefined>(undefined);

  // ===== Derivados =====
  readonly categorias = computed(() =>
    [...new Set([...CATEGORIAS_BASE, ...this.productos().map(p => p.categoria)])].sort());

  readonly filtrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    const est = this.estado();
    const { campo, asc } = this.orden();

    return this.productos()
      .filter(p => !cat || p.categoria === cat)
      .filter(p => !est || this.estadoDe(p.stock) === est)
      .filter(p => !q || p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q))
      .sort((a, b) => {
        const va = a[campo], vb = b[campo];
        const cmp = typeof va === 'number' && typeof vb === 'number'
          ? va - vb
          : String(va).localeCompare(String(vb), 'es');
        return asc ? cmp : -cmp;
      });
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / POR_PAGINA)));
  readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));
  readonly visibles = computed(() => {
    const inicio = (this.pagina() - 1) * POR_PAGINA;
    return this.filtrados().slice(inicio, inicio + POR_PAGINA);
  });
  readonly rango = computed(() => {
    const total = this.filtrados().length;
    const desde = total === 0 ? 0 : (this.pagina() - 1) * POR_PAGINA + 1;
    return { desde, hasta: Math.min(this.pagina() * POR_PAGINA, total), total };
  });
  readonly hayFiltros = computed(() => !!(this.busqueda() || this.categoria() || this.estado()));

  constructor() {
    // Si cambian los filtros (o se borra el último de una página), volver a una página válida
    effect(() => {
      if (this.pagina() > this.totalPaginas()) this.pagina.set(this.totalPaginas());
    }, { allowSignalWrites: true });
  }

  ngOnInit(): void {
    this.cargar();
  }

  // GET /api/productos
  // Las recargas (tras crear/editar/eliminar) no vacían la tabla: se actualiza en el sitio, sin parpadeo
  cargar(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.productoService.listar().subscribe({
      next: data => {
        this.productos.set(data);
        this.cargando.set(false);
        this.primeraCarga.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const mensaje = mensajeDeError(err, 'No se pudieron cargar los productos.');
        this.cargando.set(false);
        this.primeraCarga.set(false);
        this.errorCarga.set(mensaje);
        if (this.productos().length > 0) this.notificacion.error(mensaje);
      }
    });
  }

  nuevo(): void {
    this.enFormulario.set(null);
  }

  // GET /api/productos/{id} -> datos frescos antes de editar
  editar(producto: Producto): void {
    this.productoService.obtener(producto.id).subscribe({
      next: p => this.enFormulario.set(p),
      error: (err: HttpErrorResponse) => {
        this.notificacion.error(mensajeDeError(err, 'No se encontró el producto'));
        this.cargar();
      }
    });
  }

  onGuardado(producto: Producto): void {
    const eraEdicion = this.enFormulario() !== null;
    this.enFormulario.set(undefined);
    this.notificacion.exito(`Producto "${producto.nombre}" ${eraEdicion ? 'actualizado' : 'creado'}`);
    this.cargar();
  }

  // DELETE /api/productos/{id}
  async eliminar(producto: Producto): Promise<void> {
    const ok = await this.notificacion.confirmar(
      '¿Eliminar producto?',
      `Se eliminará <b>${this.escapar(producto.nombre)}</b> (${this.escapar(producto.codigo)}).<br>Esta acción no se puede deshacer.`);
    if (!ok) return;

    this.productoService.eliminar(producto.id).subscribe({
      next: () => {
        this.notificacion.exito(`Producto "${producto.nombre}" eliminado`);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => {
        this.notificacion.error(mensajeDeError(err, 'No se pudo eliminar'));
        this.cargar();
      }
    });
  }

  ordenar(campo: CampoOrden): void {
    const o = this.orden();
    this.orden.set({ campo, asc: o.campo === campo ? !o.asc : true });
  }

  // ===== Filtros =====
  onBuscar(e: Event): void { this.busqueda.set((e.target as HTMLInputElement).value); this.pagina.set(1); }
  onCategoria(e: Event): void { this.categoria.set((e.target as HTMLSelectElement).value); this.pagina.set(1); }
  onEstado(e: Event): void { this.estado.set((e.target as HTMLSelectElement).value as FiltroEstado); this.pagina.set(1); }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.categoria.set('');
    this.estado.set('');
    this.pagina.set(1);
  }

  private estadoDe(stock: number): Exclude<FiltroEstado, ''> {
    if (stock === 0) return 'agotado';
    return stock <= STOCK_MINIMO ? 'bajo' : 'ok';
  }

  private escapar(texto: string): string {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }
}
