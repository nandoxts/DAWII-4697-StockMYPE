import { Routes } from '@angular/router';

import { ProductosPageComponent } from './pages/productos-page/productos-page.component';

export const PRODUCTOS_ROUTES: Routes = [
  { path: '', component: ProductosPageComponent, title: 'Inventario · StockMYPE' }
];
