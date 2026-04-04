import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface DashboardStat {
  icon: string;
  label: string;
  value: string;
}

interface QuickLink {
  route: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  readonly title = 'Shop Stop One - Business Platform';
  readonly subtitle = 'Unified workspace for company setup, legal advisory, accounting, HR, workspaces, and partnerships.';
  readonly modulesTitle = 'Platform Modules';
  readonly modulesHint = 'Open any module to manage related records and workflows.';
  readonly scenarioHint = 'Scenario: client submits an order, then admin receives it and contacts the client directly.';

  readonly stats: DashboardStat[] = [
    { icon: 'pi pi-briefcase', label: 'Published Services', value: '24+' },
    { icon: 'pi pi-shopping-cart', label: 'Active Orders', value: '18' },
    { icon: 'pi pi-send', label: 'Submitted Today', value: '7' },
    { icon: 'pi pi-users', label: 'Service Providers', value: '9' }
  ];

  readonly quickLinks: QuickLink[] = [
    { route: '/services', title: 'Services', description: 'Manage categories, pricing, and estimated delivery time.' },
    { route: '/orders', title: 'Orders', description: 'Client submits order and admin follows up by phone/email.' },
    { route: '/consultations', title: 'Consultations', description: 'Handle free consultation requests from clients.' },
    { route: '/providers', title: 'Providers', description: 'Manage provider profiles and service assignments.' },
    { route: '/blog', title: 'Blog', description: 'Publish bilingual SEO articles and updates.' }
  ];
}
