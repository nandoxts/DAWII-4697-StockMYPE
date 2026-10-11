import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Producto, ProductoRequest } from '../../../../core/models/producto.model';
import { ProductoService } from '../../../../core/services/producto.service';
import { erroresDeCampo, mensajeDeError } from '../../../../shared/utils/api-error.util';

type Campo = 'codigo' | 'nombre' | 'descripcion' | 'categoria' | 'precio' | 'stock';

// Modal de alta / edición. Hace el POST o PUT y emite el producto guardado.
@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);

  /** null = crear; un producto = editar */
  readonly producto = input<Producto | null>(null);
  readonly categorias = input<string[]>([]);

  readonly guardado = output<Producto>();
  readonly cerrar = output<void>();

  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
    categoria: ['', [Validators.required, Validators.maxLength(50)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]]
  });

  get esEdicion(): boolean {
    return this.producto() !== null;
  }

  ngOnInit(): void {
    const p = this.producto();
    if (p) {
      this.form.reset({
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion ?? '',
        categoria: p.categoria,
        precio: p.precio,
        stock: p.stock
      });
    }
  }

  // POST /api/productos  |  PUT /api/productos/{id}
  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();
    const request: ProductoRequest = { ...valor, descripcion: valor.descripcion.trim() || null };
    const p = this.producto();
    const operacion = p
      ? this.productoService.actualizar(p.id, request)
      : this.productoService.crear(request);

    this.guardando.set(true);
    this.error.set(null);

    operacion.subscribe({
      next: res => {
        this.guardando.set(false);
        this.guardado.emit(res);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        Object.entries(erroresDeCampo(err)).forEach(([campo, msg]) =>
          this.form.get(campo)?.setErrors({ servidor: msg }));
        this.error.set(mensajeDeError(err, 'No se pudo guardar el producto'));
      }
    });
  }

  cancelar(): void {
    if (!this.guardando()) this.cerrar.emit();
  }

  errorDe(campo: Campo): string | null {
    const c = this.form.controls[campo];
    if (!c.touched || !c.errors) return null;
    if (c.errors['servidor']) return c.errors['servidor'];
    if (c.errors['required']) return 'Campo obligatorio';
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres`;
    if (c.errors['min']) return campo === 'precio' ? 'Debe ser mayor a 0' : 'No puede ser negativo';
    return 'Valor inválido';
  }
}
