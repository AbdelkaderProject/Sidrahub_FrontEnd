import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgFor } from '@angular/common';

type Article = {
  title: string;
  image: string;
  category: string;
  date: string;
  description: string;
};

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [NgFor],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticlesComponent {
  readonly categories = [
    'استشارات قانونية',
    'استشارات مالية وضريبية',
    'خدمات التعقيب وحلول الأعمال',
    'تأسيس شركات'
  ];

  readonly articles: Article[] = [
    {
      title: 'تأسيس الشركات الناشئة في السعودية: خطوات وإجراءات ورأس المال المطلوب',
      image: 'https://picsum.photos/400/250?random=31',
      category: 'تأسيس شركات',
      date: '10 مارس 2025',
      description: 'تعرف على شروط تأسيس شركتك الناشئة في السعودية بخطوات واضحة وسهلة.'
    },
    {
      title: 'دليل شامل لتأسيس شركة في السعودية: أنواع الشركات والتراخيص المطلوبة',
      image: 'https://picsum.photos/400/250?random=32',
      category: 'تأسيس شركات',
      date: '12 مارس 2025',
      description: 'دليل عملي يشرح لك الأنواع القانونية للشركات والتراخيص الأساسية لبدء النشاط.'
    },
    {
      title: 'تأسيس الشركات في السعودية: أهم 10 أسئلة شائعة وإجاباتها',
      image: 'https://picsum.photos/400/250?random=33',
      category: 'تأسيس شركات',
      date: '14 مارس 2025',
      description: 'إجابات احترافية لأكثر الأسئلة الشائعة حول تأسيس الشركات في السعودية.'
    },
    {
      title: 'مبادرة التخفيف الجمركي خلال ساعتين في السعودية: خطوة نحو مركز لوجستي عالمي',
      image: 'https://picsum.photos/400/250?random=34',
      category: 'خدمات التعقيب وحلول الأعمال',
      date: '16 مارس 2025',
      description: 'كل ما تريد معرفته عن مبادرة التخليص الجمركي خلال ساعتين وآثارها على الأعمال.'
    },
    {
      title: 'أنواع الشركات في السعودية وفق النظام الجديد 2025: دليلك لتأسيس شركة قانونية 100%',
      image: 'https://picsum.photos/400/250?random=35',
      category: 'تأسيس شركات',
      date: '18 مارس 2025',
      description: 'قبل أن تؤسس عملك، تعرّف على أفضل أنواع الشركات السعودية وفق النظام الجديد.'
    },
    {
      title: 'الفرق بين المؤسسة والشركة وخطوات تأسيس شركة في السعودية',
      image: 'https://picsum.photos/400/250?random=36',
      category: 'تأسيس شركات',
      date: '20 مارس 2025',
      description: 'ما الفرق بين المؤسسة والشركة ومتى يناسبك كل نوع قبل بدء نشاطك التجاري؟'
    },
    {
      title: 'أفضل الطرق لتجنب تعقيدات منصة قوى في أعمالك',
      image: 'https://picsum.photos/400/250?random=37',
      category: 'خدمات التعقيب وحلول الأعمال',
      date: '22 مارس 2025',
      description: 'تجنب الأخطاء الشائعة في منصة قوى بخطوات عملية تساعدك على إنجاز كل خطوة.'
    },
    {
      title: 'كيف تؤسس براندك في السعودية؟ دليلك لفهم أنواع العلامات والإجراءات القانونية بالتفصيل',
      image: 'https://picsum.photos/400/250?random=38',
      category: 'تأسيس شركات',
      date: '24 مارس 2025',
      description: 'كيف تؤسس براندك في السعودية بشكل قانوني وتحمي هويتك التجارية من البداية.'
    },
    {
      title: 'تأسيس شركتك في السعودية خطوة بخطوة: أنواع وتفاصيل أسهم المستثمرين',
      image: 'https://picsum.photos/400/250?random=39',
      category: 'تأسيس شركات',
      date: '26 مارس 2025',
      description: 'أسس شركتك في السعودية بوضوح أكبر من خلال معرفة أنواع وتفاصيل أسهم المستثمرين.'
    },
    {
      title: 'تعرف على شروط وكيفية استخراج الإقامة المميزة في السعودية',
      image: 'https://picsum.photos/400/250?random=40',
      category: 'خدمات التعقيب وحلول الأعمال',
      date: '28 مارس 2025',
      description: 'شروط وخطوات استخراج الإقامة المميزة لأصحاب الأعمال والراغبين في الاستقرار.'
    },
    {
      title: 'ريادة أعمال: دليلك لفتح استشارة قانونية تفتح لك آفاق نجاح أعمالك',
      image: 'https://picsum.photos/400/250?random=41',
      category: 'خدمات التعقيب وحلول الأعمال',
      date: '30 مارس 2025',
      description: 'ابدأ الآن في بناء استشارة احترافية تمنحك ثقة أكبر في إدارة مشروعك التجاري.'
    }
  ];
}
