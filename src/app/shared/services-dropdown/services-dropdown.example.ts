import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesDropdownComponent } from '../services-dropdown/services-dropdown.component';

interface ServiceOption {
  id: string;
  label_en: string;
  label_ar: string;
}

@Component({
  selector: 'app-services-dropdown-example',
  standalone: true,
  imports: [CommonModule, ServicesDropdownComponent],
  template: `
    <div class="example-container">
      <h1>Services Selection Example</h1>
      
      <app-services-dropdown 
        (serviceSelected)="onServiceSelected($event)">
      </app-services-dropdown>

      <div *ngIf="submittedService" class="submission-result">
        <h2>Submitted Service Information</h2>
        <div class="info-card">
          <p><strong>ID:</strong> {{ submittedService.id }}</p>
          <p><strong>English:</strong> {{ submittedService.label_en }}</p>
          <p><strong>Arabic:</strong> {{ submittedService.label_ar }}</p>
          <p><strong>Selected at:</strong> {{ submissionTime | date:'medium' }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
      background: linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%);
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #ff9900;
      margin-bottom: 30px;
      text-align: center;
      font-size: 28px;
    }

    .submission-result {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #ff9900;
    }

    h2 {
      color: #333;
      font-size: 18px;
      margin-bottom: 15px;
    }

    .info-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #ff9900;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .info-card p {
      margin: 10px 0;
      font-size: 14px;
      color: #555;
      line-height: 1.6;
    }

    .info-card strong {
      color: #333;
      font-weight: 600;
    }
  `]
})
export class ServicesDropdownExampleComponent {
  submittedService: ServiceOption | null = null;
  submissionTime: Date | null = null;

  onServiceSelected(service: ServiceOption): void {
    this.submittedService = service;
    this.submissionTime = new Date();
    console.log('Service selected:', service);
  }
}
