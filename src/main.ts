import { bootstrapApplication } from '@angular/platform-browser';
import { Component, inject } from '@angular/core';
import { RouterOutlet, provideRouter, Routes, RouterLink, RouterLinkActive, withHashLocation } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'zone.js';

import { KhatmaService } from './app/services/khatma.service';
import { GeminiService } from './app/services/gemini.service';
import { ThemeService } from './app/services/theme.service';

import { HomeComponent } from './app/pages/home/home.component';
import { KhatmaListComponent } from './app/pages/khatma/list/khatma-list.component';
import { KhatmaDetailComponent } from './app/pages/khatma/detail/khatma-detail.component';
import { CoachComponent } from './app/pages/coach/coach.component';
import { DuasComponent } from './app/pages/duas/duas.component';
import { JuzReaderComponent } from './app/pages/quran/juz-reader/juz-reader.component';
import { provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col text-txt transition-colors duration-500">

      <!-- ═══ HEADER ═══ -->
      <header class="fixed top-0 left-0 right-0 z-50">
        <div class="absolute inset-0 bg-surface/60 backdrop-blur-2xl border-b border-brd/40 shadow-[0_1px_20px_rgba(0,0,0,0.04)]"></div>

        <div class="relative max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-[72px] flex items-center justify-between">

          <!-- Logo -->
          <a routerLink="/" class="group flex items-center gap-3.5">
            <div class="relative w-10 h-10 md:w-11 md:h-11">
              <div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent opacity-90 shadow-lg shadow-primary/20 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:scale-105"></div>
              <div class="absolute inset-0 rounded-2xl flex items-center justify-center">
                <svg class="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-sm transition-transform duration-500 group-hover:rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
              </div>
            </div>
            <div class="leading-tight hidden sm:block">
              <p class="text-lg font-black tracking-tight">ختمات</p>
              <p class="text-[9px] text-txt-muted font-medium tracking-wider uppercase">Quran Khatma Platform</p>
            </div>
          </a>

          <!-- Desktop Nav -->
          <nav class="hidden md:flex items-center gap-1 p-1.5 rounded-2xl border border-brd/60 bg-surface-el/50 backdrop-blur-sm">
            <a routerLink="/" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" [routerLinkActiveOptions]="{exact:true}" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الرئيسية</a>
            <a routerLink="/khatmat" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الختمات</a>
            <a routerLink="/coach" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">المصحّح</a>
            <a routerLink="/duas" routerLinkActive="!bg-gradient-to-r !from-primary !to-secondary !text-white !shadow-md !shadow-primary/20" class="px-5 py-2 rounded-xl text-[13px] font-bold text-txt-muted hover:text-txt transition-all duration-300">الأدعية</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button (click)="themeService.toggleTheme()" class="w-10 h-10 rounded-xl border border-brd/60 bg-surface/80 backdrop-blur-sm text-txt-muted hover:text-accent hover:border-accent/30 hover:bg-accent/[0.04] transition-all duration-300" aria-label="تبديل المظهر">
              @if (themeService.isDarkMode()) {
                <svg class="h-[18px] w-[18px] mx-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              } @else {
                <svg class="h-[18px] w-[18px] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>
          </div>
        </div>
      </header>

      <!-- ═══ MAIN ═══ -->
      <main class="flex-1 pt-16 md:pt-[72px] pb-20 md:pb-0" dir="rtl">
        <router-outlet></router-outlet>
      </main>

      <!-- ═══ MOBILE BOTTOM NAV ═══ -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
        <div class="bg-surface/80 backdrop-blur-2xl border border-brd/50 rounded-2xl shadow-xl shadow-black/10 px-2 py-2 flex items-center justify-around">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}" class="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
            <span class="text-[9px] font-bold">الرئيسية</span>
          </a>
          <a routerLink="/khatmat" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            <span class="text-[9px] font-bold">الختمات</span>
          </a>
          <a routerLink="/coach" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
            <span class="text-[9px] font-bold">المصحّح</span>
          </a>
          <a routerLink="/duas" routerLinkActive="text-primary" class="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-txt-muted hover:text-primary transition-colors">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>
            <span class="text-[9px] font-bold">الأدعية</span>
          </a>
        </div>
      </nav>

      <!-- ═══ FOOTER ═══ -->
      <footer class="relative mt-20 border-t border-brd/40 bg-surface/80 backdrop-blur-xl pb-24 md:pb-8" dir="rtl">
        <div class="absolute inset-0 bg-gradient-to-b from-surface-el/30 to-surface pointer-events-none"></div>
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

        <div class="relative max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-16">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

            <!-- Brand -->
            <div class="md:col-span-2 space-y-6">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">ختمات</h3>
                  <p class="text-xs text-txt-muted font-medium tracking-wide">منصة قرآنية وقفية</p>
                </div>
              </div>
              <p class="text-sm text-txt-secondary leading-loose max-w-md">
                منصة تهدف لتسهيل تنظيم الختمات القرآنية الجماعية وإهدائها لمن نحب. نسعى لربط القلوب بكتاب الله من خلال تجربة تقنية ميسرة وعصرية.
              </p>
            </div>

            <!-- Links -->
            <div class="space-y-6">
              <h4 class="text-sm font-bold text-primary border-b-2 border-primary/10 pb-2 inline-block">روابط سريعة</h4>
              <ul class="space-y-3">
                <li>
                  <a routerLink="/" class="text-sm text-txt-muted hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    الرئيسية
                  </a>
                </li>
                <li>
                  <a routerLink="/khatmat" class="text-sm text-txt-muted hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    الختمات
                  </a>
                </li>
                <li>
                  <a routerLink="/coach" class="text-sm text-txt-muted hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    المصحح القرآني
                  </a>
                </li>
                <li>
                  <a routerLink="/duas" class="text-sm text-txt-muted hover:text-primary hover:translate-x-1 transition-all duration-300 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    الأدعية
                  </a>
                </li>
              </ul>
            </div>

            <!-- Social / Contact -->
            <div class="space-y-6">
              <h4 class="text-sm font-bold text-primary border-b-2 border-primary/10 pb-2 inline-block">تواصل معنا</h4>
              <div class="flex flex-wrap gap-3">
                <a href="#" class="w-10 h-10 rounded-xl bg-surface-el border border-brd/50 flex items-center justify-center text-txt-muted hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/30">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" class="w-10 h-10 rounded-xl bg-surface-el border border-brd/50 flex items-center justify-center text-txt-muted hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/30">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="mailto:contact@khatmat.app" class="w-10 h-10 rounded-xl bg-surface-el border border-brd/50 flex items-center justify-center text-txt-muted hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-primary/30">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </a>
              </div>
            </div>

          </div>

          <!-- Bottom Bar -->
          <div class="mt-12 pt-8 border-t border-brd/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-txt-muted font-medium">
            <p>© {{currentYear}} منصة ختمات. جميع الحقوق محفوظة.</p>
            <div class="flex items-center gap-2">
              <span>صنع بإحسان في</span>
              <span class="flex items-center gap-1 bg-surface-el px-2 py-1 rounded-lg border border-brd/50">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                السعودية
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class App {
  themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'khatmat', component: KhatmaListComponent },
  { path: 'khatmat/:id', component: KhatmaDetailComponent },
  { path: 'coach', component: CoachComponent },
  { path: 'duas', component: DuasComponent },
  { path: 'quran/juz/:juz', component: JuzReaderComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    KhatmaService,
    GeminiService,
    ThemeService,
    provideHttpClient(),
  ]
});
