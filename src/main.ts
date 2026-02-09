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
import { provideZoneChangeDetection } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="min-h-screen flex flex-col bg-bg text-txt transition-colors duration-300">

      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50">
        <div class="absolute inset-0 bg-bg/80 backdrop-blur-xl border-b border-brd/50"></div>

        <div class="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <!-- Logo -->
          <a routerLink="/" class="group flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/15 group-hover:scale-105 transition-transform">
              <svg class="w-5 h-5 text-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
            </div>
            <span class="text-xl font-extrabold text-txt">ختمات</span>
          </a>

          <!-- Nav -->
          <nav class="hidden md:flex items-center gap-1 bg-surface rounded-2xl p-1 border border-brd">
            <a routerLink="/" routerLinkActive="!bg-primary !text-primary-text !shadow-md !shadow-primary/15" [routerLinkActiveOptions]="{exact:true}" class="px-5 py-2 rounded-xl text-sm font-bold text-txt-muted hover:text-txt transition-all duration-300">الرئيسية</a>
            <a routerLink="/khatmat" routerLinkActive="!bg-primary !text-primary-text !shadow-md !shadow-primary/15" class="px-5 py-2 rounded-xl text-sm font-bold text-txt-muted hover:text-txt transition-all duration-300">الختمات</a>
            <a routerLink="/coach" routerLinkActive="!bg-primary !text-primary-text !shadow-md !shadow-primary/15" class="px-5 py-2 rounded-xl text-sm font-bold text-txt-muted hover:text-txt transition-all duration-300">المصحح</a>
            <a routerLink="/duas" routerLinkActive="!bg-primary !text-primary-text !shadow-md !shadow-primary/15" class="px-5 py-2 rounded-xl text-sm font-bold text-txt-muted hover:text-txt transition-all duration-300">الأدعية</a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button (click)="themeService.toggleTheme()" class="w-10 h-10 rounded-2xl flex items-center justify-center bg-surface border border-brd text-txt-muted hover:text-txt hover:border-primary/30 transition-all duration-300 hover:scale-105" aria-label="تبديل المظهر">
              @if (themeService.isDarkMode()) {
                <svg class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              } @else {
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>
            <button (click)="mobileMenu = !mobileMenu" class="md:hidden w-10 h-10 rounded-2xl flex items-center justify-center bg-surface border border-brd text-txt-muted" aria-label="القائمة">
              @if (mobileMenu) {
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              } @else {
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        @if (mobileMenu) {
          <div class="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl border-b border-brd animate-fade-up">
            <nav class="max-w-6xl mx-auto px-6 py-4 space-y-1">
              <a routerLink="/" (click)="mobileMenu=false" class="block px-4 py-3 rounded-xl text-sm font-bold text-txt-muted hover:text-txt hover:bg-surface transition-all">الرئيسية</a>
              <a routerLink="/khatmat" (click)="mobileMenu=false" class="block px-4 py-3 rounded-xl text-sm font-bold text-txt-muted hover:text-txt hover:bg-surface transition-all">الختمات</a>
              <a routerLink="/coach" (click)="mobileMenu=false" class="block px-4 py-3 rounded-xl text-sm font-bold text-txt-muted hover:text-txt hover:bg-surface transition-all">المصحح</a>
              <a routerLink="/duas" (click)="mobileMenu=false" class="block px-4 py-3 rounded-xl text-sm font-bold text-txt-muted hover:text-txt hover:bg-surface transition-all">الأدعية</a>
            </nav>
          </div>
        }
      </header>

      <!-- Main -->
      <main class="flex-1 pt-16" dir="rtl">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-surface border-t border-brd py-8" dir="rtl">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 bg-primary rounded-lg flex items-center justify-center"><svg class="w-3.5 h-3.5 text-primary-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg></div>
              <span class="text-sm font-bold text-txt">ختمات</span>
              <span class="text-xs text-txt-muted">— صدقة جارية للمتوفى</span>
            </div>
            <p class="text-[11px] text-txt-muted">جميع الحقوق محفوظة © {{currentYear}}</p>
          </div>
        </div>
      </footer>
    </div>
  `,
})
export class App {
  themeService = inject(ThemeService);
  mobileMenu = false;
  currentYear = new Date().getFullYear();
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'khatmat', component: KhatmaListComponent },
  { path: 'khatmat/:id', component: KhatmaDetailComponent },
  { path: 'coach', component: CoachComponent },
  { path: 'duas', component: DuasComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    KhatmaService,
    GeminiService,
    ThemeService,
  ]
});
