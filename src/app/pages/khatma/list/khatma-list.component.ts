import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KhatmaService } from '../../../services/khatma.service';

@Component({
  selector: 'app-khatma-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="animate-fade-up flex flex-col md:flex-row justify-between items-start md:items-center gap-5 mb-12">
        <div>
          <h1 class="text-2xl md:text-3xl font-black text-txt mb-1.5">الختمات الجارية</h1>
          <p class="text-txt-muted text-sm">تابع ختماتك وشارك في ختمات الآخرين</p>
        </div>
        <button (click)="showCreateModal = true" class="group flex items-center gap-2.5 px-7 py-3.5 bg-primary hover:bg-primary-hover text-primary-text font-bold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25">
          <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          ختمة جديدة
        </button>
      </div>

      <!-- Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        @for (khatma of khatmaService.khatmas(); track khatma.id; let i = $index) {
          <div class="card-lift group bg-surface-el rounded-2xl border border-brd overflow-hidden">
            <div class="h-1 bg-brd"><div class="h-full bg-gradient-to-l from-primary to-accent transition-all duration-700" [style.width.%]="khatma.progress"></div></div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 min-w-0">
                  <a [routerLink]="['/khatmat', khatma.id]" class="text-base font-bold text-txt group-hover:text-link transition-colors block truncate">{{khatma.title}}</a>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-[11px] text-txt-muted flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg> {{khatma.createdBy}}</span>
                    @if (khatma.deceasedName) {<span class="text-[11px] text-warn flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg> {{khatma.deceasedName}}</span>}
                  </div>
                </div>
                <div class="flex-shrink-0 mr-3 w-12 h-12 rounded-2xl bg-primary/[0.07] flex flex-col items-center justify-center"><span class="text-base font-black text-primary leading-none">{{khatma.progress}}</span><span class="text-[8px] text-primary/60 font-bold">%</span></div>
              </div>

              <div class="flex items-center justify-between text-[11px] text-txt-muted mb-5">
                <span class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> {{getCompletedCount(khatma)}} / 30 جزء</span>
                <span class="px-2.5 py-0.5 rounded-md text-[10px] font-bold" [class]="khatma.progress === 100 ? 'bg-ok/10 text-ok' : 'bg-primary/[0.07] text-primary'">{{khatma.progress === 100 ? 'مكتملة' : 'جارية'}}</span>
              </div>

              <a [routerLink]="['/khatmat', khatma.id]" class="flex items-center justify-center gap-2 w-full py-3 bg-primary hover:bg-primary-hover text-primary-text font-bold rounded-xl text-sm transition-all hover:shadow-md hover:shadow-primary/15">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                عرض التفاصيل
              </a>
            </div>
          </div>
        }
      </div>

      @if (khatmaService.khatmas().length === 0) {
        <div class="text-center py-20 bg-surface-el rounded-3xl border-2 border-dashed border-brd">
          <div class="w-16 h-16 bg-primary/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-5 animate-float-slow"><svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
          <h3 class="text-lg font-bold text-txt mb-2">لا توجد ختمات</h3>
          <p class="text-txt-muted text-sm mb-6">ابدأ أول ختمة لك الآن</p>
          <button (click)="showCreateModal = true" class="px-6 py-3 bg-primary text-primary-text font-bold rounded-xl text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/15">إنشاء ختمة</button>
        </div>
      }
    </div>

    <!-- Create Modal -->
    @if (showCreateModal) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="showCreateModal=false">
        <div class="animate-scale-in bg-surface-el rounded-3xl w-full max-w-md p-8 shadow-2xl border border-brd" (click)="$event.stopPropagation()">
          <div class="text-center mb-6">
            <div class="w-14 h-14 bg-primary/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg></div>
            <h3 class="text-lg font-bold text-txt">أنشئ ختمة جديدة</h3>
            <p class="text-[11px] text-txt-muted mt-1">شارك الأجر مع أحبابك</p>
          </div>
          <div class="space-y-4">
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسمك <span class="text-err">*</span></label><input [formControl]="createForm.controls.createdBy" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="اكتب اسمك"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">عنوان الختمة <span class="text-err">*</span></label><input [formControl]="createForm.controls.title" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="مثال: ختمة العائلة"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسم المتوفى <span class="text-txt-muted font-normal">(اختياري)</span></label><input [formControl]="createForm.controls.deceasedName" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="رحمه/ا الله"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">وصف <span class="text-err">*</span></label><textarea [formControl]="createForm.controls.description" rows="2" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all resize-none" placeholder="وصف مختصر..."></textarea></div>
          </div>
          <div class="mt-6 flex gap-3">
            <button (click)="showCreateModal=false" class="flex-1 py-3 text-txt-muted bg-surface border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
            <button (click)="createKhatma()" [disabled]="createForm.invalid" class="flex-1 py-3 text-primary-text bg-primary hover:bg-primary-hover rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-md shadow-primary/15">إنشاء ✨</button>
          </div>
        </div>
      </div>
    }
  `,
})
export class KhatmaListComponent {
  private router = inject(Router);
  khatmaService = inject(KhatmaService);
  showCreateModal = false;

  createForm = new FormGroup({
    createdBy: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    deceasedName: new FormControl(''),
    description: new FormControl('', [Validators.required])
  });

  getCompletedCount(khatma: any) { return khatma.parts.filter((p: any) => p.status === 'completed').length; }

  createKhatma() {
    if (this.createForm.valid) {
      const { title, createdBy, deceasedName, description } = this.createForm.value;
      const id = this.khatmaService.addKhatma(title!, createdBy!, deceasedName!, description!);
      this.showCreateModal = false;
      this.createForm.reset();
      this.router.navigate(['/khatmat', id]);
    }
  }
}
