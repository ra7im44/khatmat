import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KhatmaService } from '../../services/khatma.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ══════ HERO ══════ -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden">
      <!-- Ambient blobs -->
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] bg-primary animate-drift pointer-events-none"></div>
      <div class="absolute bottom-[-10%] left-[-8%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.03] bg-accent animate-drift pointer-events-none" style="animation-delay:-5s"></div>
      <!-- Dot grid -->
      <div class="absolute inset-0 dot-grid opacity-[0.35] dark:opacity-[0.08] pointer-events-none"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6 w-full py-12">
        <div class="grid lg:grid-cols-2 gap-16 items-center">

          <!-- Text -->
          <div class="text-center lg:text-right order-2 lg:order-1">
            <div class="animate-fade-up inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/[0.06] border border-primary/10 mb-7">
              <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
              <span class="text-primary text-xs font-bold tracking-wide">صدقة جارية للمتوفى</span>
            </div>

            <h1 class="animate-hero text-[2.8rem] md:text-[3.6rem] lg:text-[4rem] font-black leading-[1.15] text-txt mb-6">
              اختم القرآن
              <br/>
              <span class="gradient-text">لمن تحب</span>
            </h1>

            <p class="animate-fade-up delay-200 text-txt-secondary text-[15px] md:text-base leading-[2] max-w-lg mx-auto lg:mx-0 lg:mr-0 mb-9">
              أنشئ ختمة قرآنية جماعية وأهدِ ثوابها لروح من فقدت.
              <br class="hidden md:block"/>
              ادعُ عائلتك وأصدقاءك للمشاركة في قراءة الأجزاء.
            </p>

            <div class="animate-fade-up delay-300 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button (click)="openCreateModal()" aria-label="إنشاء ختمة قرآنية جديدة" class="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-primary-text font-bold text-[15px] shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/25 overflow-hidden">
                <span class="absolute inset-0 bg-gradient-to-l from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <svg class="w-5 h-5 relative transition-transform group-hover:rotate-90 duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                <span class="relative">أنشئ ختمة جديدة</span>
              </button>
              <a routerLink="/duas" aria-label="تصفح أدعية للمتوفى" class="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl border-2 border-brd text-txt-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/[0.03] font-semibold text-sm transition-all duration-300">
                <svg class="w-4.5 h-4.5 transition-transform group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>
                أدعية للمتوفى
              </a>
            </div>
          </div>

          <!-- Visual -->
          <div class="order-1 lg:order-2 flex justify-center animate-scale-in delay-200">
            <div class="relative w-72 h-72 md:w-80 md:h-80">
              <!-- Orbiting rings -->
              <div class="absolute inset-0 rounded-full border-2 border-dashed border-primary/[0.08] animate-orbit"></div>
              <div class="absolute inset-5 rounded-full border border-primary/[0.06] animate-orbit-reverse"></div>
              <!-- Center card -->
              <div class="absolute inset-12 rounded-3xl glass pulse-glow-el flex flex-col items-center justify-center text-center p-5 shadow-xl">
                <svg class="w-10 h-10 text-primary mb-2 animate-float-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                <span class="text-4xl font-black text-txt">30</span>
                <span class="text-primary text-[11px] font-bold mt-0.5">جزء في كل ختمة</span>
              </div>
              <!-- Floating badges -->
              <div class="absolute top-2 right-8 animate-pop-in delay-500"><div class="w-12 h-12 rounded-2xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-2s"><svg class="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg></div></div>
              <div class="absolute bottom-4 left-2 animate-pop-in delay-600"><div class="w-11 h-11 rounded-xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-4s"><svg class="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg></div></div>
              <div class="absolute top-1/2 left-[-8px] animate-pop-in delay-700"><div class="w-10 h-10 rounded-xl glass shadow-lg flex items-center justify-center animate-float" style="animation-delay:-1s"><svg class="w-4 h-4 text-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div></div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="animate-fade-up delay-500 mt-14 pt-8 border-t border-brd/50 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 text-center lg:text-right">
          @for (stat of statsData; track stat.label) {
            <div class="animate-count" [style.animation-delay]="stat.delay">
              <div class="text-2xl md:text-3xl font-black" [class]="stat.color">{{stat.value || '—'}}</div>
              <div class="text-[11px] text-txt-muted mt-1 font-medium">{{stat.label}}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ══════ HADITH ══════ -->
    <section class="animate-fade-up py-20 bg-surface border-y border-brd relative overflow-hidden">
      <div class="absolute inset-0 dot-grid opacity-20 dark:opacity-[0.04]"></div>
      <div class="relative max-w-2xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 mb-6">
          <div class="w-8 h-[2px] bg-primary/40 rounded-full"></div>
          <svg class="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          <div class="w-8 h-[2px] bg-primary/40 rounded-full"></div>
        </div>
        <p class="text-lg md:text-xl font-quran leading-[2.4] text-txt">
          « إذا مات ابن آدم انقطع عمله إلا من ثلاث:
          <span class="text-primary font-bold">صدقة جارية</span>،
          أو علم يُنتفع به، أو ولد صالح يدعو له »
        </p>
        <div class="mt-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warn/[0.07] border border-warn/10">
          <svg class="w-3.5 h-3.5 text-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
          <span class="text-warn text-[11px] font-bold">رواه مسلم</span>
        </div>
      </div>
    </section>

    <!-- ══════ HOW IT WORKS ══════ -->
    <section class="py-20">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-2xl md:text-3xl font-black text-txt mb-2">كيف تعمل؟</h2>
          <p class="text-txt-muted text-sm">ثلاث خطوات بسيطة وتصل الختمة</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          @for (step of steps; track step.num; let i = $index) {
            <div class="card-lift relative bg-surface-el rounded-3xl p-7 text-center border border-brd group overflow-hidden">
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="w-14 h-14 rounded-2xl bg-primary/[0.07] text-primary text-lg font-black flex items-center justify-center mx-auto mb-5 group-hover:bg-primary group-hover:text-primary-text transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:rotate-3">{{step.num}}</div>
              <h3 class="text-base font-bold text-txt mb-2">{{step.title}}</h3>
              <p class="text-xs text-txt-muted leading-relaxed">{{step.desc}}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ══════ LIVE KHATMAS ══════ -->
    <section class="py-20 bg-surface border-y border-brd">
      <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 class="text-xl md:text-2xl font-black text-txt mb-1">ختمات جارية</h2>
            <p class="text-txt-muted text-xs">شارك في ختمة أو أنشئ واحدة جديدة</p>
          </div>
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-initial">
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input [(ngModel)]="searchQuery" type="text" placeholder="ابحث باسم الختمة..." class="w-full sm:w-52 pr-10 pl-4 py-2.5 rounded-xl border border-input-brd bg-input-bg text-txt text-xs outline-none transition-all focus:border-focus focus:shadow-sm"/>
            </div>
            <a routerLink="/khatmat" class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-link hover:underline whitespace-nowrap">عرض الكل <svg class="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></a>
          </div>
        </div>

        @if (filteredKhatmas.length > 0) {
          <div class="grid md:grid-cols-2 gap-5">
            @for (k of filteredKhatmas; track k.id; let i = $index) {
              <div class="card-lift group bg-surface-el rounded-2xl border border-brd overflow-hidden">
                <div class="h-1 bg-brd"><div class="h-full bg-gradient-to-l from-primary to-accent transition-all duration-700" [style.width.%]="k.progress"></div></div>
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex-1 min-w-0">
                      <a [routerLink]="['/khatmat', k.id]" class="text-sm font-bold text-txt group-hover:text-link transition-colors block truncate">{{k.title}}</a>
                      <div class="flex items-center gap-3 mt-1.5">
                        <span class="text-[10px] text-txt-muted flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg> {{k.createdBy}}</span>
                        @if (k.deceasedName) {<span class="text-[10px] text-warn flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg> {{k.deceasedName}}</span>}
                      </div>
                    </div>
                    <div class="flex-shrink-0 mr-3 w-11 h-11 rounded-xl bg-primary/[0.07] flex flex-col items-center justify-center"><span class="text-sm font-black text-primary leading-none">{{k.progress}}</span><span class="text-[7px] text-primary/60 font-bold">%</span></div>
                  </div>
                  <div class="flex items-center gap-1.5 text-[10px] text-txt-muted mb-4"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> {{getCompletedParts(k)}} / 30 جزء مكتمل</div>
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/khatmat', k.id]" [attr.aria-label]="'احجز جزء في ختمة ' + k.title" class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-primary-text font-bold rounded-xl text-[11px] transition-all hover:shadow-md hover:shadow-primary/15">
                      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg> احجز جزء
                    </a>
                    <button (click)="shareKhatmaWhatsApp(k);$event.stopPropagation()" [attr.aria-label]="'شارك ختمة ' + k.title + ' على واتساب'" class="w-9 h-9 flex items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:scale-105"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></button>
                    <button (click)="copyKhatmaLink(k);$event.stopPropagation()" [attr.aria-label]="'نسخ رابط ختمة ' + k.title" class="w-9 h-9 flex items-center justify-center rounded-xl bg-surface border border-brd text-txt-muted hover:text-link hover:border-primary/30 transition-all duration-300 hover:scale-105"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg></button>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (hasNoKhatmas) {
          <div class="text-center py-16 bg-surface-el rounded-2xl border-2 border-dashed border-brd">
            <div class="w-16 h-16 bg-primary/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
            <h3 class="text-base font-bold text-txt mb-1.5">لا توجد ختمات حالية</h3>
            <p class="text-txt-muted text-xs mb-5">ابدأ ختمة جديدة وشارك الأجر</p>
            <button (click)="openCreateModal()" class="px-6 py-2.5 bg-primary text-primary-text font-bold rounded-xl text-xs hover:bg-primary-hover transition-all shadow-md shadow-primary/15">إنشاء أول ختمة</button>
          </div>
        } @else {
          <div class="text-center py-12"><p class="text-txt-muted text-sm">لا توجد نتائج لـ "{{searchQuery}}"</p></div>
        }
        <a routerLink="/khatmat" class="sm:hidden mt-5 block text-center text-xs font-bold text-link">عرض كل الختمات</a>
      </div>
    </section>

    <!-- ══════ TOOLS ══════ -->
    <section class="py-20">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-xl font-black text-txt text-center mb-2">أدوات إضافية</h2>
        <p class="text-center text-txt-muted text-xs mb-10">المزيد من طرق الخير</p>
        <div class="grid md:grid-cols-2 gap-5">
          <a routerLink="/coach" aria-label="المصحح الذكي" class="card-lift group flex items-center gap-5 bg-surface-el rounded-2xl p-6 border border-brd overflow-hidden relative">
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-nfo to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="w-13 h-13 rounded-2xl bg-nfo/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-nfo group-hover:shadow-lg group-hover:shadow-nfo/20 transition-all duration-500"><svg class="w-6 h-6 text-nfo group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg></div>
            <div><h3 class="text-sm font-bold text-txt group-hover:text-link transition-colors mb-0.5">المصحح الذكي</h3><p class="text-xs text-txt-muted">تقييم فوري للتلاوة بالذكاء الاصطناعي</p></div>
          </a>
          <a routerLink="/duas" aria-label="أدعية للمتوفى" class="card-lift group flex items-center gap-5 bg-surface-el rounded-2xl p-6 border border-brd overflow-hidden relative">
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-l from-warn to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="w-13 h-13 rounded-2xl bg-warn/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-warn group-hover:shadow-lg group-hover:shadow-warn/20 transition-all duration-500"><svg class="w-6 h-6 text-warn group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/></svg></div>
            <div><h3 class="text-sm font-bold text-txt group-hover:text-link transition-colors mb-0.5">أدعية للمتوفى</h3><p class="text-xs text-txt-muted">أدعية صحيحة مختارة من السنة</p></div>
          </a>
        </div>
      </div>
    </section>

    <!-- ══════ CTA ══════ -->
    <section class="py-14 bg-surface border-t border-brd">
      <div class="max-w-2xl mx-auto px-6">
        <div class="relative bg-gradient-to-br from-primary via-primary-hover to-accent rounded-3xl p-10 md:p-14 text-center overflow-hidden shadow-2xl shadow-primary/15 animate-gradient">
          <div class="absolute inset-0 dot-grid opacity-[0.06]"></div>
          <div class="absolute top-[-30%] right-[-10%] w-60 h-60 rounded-full bg-white/[0.04] blur-xl"></div>
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5 animate-float-slow"><svg class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/></svg></div>
            <h2 class="text-2xl md:text-3xl font-black text-white mb-3">اجعل لهم نصيباً من الأجر</h2>
            <p class="text-white/60 mb-8 max-w-sm mx-auto text-sm">ختمة واحدة قد تكون نوراً في قبر من تحب</p>
            <button (click)="openCreateModal()" aria-label="ابدأ بإنشاء ختمة" class="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-primary font-bold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
              ابدأ الآن
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-[-4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════ CREATE MODAL ══════ -->
    @if (showCreateModal) {
      <div class="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4" (click)="showCreateModal=false">
        <div class="animate-scale-in bg-surface-el rounded-3xl w-full max-w-md p-8 shadow-2xl border border-brd" (click)="$event.stopPropagation()">
          <div class="text-center mb-6">
            <div class="w-14 h-14 bg-primary/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg></div>
            <h3 class="text-lg font-bold text-txt">أنشئ ختمة جديدة</h3>
            <p class="text-[11px] text-txt-muted mt-1">شارك الأجر مع أحبابك</p></div>
          <div class="space-y-4">
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسمك <span class="text-err">*</span></label><input [(ngModel)]="newKhatma.createdBy" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="اكتب اسمك"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">عنوان الختمة <span class="text-err">*</span></label><input [(ngModel)]="newKhatma.title" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="مثال: ختمة العائلة"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">اسم المتوفى <span class="text-txt-muted font-normal">(اختياري)</span></label><input [(ngModel)]="newKhatma.deceasedName" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all" placeholder="رحمه/ا الله"></div>
            <div><label class="block text-xs font-bold text-txt-secondary mb-1.5">وصف <span class="text-err">*</span></label><textarea [(ngModel)]="newKhatma.description" rows="2" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-sm outline-none transition-all resize-none" placeholder="وصف مختصر..."></textarea></div>
          </div>
          <div class="mt-6 flex gap-3">
            <button (click)="showCreateModal=false" class="flex-1 py-3 text-txt-muted bg-surface border border-brd rounded-xl font-bold text-xs hover:bg-bg transition-colors">إلغاء</button>
            <button (click)="createKhatma()" [disabled]="!canCreate" class="flex-1 py-3 text-primary-text bg-primary hover:bg-primary-hover rounded-xl font-bold text-xs disabled:opacity-40 transition-all shadow-md shadow-primary/15">إنشاء ✨</button>
          </div>
        </div>
      </div>
    }

    <!-- Toast -->
    @if (copiedToast) {<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-ok text-white text-xs font-bold rounded-2xl shadow-xl animate-fade-up">✅ تم نسخ الرابط</div>}
  `,
})
export class HomeComponent {
  private khatmaService = inject(KhatmaService);
  private router = inject(Router);

  searchQuery = '';
  showCreateModal = false;
  copiedToast = false;
  newKhatma = { title: '', createdBy: '', deceasedName: '', description: '' };

  steps = [
    { num: '١', title: 'أنشئ الختمة', desc: 'اكتب اسمك واسم المتوفى وأنشئ ختمة من 30 جزء' },
    { num: '٢', title: 'شارك الرابط', desc: 'ادعُ العائلة والأصدقاء عبر واتساب أو تيليجرام' },
    { num: '٣', title: 'يصل الأجر', desc: 'كل جزء يُقرأ يصل ثوابه للمتوفى بإذن الله' },
  ];

  get statsData() {
    return [
      { value: this.totalKhatmas, label: 'ختمة جارية', color: 'text-primary', delay: '0ms' },
      { value: this.totalCompleted, label: 'جزء مكتمل', color: 'text-txt', delay: '100ms' },
      { value: this.totalParticipants, label: 'مشارك', color: 'text-warn', delay: '200ms' },
    ];
  }

  get hasNoKhatmas() { return this.khatmaService.khatmas().length === 0; }
  get totalKhatmas() { return this.khatmaService.khatmas().length; }
  get totalCompleted() { return this.khatmaService.khatmas().reduce((s, k) => s + k.parts.filter(p => p.status === 'completed').length, 0); }
  get totalParticipants() {
    const n = new Set<string>();
    this.khatmaService.khatmas().forEach(k => k.parts.forEach(p => { if (p.completedBy) n.add(p.completedBy); if (p.reservedBy) n.add(p.reservedBy); }));
    return n.size;
  }
  get filteredKhatmas() {
    const all = this.khatmaService.khatmas();
    if (!this.searchQuery.trim()) return all;
    const q = this.searchQuery.trim().toLowerCase();
    return all.filter(k => k.title.toLowerCase().includes(q) || (k.deceasedName && k.deceasedName.toLowerCase().includes(q)) || k.createdBy.toLowerCase().includes(q));
  }
  get canCreate() { return this.newKhatma.title.trim() && this.newKhatma.createdBy.trim() && this.newKhatma.description.trim(); }
  getCompletedParts(k: any) { return k.parts.filter((p: any) => p.status === 'completed').length; }

  openCreateModal() { this.newKhatma = { title: '', createdBy: '', deceasedName: '', description: '' }; this.showCreateModal = true; }
  createKhatma() {
    if (!this.canCreate) return;
    const id = this.khatmaService.addKhatma(this.newKhatma.title, this.newKhatma.createdBy, this.newKhatma.deceasedName, this.newKhatma.description);
    this.showCreateModal = false;
    this.router.navigate(['/khatmat', id]);
  }
  shareKhatmaWhatsApp(k: any) {
    let t = `📖 شارك معنا في ختمة "${k.title}"`;
    if (k.deceasedName) t += `\n🕊️ عن: ${k.deceasedName}`;
    t += `\n📊 التقدم: ${k.progress}%\n\nاحجز جزء:\n${location.origin}/#/khatmat/${k.id}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, '_blank');
  }
  copyKhatmaLink(k: any) {
    navigator.clipboard.writeText(`${location.origin}/#/khatmat/${k.id}`).then(() => { this.copiedToast = true; setTimeout(() => this.copiedToast = false, 2000); });
  }
}
