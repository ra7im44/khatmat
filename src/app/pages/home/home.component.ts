import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';
import { CreateKhatmaModalComponent } from '../../components/create-khatma-modal/create-khatma-modal.component';
import { KhatmaCardComponent } from '../../components/khatma-card/khatma-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CreateKhatmaModalComponent, KhatmaCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private khatmaService = inject(KhatmaService);
  private router = inject(Router);

  searchQuery = signal('');
  showCreateModal = signal(false);
  currentYear = new Date().getFullYear();

  steps = [
    { num: '١', title: 'أنشئ الختمة', desc: 'أدخل اسم المتوفى وأنشئ ختمة مقسمة إلى 30 جزءاً بثوانٍ معدودة وبخطوة واحدة.' },
    { num: '٢', title: 'شارك الرابط', desc: 'انسخ رابط الختمة وأرسله لعائلتك وأصدقائك عبر الواتساب للمشاركة في التلاوة.' },
    { num: '٣', title: 'يصل الأجر', desc: 'يتشارك الجميع قراءة الأجزاء ليتموا الختمة ويهدوا ثوابها، ويبقى لك أجر الدلالة.' },
  ];

  statsData = computed(() => {
    const khatmas = this.khatmaService.khatmas();
    const totalKhatmas = khatmas.length;
    const totalCompleted = khatmas.reduce((s, k) => s + k.parts.filter(p => p.status === 'completed').length, 0);
    const participants = new Set<string>();
    khatmas.forEach(k => k.parts.forEach(p => {
        if (p.completedBy) participants.add(p.completedBy);
        if (p.reservedBy) participants.add(p.reservedBy);
    }));

    const totalParticipants = participants.size;

    return [
      { value: totalKhatmas, label: 'ختمة جارية', color: 'text-primary', delay: '0ms' },
      { value: totalCompleted, label: 'جزء مقروء', color: 'text-txt', delay: '100ms' },
      { value: totalParticipants, label: 'مشارك بالأجر', color: 'text-accent', delay: '200ms' },
    ];
  });

  hasNoKhatmas = computed(() => this.khatmaService.khatmas().length === 0);

  filteredKhatmas = computed(() => {
    const all = this.khatmaService.khatmas();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return all;
    return all.filter(k => 
      k.title.toLowerCase().includes(query) || 
      (k.deceasedName && k.deceasedName.toLowerCase().includes(query)) || 
      k.createdBy.toLowerCase().includes(query)
    );
  });

  onKhatmaCreated(id: string) {
    this.router.navigate(['/khatmat', id]);
  }
}
