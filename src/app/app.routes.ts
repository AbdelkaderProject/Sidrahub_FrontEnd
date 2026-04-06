import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { PublicLayoutComponent } from './shared/layouts/public-layout.component';
import { AboutComponent } from './views/pages/about/about.component';
import { ArticlesComponent } from './views/pages/articles/articles.component';
import { ConsultingComponent } from './views/pages/consulting/consulting.component';
import { HomeComponent } from './views/pages/home/home.component';
import { ContactComponent } from './views/pages/contact/contact.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'contact-us',
        component: ContactComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'about-us',
        component: AboutComponent
      },
      {
        path: 'articles',
        component: ArticlesComponent
      },
      {
        path: 'blog',
        component: ArticlesComponent
      },
      {
        path: 'booking/consulting',
        component: ConsultingComponent
      }
    ]
  },
  {
    path: 'ar',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'contact-us',
        component: ContactComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'about-us',
        component: AboutComponent
      },
      {
        path: 'articles',
        component: ArticlesComponent
      },
      {
        path: 'blog',
        component: ArticlesComponent
      },
      {
        path: 'booking/consulting',
        component: ConsultingComponent
      }
    ]
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
