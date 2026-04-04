import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ServiceOption {
  id: string;
  label_en: string;
  label_ar: string;
}

@Component({
  selector: 'app-services-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './services-dropdown.component.html',
  styleUrls: ['./services-dropdown.component.scss']
})
export class ServicesDropdownComponent implements OnInit {
  private readonly http = inject(HttpClient);

  @Output() serviceSelected = new EventEmitter<ServiceOption>();

  selectedService: ServiceOption | null = null;
  services: ServiceOption[] = [];
  isLoading = false;
  currentLanguage = 'en';

  ngOnInit(): void {
    this.loadServices();
    this.detectLanguage();
  }

  private loadServices(): void {
    this.isLoading = true;
    // البيانات الثابتة للخدمات
    this.services = [
      {
        id: 'economic-investment',
        label_en: 'Economic and Investment Consultations',
        label_ar: 'الاستشارات الاقتصادية والاستثمارية'
      },
      {
        id: 'legal-economic',
        label_en: 'Legal and Economic Consultations',
        label_ar: 'الاستشارات القانونية والاقتصادية'
      },
      {
        id: 'accounting-legal',
        label_en: 'Accounting and Legal Consultations',
        label_ar: 'الاستشارات المحاسبية والقانونية'
      },
      {
        id: 'private-sector-health',
        label_en: 'Referrals for Private Sector Health Reports - 3 Periods',
        label_ar: 'إحالات لتقرير فحص القطاع الخاص خلال 3 فترات'
      },
      {
        id: 'arab-research',
        label_en: 'Arab Research Work and Comparative Studies for Companies',
        label_ar: 'عمل الأبحاث العربية والدراسات المقارنة للشركات'
      }
    ];
    this.isLoading = false;
  }

  private detectLanguage(): void {
    const htmlLang = document.documentElement.lang;
    this.currentLanguage = htmlLang === 'ar' ? 'ar' : 'en';
  }

  getServiceLabel(service: ServiceOption): string {
    return this.currentLanguage === 'ar' ? service.label_ar : service.label_en;
  }

  onServiceChange(event: any): void {
    if (this.selectedService) {
      this.serviceSelected.emit(this.selectedService);
    }
  }

  setLanguage(lang: string): void {
    this.currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
