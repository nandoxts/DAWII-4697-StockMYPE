import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

// Envoltorio de SweetAlert2: toasts y diálogos de confirmación con el estilo de la app
@Injectable({ providedIn: 'root' })
export class NotificacionService {

  private readonly toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  exito(mensaje: string): void {
    this.toast.fire({ icon: 'success', title: mensaje });
  }

  error(mensaje: string): void {
    this.toast.fire({ icon: 'error', title: mensaje });
  }

  async confirmar(titulo: string, texto: string, textoBoton = 'Sí, eliminar'): Promise<boolean> {
    const resultado = await Swal.fire({
      title: titulo,
      html: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textoBoton,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        confirmButton: 'btn btn-danger px-4',
        cancelButton: 'btn btn-light border px-4 me-2'
      },
      buttonsStyling: false
    });
    return resultado.isConfirmed;
  }
}
