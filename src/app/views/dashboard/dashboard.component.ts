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
  readonly title = 'SidraHub Admin Dashboard';
  readonly subtitle = 'Unified workspace to manage company profile content, services, articles, partners, branches, and incoming orders.';
  readonly modulesTitle = 'SidraHub Modules';
  readonly modulesHint = 'Open any section to manage the content and records displayed across the SidraHub platform.';
  readonly scenarioHint = 'Flow: update your company profile, publish services and articles, then track incoming client orders from one place.';

  readonly stats: DashboardStat[] = [
    { icon: 'pi pi-building', label: 'Company Profile', value: '1' },
    { icon: 'pi pi-briefcase', label: 'Published Services', value: '24+' },
    { icon: 'pi pi-shopping-cart', label: 'Active Orders', value: '18' },
    { icon: 'pi pi-users', label: 'Partners & Team', value: '12' }
  ];

  readonly quickLinks: QuickLink[] = [
    { route: '/company-profiles', title: 'Company Profile', description: 'Manage the main company identity, description, logo, and business metrics.' },
    { route: '/services', title: 'Services', description: 'Manage services, categories, packages, and what appears to clients on the platform.' },
    { route: '/orders', title: 'Orders', description: 'Track submitted orders and follow up with clients from the admin dashboard.' },
    { route: '/partners', title: 'Partners', description: 'Manage partner logos and connect each partner to the company profile.' },
    { route: '/articles', title: 'Articles', description: 'Publish bilingual articles and manage article comments from the content section.' }
  ];
}
