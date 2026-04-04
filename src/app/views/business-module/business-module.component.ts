import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type ModuleKey = 'services' | 'orders' | 'consultations' | 'providers' | 'blog' | 'admin';

interface ModuleConfig {
  title: string;
  description: string;
  features: string[];
  statuses: string[];
  tableColumns: string[];
  tableRows: string[][];
}

@Component({
  selector: 'app-business-module',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './business-module.component.html',
  styleUrl: './business-module.component.scss'
})
export class BusinessModuleComponent {
  private readonly route = inject(ActivatedRoute);

  readonly moduleKey = computed(() => (this.route.snapshot.data['module'] ?? 'services') as ModuleKey);

  private readonly moduleConfig: Record<ModuleKey, ModuleConfig> = {
    services: {
      title: 'Services Module',
      description: 'Showcase service categories and maintain pricing, duration, and activation status.',
      features: [
        'Browse categories and services',
        'Store base pricing per service',
        'Set estimated execution days',
        'Control Active / Inactive state'
      ],
      statuses: ['Active', 'Inactive'],
      tableColumns: ['Service', 'Category', 'Price', 'ETA'],
      tableRows: [
        ['Company Formation', 'Legal', '$450', '3 days'],
        ['Tax Filing', 'Accounting', '$220', '2 days'],
        ['Recruitment Setup', 'HR', '$300', '4 days']
      ]
    },
    orders: {
      title: 'Orders Module',
      description: 'Client selects services and submits the order. Admin receives it and contacts the client directly.',
      features: [
        'Support one or more services in the same order',
        'Submit order directly from client portal',
        'Send submitted orders to admin dashboard instantly',
        'Admin contacts the client by phone or email'
      ],
      statuses: ['Submitted', 'Contacted', 'Closed'],
      tableColumns: ['Order #', 'Client', 'Requested Services', 'Follow-up Status'],
      tableRows: [
        ['ORD-1042', 'Ahmed Ali', 'Company Formation + Tax Filing', 'Submitted'],
        ['ORD-1043', 'Maya Samir', 'HR Setup', 'Contacted'],
        ['ORD-1044', 'Noor Ltd', 'Legal Consultation', 'Closed']
      ]
    },
    consultations: {
      title: 'Consultation Module',
      description: 'Receive free consultation requests and assign the right service path quickly.',
      features: [
        'Public free consultation request',
        'Link request to a service',
        'Track Pending / Responded',
        'Capture lead contact details'
      ],
      statuses: ['Pending', 'Responded'],
      tableColumns: ['Ticket #', 'Name', 'Service', 'Status'],
      tableRows: [
        ['CON-781', 'Omar Adel', 'Company Setup', 'Pending'],
        ['CON-782', 'Salma Medhat', 'Tax Consultation', 'Responded'],
        ['CON-783', 'Yousef Group', 'HR Policy', 'Pending']
      ]
    },
    providers: {
      title: 'Providers Module',
      description: 'Manage service partners and connect each provider to relevant services.',
      features: [
        'Maintain partner profiles',
        'Map providers to services',
        'Track operational availability',
        'Monitor provider quality and updates'
      ],
      statuses: ['Active', 'Inactive', 'Onboarding'],
      tableColumns: ['Provider', 'Type', 'Services', 'Status'],
      tableRows: [
        ['Legal Partners Co.', 'Legal', '4', 'Active'],
        ['Smart Accounts', 'Accounting', '3', 'Onboarding'],
        ['People Hub', 'HR', '5', 'Active']
      ]
    },
    blog: {
      title: 'Blog Module',
      description: 'Publish bilingual articles to improve SEO and customer education.',
      features: [
        'SEO-optimized publishing',
        'Arabic and English support',
        'Manage slugs and article URLs',
        'Plan draft, schedule, and publish'
      ],
      statuses: ['Draft', 'Published', 'Scheduled'],
      tableColumns: ['Title', 'Language', 'Status', 'Published At'],
      tableRows: [
        ['How to Start in KSA', 'EN', 'Published', '2026-03-30'],
        ['Quick Setup Guide', 'AR', 'Published', '2026-04-01'],
        ['Tax Compliance Checklist', 'EN', 'Scheduled', '2026-04-07']
      ]
    },
    admin: {
      title: 'Admin Control Module',
      description: 'Centralized control for users, roles, partners, and platform governance.',
      features: [
        'Manage users and platform accounts',
        'Control role-based permissions',
        'Manage blog and service content',
        'Supervise providers and operation flows'
      ],
      statuses: ['Operational', 'Monitoring'],
      tableColumns: ['Scope', 'Owner', 'State', 'Last Update'],
      tableRows: [
        ['Users & Roles', 'Admin Team', 'Operational', 'Today'],
        ['Service Catalog', 'Operations', 'Monitoring', 'Today'],
        ['Order Follow-up', 'Customer Success', 'Operational', 'Today']
      ]
    }
  };

  readonly config = computed(() => this.moduleConfig[this.moduleKey()]);
}
