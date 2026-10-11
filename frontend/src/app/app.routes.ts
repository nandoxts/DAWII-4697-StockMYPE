import { Routes } from '@angular/router';

import { authGuard, invitadoGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  // Zona pública
  {
    path: 'login',
    canActivate: [invitadoGuard],
    title: 'Iniciar sesión · StockMYPE',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  // Zona privada (requiere login): comparte navbar y footer
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'productos',
        loadChildren: () => import('./features/productos/productos.routes').then(m => m.PRODUCTOS_ROUTES)
      },
      { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
