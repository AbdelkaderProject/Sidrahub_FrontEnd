import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

import { PublicCatalogService, ServiceDto } from '../../services/public-catalog.service';

@Component({
  selector: 'app-services-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
  templateUrl: './services-dropdown.component.html',
  styleUrls: ['./services-dropdown.component.scss']
})
export class ServicesDropdownComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly publicCatalogService = inject(PublicCatalogService);

  @Output() serviceSelected = new EventEmitter<ServiceDto>();

  selectedService: ServiceDto | null = null;
  services: ServiceDto[] = [];
  isLoading = false;
  currentLanguage = 'en';

  ngOnInit(): void {
    this.loadServices();
    this.detectLanguage();
  }

  private loadServices(): void {
    this.isLoading = true;
    this.publicCatalogService.services$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (services) => {
          this.services = services;
          this.isLoading = false;
        },
        error: () => {
          this.services = [];
          this.isLoading = false;
        }
      });
  }

  private detectLanguage(): void {
    const htmlLang = document.documentElement.lang;
    this.currentLanguage = htmlLang === 'ar' ? 'ar' : 'en';
  }

  getServiceLabel(service: ServiceDto): string {
    return this.currentLanguage === 'ar' ? service.nameAr : service.nameEn;
  }

  onServiceChange(): void {
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
