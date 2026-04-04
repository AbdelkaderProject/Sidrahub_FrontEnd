# Services Dropdown Component

A bilingual (English/Arabic) dropdown component for selecting services in the SidraHub Business Platform.

## Features

✅ **Bilingual Support** - Full support for both English and Arabic  
✅ **RTL Support** - Right-to-Left direction for Arabic language  
✅ **Responsive Design** - Works on desktop and mobile devices  
✅ **PrimeNG Dropdown** - Built with PrimeNG's powerful dropdown component  
✅ **Search/Filter** - Searchable across both English and Arabic labels  
✅ **Event Emission** - Emits selected service to parent component  
✅ **Localized Services** - Pre-configured with all 5 services  

## Available Services

1. **Economic and Investment Consultations** (الاستشارات الاقتصادية والاستثمارية)
2. **Legal and Economic Consultations** (الاستشارات القانونية والاقتصادية)
3. **Accounting and Legal Consultations** (الاستشارات المحاسبية والقانونية)
4. **Referrals for Private Sector Health Reports - 3 Periods** (إحالات لتقرير فحص القطاع الخاص خلال 3 فترات)
5. **Arab Research Work and Comparative Studies for Companies** (عمل الأبحاث العربية والدراسات المقارنة للشركات)

## Usage

### Import the Component

```typescript
import { ServicesDropdownComponent } from './shared/services-dropdown/services-dropdown.component';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [ServicesDropdownComponent],
  template: `
    <app-services-dropdown 
      (serviceSelected)="onServiceSelected($event)">
    </app-services-dropdown>
  `
})
export class MyComponent {
  onServiceSelected(service: ServiceOption): void {
    console.log('Selected service:', service);
  }
}
```

### Handle Service Selection

```typescript
onServiceSelected(service: ServiceOption): void {
  console.log('Service ID:', service.id);
  console.log('English Label:', service.label_en);
  console.log('Arabic Label:', service.label_ar);
}
```

## Component API

### Input Properties
- None (uses default loaded services)

### Output Events
- `serviceSelected: EventEmitter<ServiceOption>` - Emitted when user selects a service

### Service Interface

```typescript
interface ServiceOption {
  id: string;
  label_en: string;
  label_ar: string;
}
```

## Styling

The component includes:
- Custom color scheme matching SidraHub branding (Orange #ff9900)
- Full RTL support for Arabic
- Responsive breakpoints for mobile devices
- Smooth animations and transitions
- Hover effects and focus states

## Language Management

The component automatically detects the page language from `document.documentElement.lang`:
- `'en'` for English
- `'ar'` for Arabic

Users can also toggle language using the language buttons in the component.

## CSS Variables (Optional Customization)

```scss
--primary-color: #ff9900;
--text-color: #333;
--border-color: #e0e0e0;
--hover-bg: #fff3e0;
--selected-bg: #ff9900;
```

## Dependencies

- `@angular/common` - CommonModule, NgIf, NgTemplate
- `@angular/forms` - FormsModule, ngModel
- `primeng/dropdown` - DropdownModule
- Standard Angular HttpClient (for future API integration)

## Notes

- The component currently uses hardcoded services but is prepared for API integration
- Uncomment the `loadServicesFromAPI()` method to fetch services from backend
- All translations are pre-loaded for optimal performance
