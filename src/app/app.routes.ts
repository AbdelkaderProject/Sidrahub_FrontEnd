import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { dashboardGuard } from './auth/dashboard.guard';
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
        loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [dashboardGuard]
      },
      {
        path: 'services',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'services' }
      },
      {
        path: 'service-categories',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'service-categories' }
      },
      {
        path: 'service-packages',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'service-packages' }
      },
      {
        path: 'articles',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'articles' }
      },
      {
        path: 'article-comments',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'article-comments' }
      },
      {
        path: 'sidebars',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'sidebars' }
      },
      {
        path: 'company-profiles',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'company-profiles' }
      },
      {
        path: 'team-members',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'team-members' }
      },
      {
        path: 'partners',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'partners' }
      },
      {
        path: 'branches',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'branches' }
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
        redirectTo: 'admin/articles',
        pathMatch: 'full'
      },
      {
        path: 'admin/article-comments',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'article-comments' }
      },
      {
        path: 'admin/articles',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'articles' }
      },
      {
        path: 'admin/auth',
        loadComponent: () => import('./views/admin/api-readonly-page.component').then(m => m.ApiReadonlyPageComponent),
        data: { pageKey: 'auth' }
      },
      {
        path: 'admin/company-profiles',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'company-profiles' }
      },
      {
        path: 'admin/localization',
        loadComponent: () => import('./views/admin/api-readonly-page.component').then(m => m.ApiReadonlyPageComponent),
        data: { pageKey: 'localization' }
      },
      {
        path: 'admin/service-categories',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'service-categories' }
      },
      {
        path: 'admin/service-packages',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'service-packages' }
      },
      {
        path: 'admin/services',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'services' }
      },
      {
        path: 'admin/setup',
        loadComponent: () => import('./views/admin/api-readonly-page.component').then(m => m.ApiReadonlyPageComponent),
        data: { pageKey: 'setup' }
      },
      {
        path: 'admin/sidebars',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'sidebars' }
      },
      {
        path: 'admin/team-members',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'team-members' }
      },
      {
        path: 'admin/partners',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'partners' }
      },
      {
        path: 'admin/branches',
        loadComponent: () => import('./views/admin/admin-resource-page.component').then(m => m.AdminResourcePageComponent),
        data: { resourceKey: 'branches' }
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
