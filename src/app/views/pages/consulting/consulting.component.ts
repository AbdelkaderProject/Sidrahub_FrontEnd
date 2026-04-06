import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

interface CountryOption {
  name: string;
  code: string;
  flagUrl: string;
}

interface ServiceOption {
  label: string;
  value: string;
}

interface CalendarDay {
  dayNumber: number;
  dayName: string;
  monthLabel: string;
  fullLabel: string;
  slots: string[];
}

@Component({
  selector: 'app-consulting',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './consulting.component.html',
  styleUrl: './consulting.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultingComponent {
  private readonly fb = inject(FormBuilder);

  readonly countries: CountryOption[] = [
    { name: 'أفغانستان', code: '+93', flagUrl: 'https://flagcdn.com/w40/af.png' },
    { name: 'ألبانيا', code: '+355', flagUrl: 'https://flagcdn.com/w40/al.png' },
    { name: 'الجزائر', code: '+213', flagUrl: 'https://flagcdn.com/w40/dz.png' },
    { name: 'أندورا', code: '+376', flagUrl: 'https://flagcdn.com/w40/ad.png' },
    { name: 'أنغولا', code: '+244', flagUrl: 'https://flagcdn.com/w40/ao.png' },
    { name: 'أنتيغوا وبربودا', code: '+1-268', flagUrl: 'https://flagcdn.com/w40/ag.png' },
    { name: 'الأرجنتين', code: '+54', flagUrl: 'https://flagcdn.com/w40/ar.png' },
    { name: 'أرمينيا', code: '+374', flagUrl: 'https://flagcdn.com/w40/am.png' },
    { name: 'أستراليا', code: '+61', flagUrl: 'https://flagcdn.com/w40/au.png' },
    { name: 'النمسا', code: '+43', flagUrl: 'https://flagcdn.com/w40/at.png' },
    { name: 'أذربيجان', code: '+994', flagUrl: 'https://flagcdn.com/w40/az.png' },
    { name: 'جزر البهاما', code: '+1-242', flagUrl: 'https://flagcdn.com/w40/bs.png' },
    { name: 'البحرين', code: '+973', flagUrl: 'https://flagcdn.com/w40/bh.png' },
    { name: 'بنغلاديش', code: '+880', flagUrl: 'https://flagcdn.com/w40/bd.png' },
    { name: 'بربادوس', code: '+1-246', flagUrl: 'https://flagcdn.com/w40/bb.png' },
    { name: 'بيلاروسيا', code: '+375', flagUrl: 'https://flagcdn.com/w40/by.png' },
    { name: 'بلجيكا', code: '+32', flagUrl: 'https://flagcdn.com/w40/be.png' },
    { name: 'بليز', code: '+501', flagUrl: 'https://flagcdn.com/w40/bz.png' },
    { name: 'بنين', code: '+229', flagUrl: 'https://flagcdn.com/w40/bj.png' },
    { name: 'بوتان', code: '+975', flagUrl: 'https://flagcdn.com/w40/bt.png' },
    { name: 'بوليفيا', code: '+591', flagUrl: 'https://flagcdn.com/w40/bo.png' },
    { name: 'البوسنة والهرسك', code: '+387', flagUrl: 'https://flagcdn.com/w40/ba.png' },
    { name: 'بوتسوانا', code: '+267', flagUrl: 'https://flagcdn.com/w40/bw.png' },
    { name: 'البرازيل', code: '+55', flagUrl: 'https://flagcdn.com/w40/br.png' },
    { name: 'بروناي', code: '+673', flagUrl: 'https://flagcdn.com/w40/bn.png' },
    { name: 'بلغاريا', code: '+359', flagUrl: 'https://flagcdn.com/w40/bg.png' },
    { name: 'بوركينا فاسو', code: '+226', flagUrl: 'https://flagcdn.com/w40/bf.png' },
    { name: 'بوروندي', code: '+257', flagUrl: 'https://flagcdn.com/w40/bi.png' },
    { name: 'الرأس الأخضر', code: '+238', flagUrl: 'https://flagcdn.com/w40/cv.png' },
    { name: 'كمبوديا', code: '+855', flagUrl: 'https://flagcdn.com/w40/kh.png' },
    { name: 'الكاميرون', code: '+237', flagUrl: 'https://flagcdn.com/w40/cm.png' },
    { name: 'كندا', code: '+1', flagUrl: 'https://flagcdn.com/w40/ca.png' },
    { name: 'جمهورية أفريقيا الوسطى', code: '+236', flagUrl: 'https://flagcdn.com/w40/cf.png' },
    { name: 'تشاد', code: '+235', flagUrl: 'https://flagcdn.com/w40/td.png' },
    { name: 'تشيلي', code: '+56', flagUrl: 'https://flagcdn.com/w40/cl.png' },
    { name: 'الصين', code: '+86', flagUrl: 'https://flagcdn.com/w40/cn.png' },
    { name: 'كولومبيا', code: '+57', flagUrl: 'https://flagcdn.com/w40/co.png' },
    { name: 'جزر القمر', code: '+269', flagUrl: 'https://flagcdn.com/w40/km.png' },
    { name: 'جمهورية الكونغو', code: '+242', flagUrl: 'https://flagcdn.com/w40/cg.png' },
    { name: 'جمهورية الكونغو الديمقراطية', code: '+243', flagUrl: 'https://flagcdn.com/w40/cd.png' },
    { name: 'كوستاريكا', code: '+506', flagUrl: 'https://flagcdn.com/w40/cr.png' },
    { name: 'كوت ديفوار', code: '+225', flagUrl: 'https://flagcdn.com/w40/ci.png' },
    { name: 'كرواتيا', code: '+385', flagUrl: 'https://flagcdn.com/w40/hr.png' },
    { name: 'كوبا', code: '+53', flagUrl: 'https://flagcdn.com/w40/cu.png' },
    { name: 'قبرص', code: '+357', flagUrl: 'https://flagcdn.com/w40/cy.png' },
    { name: 'التشيك', code: '+420', flagUrl: 'https://flagcdn.com/w40/cz.png' },
    { name: 'الدنمارك', code: '+45', flagUrl: 'https://flagcdn.com/w40/dk.png' },
    { name: 'جيبوتي', code: '+253', flagUrl: 'https://flagcdn.com/w40/dj.png' },
    { name: 'دومينيكا', code: '+1-767', flagUrl: 'https://flagcdn.com/w40/dm.png' },
    { name: 'جمهورية الدومينيكان', code: '+1-809', flagUrl: 'https://flagcdn.com/w40/do.png' },
    { name: 'الإكوادور', code: '+593', flagUrl: 'https://flagcdn.com/w40/ec.png' },
    { name: 'مصر', code: '+20', flagUrl: 'https://flagcdn.com/w40/eg.png' },
    { name: 'السلفادور', code: '+503', flagUrl: 'https://flagcdn.com/w40/sv.png' },
    { name: 'غينيا الاستوائية', code: '+240', flagUrl: 'https://flagcdn.com/w40/gq.png' },
    { name: 'إريتريا', code: '+291', flagUrl: 'https://flagcdn.com/w40/er.png' },
    { name: 'إستونيا', code: '+372', flagUrl: 'https://flagcdn.com/w40/ee.png' },
    { name: 'إسواتيني', code: '+268', flagUrl: 'https://flagcdn.com/w40/sz.png' },
    { name: 'إثيوبيا', code: '+251', flagUrl: 'https://flagcdn.com/w40/et.png' },
    { name: 'فيجي', code: '+679', flagUrl: 'https://flagcdn.com/w40/fj.png' },
    { name: 'فنلندا', code: '+358', flagUrl: 'https://flagcdn.com/w40/fi.png' },
    { name: 'فرنسا', code: '+33', flagUrl: 'https://flagcdn.com/w40/fr.png' },
    { name: 'الغابون', code: '+241', flagUrl: 'https://flagcdn.com/w40/ga.png' },
    { name: 'غامبيا', code: '+220', flagUrl: 'https://flagcdn.com/w40/gm.png' },
    { name: 'جورجيا', code: '+995', flagUrl: 'https://flagcdn.com/w40/ge.png' },
    { name: 'ألمانيا', code: '+49', flagUrl: 'https://flagcdn.com/w40/de.png' },
    { name: 'غانا', code: '+233', flagUrl: 'https://flagcdn.com/w40/gh.png' },
    { name: 'اليونان', code: '+30', flagUrl: 'https://flagcdn.com/w40/gr.png' },
    { name: 'غرينادا', code: '+1-473', flagUrl: 'https://flagcdn.com/w40/gd.png' },
    { name: 'غواتيمالا', code: '+502', flagUrl: 'https://flagcdn.com/w40/gt.png' },
    { name: 'غينيا', code: '+224', flagUrl: 'https://flagcdn.com/w40/gn.png' },
    { name: 'غينيا بيساو', code: '+245', flagUrl: 'https://flagcdn.com/w40/gw.png' },
    { name: 'غيانا', code: '+592', flagUrl: 'https://flagcdn.com/w40/gy.png' },
    { name: 'هايتي', code: '+509', flagUrl: 'https://flagcdn.com/w40/ht.png' },
    { name: 'هندوراس', code: '+504', flagUrl: 'https://flagcdn.com/w40/hn.png' },
    { name: 'المجر', code: '+36', flagUrl: 'https://flagcdn.com/w40/hu.png' },
    { name: 'آيسلندا', code: '+354', flagUrl: 'https://flagcdn.com/w40/is.png' },
    { name: 'الهند', code: '+91', flagUrl: 'https://flagcdn.com/w40/in.png' },
    { name: 'إندونيسيا', code: '+62', flagUrl: 'https://flagcdn.com/w40/id.png' },
    { name: 'إيران', code: '+98', flagUrl: 'https://flagcdn.com/w40/ir.png' },
    { name: 'العراق', code: '+964', flagUrl: 'https://flagcdn.com/w40/iq.png' },
    { name: 'أيرلندا', code: '+353', flagUrl: 'https://flagcdn.com/w40/ie.png' },
    { name: 'إيطاليا', code: '+39', flagUrl: 'https://flagcdn.com/w40/it.png' },
    { name: 'جامايكا', code: '+1-876', flagUrl: 'https://flagcdn.com/w40/jm.png' },
    { name: 'اليابان', code: '+81', flagUrl: 'https://flagcdn.com/w40/jp.png' },
    { name: 'الأردن', code: '+962', flagUrl: 'https://flagcdn.com/w40/jo.png' },
    { name: 'كازاخستان', code: '+7', flagUrl: 'https://flagcdn.com/w40/kz.png' },
    { name: 'كينيا', code: '+254', flagUrl: 'https://flagcdn.com/w40/ke.png' },
    { name: 'كيريباتي', code: '+686', flagUrl: 'https://flagcdn.com/w40/ki.png' },
    { name: 'كوريا الشمالية', code: '+850', flagUrl: 'https://flagcdn.com/w40/kp.png' },
    { name: 'كوريا الجنوبية', code: '+82', flagUrl: 'https://flagcdn.com/w40/kr.png' },
    { name: 'الكويت', code: '+965', flagUrl: 'https://flagcdn.com/w40/kw.png' },
    { name: 'قرغيزستان', code: '+996', flagUrl: 'https://flagcdn.com/w40/kg.png' },
    { name: 'لاوس', code: '+856', flagUrl: 'https://flagcdn.com/w40/la.png' },
    { name: 'لاتفيا', code: '+371', flagUrl: 'https://flagcdn.com/w40/lv.png' },
    { name: 'لبنان', code: '+961', flagUrl: 'https://flagcdn.com/w40/lb.png' },
    { name: 'ليسوتو', code: '+266', flagUrl: 'https://flagcdn.com/w40/ls.png' },
    { name: 'ليبيريا', code: '+231', flagUrl: 'https://flagcdn.com/w40/lr.png' },
    { name: 'ليبيا', code: '+218', flagUrl: 'https://flagcdn.com/w40/ly.png' },
    { name: 'ليختنشتاين', code: '+423', flagUrl: 'https://flagcdn.com/w40/li.png' },
    { name: 'ليتوانيا', code: '+370', flagUrl: 'https://flagcdn.com/w40/lt.png' },
    { name: 'لوكسمبورغ', code: '+352', flagUrl: 'https://flagcdn.com/w40/lu.png' },
    { name: 'مدغشقر', code: '+261', flagUrl: 'https://flagcdn.com/w40/mg.png' },
    { name: 'مالاوي', code: '+265', flagUrl: 'https://flagcdn.com/w40/mw.png' },
    { name: 'ماليزيا', code: '+60', flagUrl: 'https://flagcdn.com/w40/my.png' },
    { name: 'المالديف', code: '+960', flagUrl: 'https://flagcdn.com/w40/mv.png' },
    { name: 'مالي', code: '+223', flagUrl: 'https://flagcdn.com/w40/ml.png' },
    { name: 'مالطا', code: '+356', flagUrl: 'https://flagcdn.com/w40/mt.png' },
    { name: 'جزر مارشال', code: '+692', flagUrl: 'https://flagcdn.com/w40/mh.png' },
    { name: 'موريتانيا', code: '+222', flagUrl: 'https://flagcdn.com/w40/mr.png' },
    { name: 'موريشيوس', code: '+230', flagUrl: 'https://flagcdn.com/w40/mu.png' },
    { name: 'المكسيك', code: '+52', flagUrl: 'https://flagcdn.com/w40/mx.png' },
    { name: 'ميكرونيزيا', code: '+691', flagUrl: 'https://flagcdn.com/w40/fm.png' },
    { name: 'مولدوفا', code: '+373', flagUrl: 'https://flagcdn.com/w40/md.png' },
    { name: 'موناكو', code: '+377', flagUrl: 'https://flagcdn.com/w40/mc.png' },
    { name: 'منغوليا', code: '+976', flagUrl: 'https://flagcdn.com/w40/mn.png' },
    { name: 'الجبل الأسود', code: '+382', flagUrl: 'https://flagcdn.com/w40/me.png' },
    { name: 'المغرب', code: '+212', flagUrl: 'https://flagcdn.com/w40/ma.png' },
    { name: 'موزمبيق', code: '+258', flagUrl: 'https://flagcdn.com/w40/mz.png' },
    { name: 'ميانمار', code: '+95', flagUrl: 'https://flagcdn.com/w40/mm.png' },
    { name: 'ناميبيا', code: '+264', flagUrl: 'https://flagcdn.com/w40/na.png' },
    { name: 'ناورو', code: '+674', flagUrl: 'https://flagcdn.com/w40/nr.png' },
    { name: 'نيبال', code: '+977', flagUrl: 'https://flagcdn.com/w40/np.png' },
    { name: 'هولندا', code: '+31', flagUrl: 'https://flagcdn.com/w40/nl.png' },
    { name: 'نيوزيلندا', code: '+64', flagUrl: 'https://flagcdn.com/w40/nz.png' },
    { name: 'نيكاراغوا', code: '+505', flagUrl: 'https://flagcdn.com/w40/ni.png' },
    { name: 'النيجر', code: '+227', flagUrl: 'https://flagcdn.com/w40/ne.png' },
    { name: 'نيجيريا', code: '+234', flagUrl: 'https://flagcdn.com/w40/ng.png' },
    { name: 'مقدونيا الشمالية', code: '+389', flagUrl: 'https://flagcdn.com/w40/mk.png' },
    { name: 'النرويج', code: '+47', flagUrl: 'https://flagcdn.com/w40/no.png' },
    { name: 'عمان', code: '+968', flagUrl: 'https://flagcdn.com/w40/om.png' },
    { name: 'باكستان', code: '+92', flagUrl: 'https://flagcdn.com/w40/pk.png' },
    { name: 'بالاو', code: '+680', flagUrl: 'https://flagcdn.com/w40/pw.png' },
    { name: 'فلسطين', code: '+970', flagUrl: 'https://flagcdn.com/w40/ps.png' },
    { name: 'بنما', code: '+507', flagUrl: 'https://flagcdn.com/w40/pa.png' },
    { name: 'بابوا غينيا الجديدة', code: '+675', flagUrl: 'https://flagcdn.com/w40/pg.png' },
    { name: 'باراغواي', code: '+595', flagUrl: 'https://flagcdn.com/w40/py.png' },
    { name: 'بيرو', code: '+51', flagUrl: 'https://flagcdn.com/w40/pe.png' },
    { name: 'الفلبين', code: '+63', flagUrl: 'https://flagcdn.com/w40/ph.png' },
    { name: 'بولندا', code: '+48', flagUrl: 'https://flagcdn.com/w40/pl.png' },
    { name: 'البرتغال', code: '+351', flagUrl: 'https://flagcdn.com/w40/pt.png' },
    { name: 'قطر', code: '+974', flagUrl: 'https://flagcdn.com/w40/qa.png' },
    { name: 'رومانيا', code: '+40', flagUrl: 'https://flagcdn.com/w40/ro.png' },
    { name: 'روسيا', code: '+7', flagUrl: 'https://flagcdn.com/w40/ru.png' },
    { name: 'رواندا', code: '+250', flagUrl: 'https://flagcdn.com/w40/rw.png' },
    { name: 'سانت كيتس ونيفيس', code: '+1-869', flagUrl: 'https://flagcdn.com/w40/kn.png' },
    { name: 'سانت لوسيا', code: '+1-758', flagUrl: 'https://flagcdn.com/w40/lc.png' },
    { name: 'سانت فنسنت والغرينادين', code: '+1-784', flagUrl: 'https://flagcdn.com/w40/vc.png' },
    { name: 'ساموا', code: '+685', flagUrl: 'https://flagcdn.com/w40/ws.png' },
    { name: 'سان مارينو', code: '+378', flagUrl: 'https://flagcdn.com/w40/sm.png' },
    { name: 'ساو تومي وبرينسيبي', code: '+239', flagUrl: 'https://flagcdn.com/w40/st.png' },
    { name: 'السعودية', code: '+966', flagUrl: 'https://flagcdn.com/w40/sa.png' },
    { name: 'السنغال', code: '+221', flagUrl: 'https://flagcdn.com/w40/sn.png' },
    { name: 'صربيا', code: '+381', flagUrl: 'https://flagcdn.com/w40/rs.png' },
    { name: 'سيشل', code: '+248', flagUrl: 'https://flagcdn.com/w40/sc.png' },
    { name: 'سيراليون', code: '+232', flagUrl: 'https://flagcdn.com/w40/sl.png' },
    { name: 'سنغافورة', code: '+65', flagUrl: 'https://flagcdn.com/w40/sg.png' },
    { name: 'سلوفاكيا', code: '+421', flagUrl: 'https://flagcdn.com/w40/sk.png' },
    { name: 'سلوفينيا', code: '+386', flagUrl: 'https://flagcdn.com/w40/si.png' },
    { name: 'جزر سليمان', code: '+677', flagUrl: 'https://flagcdn.com/w40/sb.png' },
    { name: 'الصومال', code: '+252', flagUrl: 'https://flagcdn.com/w40/so.png' },
    { name: 'جنوب أفريقيا', code: '+27', flagUrl: 'https://flagcdn.com/w40/za.png' },
    { name: 'جنوب السودان', code: '+211', flagUrl: 'https://flagcdn.com/w40/ss.png' },
    { name: 'إسبانيا', code: '+34', flagUrl: 'https://flagcdn.com/w40/es.png' },
    { name: 'سريلانكا', code: '+94', flagUrl: 'https://flagcdn.com/w40/lk.png' },
    { name: 'السودان', code: '+249', flagUrl: 'https://flagcdn.com/w40/sd.png' },
    { name: 'سورينام', code: '+597', flagUrl: 'https://flagcdn.com/w40/sr.png' },
    { name: 'السويد', code: '+46', flagUrl: 'https://flagcdn.com/w40/se.png' },
    { name: 'سويسرا', code: '+41', flagUrl: 'https://flagcdn.com/w40/ch.png' },
    { name: 'سوريا', code: '+963', flagUrl: 'https://flagcdn.com/w40/sy.png' },
    { name: 'تايوان', code: '+886', flagUrl: 'https://flagcdn.com/w40/tw.png' },
    { name: 'طاجيكستان', code: '+992', flagUrl: 'https://flagcdn.com/w40/tj.png' },
    { name: 'تنزانيا', code: '+255', flagUrl: 'https://flagcdn.com/w40/tz.png' },
    { name: 'تايلاند', code: '+66', flagUrl: 'https://flagcdn.com/w40/th.png' },
    { name: 'تيمور الشرقية', code: '+670', flagUrl: 'https://flagcdn.com/w40/tl.png' },
    { name: 'توغو', code: '+228', flagUrl: 'https://flagcdn.com/w40/tg.png' },
    { name: 'تونغا', code: '+676', flagUrl: 'https://flagcdn.com/w40/to.png' },
    { name: 'ترينيداد وتوباغو', code: '+1-868', flagUrl: 'https://flagcdn.com/w40/tt.png' },
    { name: 'تونس', code: '+216', flagUrl: 'https://flagcdn.com/w40/tn.png' },
    { name: 'تركيا', code: '+90', flagUrl: 'https://flagcdn.com/w40/tr.png' },
    { name: 'تركمانستان', code: '+993', flagUrl: 'https://flagcdn.com/w40/tm.png' },
    { name: 'توفالو', code: '+688', flagUrl: 'https://flagcdn.com/w40/tv.png' },
    { name: 'أوغندا', code: '+256', flagUrl: 'https://flagcdn.com/w40/ug.png' },
    { name: 'أوكرانيا', code: '+380', flagUrl: 'https://flagcdn.com/w40/ua.png' },
    { name: 'الإمارات العربية المتحدة', code: '+971', flagUrl: 'https://flagcdn.com/w40/ae.png' },
    { name: 'المملكة المتحدة', code: '+44', flagUrl: 'https://flagcdn.com/w40/gb.png' },
    { name: 'الولايات المتحدة', code: '+1', flagUrl: 'https://flagcdn.com/w40/us.png' },
    { name: 'أوروغواي', code: '+598', flagUrl: 'https://flagcdn.com/w40/uy.png' },
    { name: 'أوزبكستان', code: '+998', flagUrl: 'https://flagcdn.com/w40/uz.png' },
    { name: 'فانواتو', code: '+678', flagUrl: 'https://flagcdn.com/w40/vu.png' },
    { name: 'الفاتيكان', code: '+379', flagUrl: 'https://flagcdn.com/w40/va.png' },
    { name: 'فنزويلا', code: '+58', flagUrl: 'https://flagcdn.com/w40/ve.png' },
    { name: 'فيتنام', code: '+84', flagUrl: 'https://flagcdn.com/w40/vn.png' },
    { name: 'اليمن', code: '+967', flagUrl: 'https://flagcdn.com/w40/ye.png' },
    { name: 'زامبيا', code: '+260', flagUrl: 'https://flagcdn.com/w40/zm.png' },
    { name: 'زيمبابوي', code: '+263', flagUrl: 'https://flagcdn.com/w40/zw.png' }
  ];

  readonly services: ServiceOption[] = [
    { label: 'اختر الخدمة المناسبة', value: '' },
    { label: 'استشارات قانونية', value: 'legal' },
    { label: 'استشارات مالية وضريبية', value: 'finance' },
    { label: 'خدمات التعقيب وحلول الأعمال', value: 'business' },
    { label: 'تأسيس شركات', value: 'company-setup' }
  ];

  readonly scheduleDays: CalendarDay[] = [
    {
      dayNumber: 6,
      dayName: 'الأحد',
      monthLabel: 'أبريل',
      fullLabel: 'الأحد 6 أبريل 2026',
      slots: ['11:00 ص', '12:30 م', '02:00 م', '03:30 م', '05:00 م']
    },
    {
      dayNumber: 7,
      dayName: 'الإثنين',
      monthLabel: 'أبريل',
      fullLabel: 'الإثنين 7 أبريل 2026',
      slots: ['10:30 ص', '12:00 م', '01:30 م', '03:00 م', '04:30 م']
    },
    {
      dayNumber: 8,
      dayName: 'الثلاثاء',
      monthLabel: 'أبريل',
      fullLabel: 'الثلاثاء 8 أبريل 2026',
      slots: ['09:30 ص', '11:00 ص', '12:30 م', '02:00 م', '03:30 م']
    },
    {
      dayNumber: 9,
      dayName: 'الأربعاء',
      monthLabel: 'أبريل',
      fullLabel: 'الأربعاء 9 أبريل 2026',
      slots: ['10:00 ص', '11:30 ص', '01:00 م', '02:30 م', '04:00 م']
    },
    {
      dayNumber: 13,
      dayName: 'الأحد',
      monthLabel: 'أبريل',
      fullLabel: 'الأحد 13 أبريل 2026',
      slots: ['11:00 ص', '12:30 م', '02:00 م', '03:30 م']
    },
    {
      dayNumber: 14,
      dayName: 'الإثنين',
      monthLabel: 'أبريل',
      fullLabel: 'الإثنين 14 أبريل 2026',
      slots: ['10:30 ص', '12:00 م', '01:30 م', '03:00 م']
    },
    {
      dayNumber: 15,
      dayName: 'الثلاثاء',
      monthLabel: 'أبريل',
      fullLabel: 'الثلاثاء 15 أبريل 2026',
      slots: ['09:30 ص', '11:00 ص', '12:30 م', '02:00 م']
    },
    {
      dayNumber: 16,
      dayName: 'الأربعاء',
      monthLabel: 'أبريل',
      fullLabel: 'الأربعاء 16 أبريل 2026',
      slots: ['10:00 ص', '11:30 ص', '01:00 م', '02:30 م']
    },
    {
      dayNumber: 20,
      dayName: 'الأحد',
      monthLabel: 'أبريل',
      fullLabel: 'الأحد 20 أبريل 2026',
      slots: ['11:00 ص', '12:30 م', '02:00 م', '03:30 م']
    },
    {
      dayNumber: 21,
      dayName: 'الإثنين',
      monthLabel: 'أبريل',
      fullLabel: 'الإثنين 21 أبريل 2026',
      slots: ['10:30 ص', '12:00 م', '01:30 م', '03:00 م']
    },
    {
      dayNumber: 22,
      dayName: 'الثلاثاء',
      monthLabel: 'أبريل',
      fullLabel: 'الثلاثاء 22 أبريل 2026',
      slots: ['09:30 ص', '11:00 ص', '12:30 م', '02:00 م']
    },
    {
      dayNumber: 23,
      dayName: 'الأربعاء',
      monthLabel: 'أبريل',
      fullLabel: 'الأربعاء 23 أبريل 2026',
      slots: ['10:00 ص', '11:30 ص', '01:00 م', '02:30 م']
    },
    {
      dayNumber: 27,
      dayName: 'الأحد',
      monthLabel: 'أبريل',
      fullLabel: 'الأحد 27 أبريل 2026',
      slots: ['11:00 ص', '12:30 م', '02:00 م']
    },
    {
      dayNumber: 28,
      dayName: 'الإثنين',
      monthLabel: 'أبريل',
      fullLabel: 'الإثنين 28 أبريل 2026',
      slots: ['10:30 ص', '12:00 م', '01:30 م']
    },
    {
      dayNumber: 29,
      dayName: 'الثلاثاء',
      monthLabel: 'أبريل',
      fullLabel: 'الثلاثاء 29 أبريل 2026',
      slots: ['09:30 ص', '11:00 ص', '12:30 م']
    },
    {
      dayNumber: 30,
      dayName: 'الأربعاء',
      monthLabel: 'أبريل',
      fullLabel: 'الأربعاء 30 أبريل 2026',
      slots: ['10:00 ص', '11:30 ص', '01:00 م']
    }
  ];

  readonly calendarRows = [
    [0, 0, 0, 0, 0, 0, 6],
    [7, 8, 9, 0, 0, 0, 13],
    [14, 15, 16, 0, 0, 0, 20],
    [21, 22, 23, 0, 0, 0, 27],
    [28, 29, 30, 0, 0, 0, 0]
  ];

  readonly weekDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  readonly selectedCountry = signal<CountryOption>(this.countries[0]);
  readonly isCountryDropdownOpen = signal(false);
  readonly currentStep = signal<1 | 2>(1);
  readonly selectedDate = signal<CalendarDay>(this.scheduleDays[0]);
  readonly selectedTime = signal(this.scheduleDays[0].slots[0]);
  readonly isConfirmationOpen = signal(false);

  readonly consultingForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    service: ['', Validators.required],
    message: ['', Validators.required]
  });

  readonly selectedServiceLabel = computed(() => {
    const selectedValue = this.consultingForm.controls.service.value;
    return this.services.find(service => service.value === selectedValue)?.label ?? 'استشارة مجانية';
  });

  readonly customerPhone = computed(() => `${this.selectedCountry().code} ${this.consultingForm.controls.phone.value ?? ''}`.trim());

  toggleCountryDropdown(): void {
    this.isCountryDropdownOpen.update(value => !value);
  }

  selectCountry(country: CountryOption): void {
    this.selectedCountry.set(country);
    this.isCountryDropdownOpen.set(false);
  }

  goToSchedule(): void {
    this.consultingForm.markAllAsTouched();
    if (this.consultingForm.invalid) {
      return;
    }
    this.currentStep.set(2);
  }

  goBackToForm(): void {
    this.currentStep.set(1);
  }

  selectDate(day: CalendarDay): void {
    this.selectedDate.set(day);
    this.selectedTime.set(day.slots[0]);
  }

  selectTime(slot: string): void {
    this.selectedTime.set(slot);
  }

  confirmBooking(): void {
    if (!this.selectedTime()) {
      return;
    }
    this.isConfirmationOpen.set(true);
  }

  closeConfirmation(): void {
    this.isConfirmationOpen.set(false);
  }

  finishBooking(): void {
    this.isConfirmationOpen.set(false);
    this.currentStep.set(1);
    this.consultingForm.reset();
    this.selectedCountry.set(this.countries[0]);
    this.selectedDate.set(this.scheduleDays[0]);
    this.selectedTime.set(this.scheduleDays[0].slots[0]);
  }

  getDay(dayNumber: number): CalendarDay | undefined {
    return this.scheduleDays.find(day => day.dayNumber === dayNumber);
  }

  hasError(controlName: 'name' | 'phone' | 'email' | 'service' | 'message'): boolean {
    const control = this.consultingForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-select')) {
      this.isCountryDropdownOpen.set(false);
    }
    if (this.isConfirmationOpen() && target.classList.contains('booking-modal')) {
      this.isConfirmationOpen.set(false);
    }
  }
}
