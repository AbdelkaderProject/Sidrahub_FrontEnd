import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./views/pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'pages',
    loadChildren: () => import('./views/pages/routes').then(m => m.routes),
    canActivate: [loginGuard]
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/default-layout/default-layout.component').then(m => m.DefaultLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'services' }
      },
      {
        path: 'orders',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'orders' }
      },
      {
        path: 'consultations',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'consultations' }
      },
      {
        path: 'providers',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'providers' }
      },
      {
        path: 'blog',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'blog' }
      },
      {
        path: 'admin',
        loadComponent: () => import('./views/business-module/business-module.component').then(m => m.BusinessModuleComponent),
        data: { module: 'admin' }
      }
    ]
  },
  {
    path: 'logout',
    loadComponent: () => import('./views/pages/logout/logout.component').then(m => m.LogoutComponent)
  },
  {
    path: '**',
    redirectTo: 'pages/login'
  }
];
