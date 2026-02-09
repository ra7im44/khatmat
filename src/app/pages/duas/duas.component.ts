import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-duas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="animate-fade-up text-center mb-12">
        <div class="w-14 h-14 bg-warn/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float-slow">
          <svg class="w-7 h-7 text-warn" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342"/></svg>
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-txt mb-2">أدعية وأذكار</h1>
        <p class="text-txt-muted text-sm">مجموعة مختارة من الأدعية والأذكار الصحيحة</p>
      </div>

      <!-- Tabs -->
      <div class="animate-fade-up delay-200 flex flex-wrap gap-2 mb-12 justify-center">
        @for (cat of categories; track cat) {
          <button (click)="selectedCategory = cat" class="px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300" [class]="selectedCategory === cat ? 'bg-primary text-primary-text shadow-lg shadow-primary/20' : 'bg-surface-el border border-brd text-txt-muted hover:text-txt hover:border-primary/30'">{{cat}}</button>
        }
      </div>

      <!-- Grid -->
      <div class="grid md:grid-cols-2 gap-6">
        @for (dua of filteredDuas; track dua.id; let i = $index) {
          <div class="card-lift bg-surface-el rounded-2xl border border-brd overflow-hidden group">
            <div class="h-0.5 bg-gradient-to-l from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-warn/[0.07] border border-warn/10 text-warn text-[11px] font-bold rounded-lg">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                  {{dua.category}}
                </span>
              </div>

              <div class="relative p-5 bg-surface rounded-2xl border border-brd">
                <div class="absolute top-2 right-3 text-2xl text-primary/10 font-quran leading-none">﴿</div>
                <p class="text-lg font-quran text-txt leading-[2.5] text-center relative z-10 px-3">{{dua.text}}</p>
                <div class="absolute bottom-2 left-3 text-2xl text-primary/10 font-quran leading-none">﴾</div>
              </div>

              <div class="mt-4 flex items-center justify-between">
                @if (dua.source) {
                  <span class="inline-flex items-center gap-1.5 text-[11px] text-txt-muted font-medium">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>
                    {{dua.source}}
                  </span>
                }
                <button (click)="copyDua(dua.text)" class="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-brd text-txt-muted rounded-xl text-[11px] font-bold hover:border-primary/30 hover:text-link transition-all hover:scale-105">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                  {{copiedId === dua.id ? 'تم النسخ ✅' : 'نسخ'}}
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (filteredDuas.length === 0) {
        <div class="text-center py-20">
          <div class="w-14 h-14 bg-surface-el border border-brd rounded-2xl flex items-center justify-center mx-auto mb-4"><svg class="w-6 h-6 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
          <p class="text-txt-muted text-sm">لا توجد أدعية في هذا التصنيف</p>
        </div>
      }
    </div>
  `,
})
export class DuasComponent {
  copiedId: number | null = null;
  categories = ['الكل', 'للميت', 'أذكار الصباح', 'تفريج الهم', 'استغفار', 'قبل النوم'];
  selectedCategory = 'الكل';

  duas = [
    { id: 1, category: 'للميت', text: 'اللهم اغفر له وارحمه وعافه واعف عنه وأكرم نزله ووسع مدخله واغسله بالماء والثلج والبرد ونقه من الخطايا كما ينقى الثوب الأبيض من الدنس.', source: 'رواه مسلم' },
    { id: 2, category: 'للميت', text: 'اللهم أبدله داراً خيراً من داره وأهلاً خيراً من أهله وزوجاً خيراً من زوجه وأدخله الجنة وأعذه من عذاب القبر ومن عذاب النار.', source: 'رواه مسلم' },
    { id: 3, category: 'أذكار الصباح', text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.', source: 'الترمذي' },
    { id: 4, category: 'تفريج الهم', text: 'اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين، وغلبة الرجال.', source: 'البخاري' },
    { id: 5, category: 'استغفار', text: 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت أعوذ بك من شر ما صنعت أبوء لك بنعمتك علي وأبوء بذنبي فاغفر لي فإنه لا يغفر الذنوب إلا أنت.', source: 'سيد الاستغفار - البخاري' },
    { id: 6, category: 'قبل النوم', text: 'باسمك اللهم أموت وأحيا.', source: 'البخاري' },
    { id: 7, category: 'أذكار الصباح', text: 'أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.', source: 'مسلم' },
    { id: 8, category: 'تفريج الهم', text: 'لا إله إلا أنت سبحانك إني كنت من الظالمين.', source: 'دعاء ذي النون' },
  ];

  get filteredDuas() {
    if (this.selectedCategory === 'الكل') return this.duas;
    return this.duas.filter(d => d.category === this.selectedCategory);
  }

  copyDua(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      const dua = this.duas.find(d => d.text === text);
      if (dua) { this.copiedId = dua.id; setTimeout(() => this.copiedId = null, 2000); }
    });
  }
}
