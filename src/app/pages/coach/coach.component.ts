import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';

@Component({
  selector: 'app-coach',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-10">

      <!-- Header -->
      <div class="animate-fade-up text-center mb-12">
        <div class="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-nfo/[0.06] border border-nfo/10 mb-5">
          <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-nfo opacity-60"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-nfo"></span></span>
          <span class="text-nfo text-xs font-bold">مدعوم بالذكاء الاصطناعي</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-txt mb-2">المصحح الذكي</h1>
        <p class="text-txt-muted text-sm max-w-md mx-auto">اختر الآية، سجل تلاوتك، واحصل على تقييم فوري</p>
      </div>

      <div class="grid md:grid-cols-2 gap-7">
        <!-- Left -->
        <div class="space-y-6 animate-fade-up delay-200">
          <div class="bg-surface-el rounded-2xl border border-brd p-6">
            <label class="block text-sm font-bold text-txt-secondary mb-2.5">اختر الآية:</label>
            <select #ayahSelect (change)="selectedAyah.set(ayahs[+ayahSelect.value])" class="w-full rounded-xl border border-input-brd bg-input-bg text-txt focus:border-focus p-3 text-base font-quran outline-none transition-all">
              @for (ayah of ayahs; track $index) {<option [value]="$index">{{ayah.surah}} - آية {{ayah.number}}</option>}
            </select>
          </div>
          <div class="relative bg-surface-el rounded-2xl p-8 text-center border border-brd overflow-hidden">
            <div class="absolute top-3 right-4 text-3xl text-primary/10 font-quran">﴿</div>
            <div class="absolute bottom-3 left-4 text-3xl text-primary/10 font-quran">﴾</div>
            <p class="text-2xl leading-[2.5] text-txt font-quran relative z-10">{{selectedAyah().text}}</p>
            <p class="text-[11px] text-txt-muted mt-5 font-medium">{{selectedAyah().surah}} - آية {{selectedAyah().number}}</p>
          </div>
        </div>

        <!-- Right -->
        <div class="space-y-6 animate-fade-up delay-300">
          <div class="bg-surface-el rounded-2xl border border-brd p-8 flex flex-col items-center min-h-[240px] justify-center">
            @if (!isRecording() && !isProcessing()) {
              <button (click)="startRecording()" class="group relative w-24 h-24 rounded-full bg-err text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 mx-auto flex items-center justify-center">
                <div class="absolute inset-0 rounded-full bg-err/20 animate-ping opacity-0 group-hover:opacity-100"></div>
                <svg class="w-9 h-9 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/></svg>
              </button>
              <p class="text-txt-muted text-sm mt-5">اضغط للبدء بالتسجيل</p>
            } @else if (isRecording()) {
              <div class="text-center">
                <div class="relative w-24 h-24 mx-auto mb-5">
                  <div class="absolute inset-0 rounded-full bg-err/20 animate-ping"></div>
                  <div class="absolute inset-2 rounded-full bg-err/30 animate-pulse"></div>
                  <div class="relative w-full h-full rounded-full bg-err flex items-center justify-center shadow-xl"><div class="w-7 h-7 bg-white rounded-md"></div></div>
                </div>
                <div class="flex justify-center gap-1 items-end h-10 mb-5">
                  @for (bar of [4,7,5,9,4,7,3]; track $index) {
                    <div class="w-1.5 bg-err rounded-full" [class]="'animate-[bounce_0.' + (5 + $index) + 's_infinite]'" [style.height.px]="bar * 4"></div>
                  }
                </div>
                <button (click)="stopRecording()" class="px-7 py-3 bg-primary text-primary-text rounded-2xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary/20">إيقاف وتحليل</button>
              </div>
            } @else {
              <div class="text-center py-4">
                <div class="relative w-16 h-16 mx-auto mb-5"><div class="w-16 h-16 border-[3px] border-brd border-t-nfo rounded-full animate-spin"></div><div class="absolute inset-0 flex items-center justify-center"><svg class="w-6 h-6 text-nfo" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg></div></div>
                <p class="text-txt-muted text-sm animate-pulse">جاري تحليل التلاوة...</p>
              </div>
            }
          </div>

          @if (result(); as res) {
            <div class="animate-scale-in bg-surface-el rounded-2xl border border-brd overflow-hidden">
              <div class="p-6 text-center" [class]="res.score >= 90 ? 'bg-ok text-white' : res.score >= 70 ? 'bg-warn text-white' : 'bg-err text-white'">
                <div class="text-5xl font-black mb-1">{{res.score}}%</div>
                <div class="text-sm font-bold opacity-80">{{res.score >= 90 ? 'ممتاز - ما شاء الله' : res.score >= 70 ? 'جيد - يحتاج تحسين' : 'يحتاج تدريب'}}</div>
              </div>
              <div class="p-6 space-y-5">
                <div><p class="text-[10px] text-txt-muted font-bold uppercase tracking-wider mb-2">ما سمعه الذكاء الاصطناعي</p><p class="text-sm text-txt font-quran bg-surface p-3 rounded-xl border border-brd">{{res.transcription}}</p></div>
                @if (res.mistakes?.length > 0) {
                  <div><p class="text-[10px] text-txt-muted font-bold uppercase tracking-wider mb-2">الملاحظات</p>
                    @for (m of res.mistakes; track $index) {
                      <div class="flex gap-2 items-start bg-err/[0.05] p-3 rounded-xl border border-err/10 mb-2"><svg class="w-4 h-4 text-err flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg><div><span class="font-bold text-err text-sm">{{m.word}}: </span><span class="text-txt-secondary text-xs">{{m.description}}</span></div></div>
                    }
                  </div>
                } @else {
                  <div class="bg-ok/[0.05] p-4 rounded-xl flex items-center gap-3 border border-ok/10"><svg class="w-8 h-8 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><div><p class="text-ok font-bold text-sm">ما شاء الله! تلاوة ممتازة</p><p class="text-xs text-txt-muted mt-0.5">مطابقة للنص القرآني</p></div></div>
                }
                @if (res.feedback) {<div class="border-t border-brd pt-4"><p class="text-[10px] text-txt-muted font-bold mb-1.5">💡 نصيحة المعلم</p><p class="text-txt-secondary text-sm italic leading-relaxed">{{res.feedback}}</p></div>}
              </div>
              <div class="bg-surface p-3 border-t border-brd flex justify-center"><button (click)="result.set(null)" class="text-xs text-link font-bold hover:scale-105 transition-transform flex items-center gap-1.5"><svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg> تجربة أخرى</button></div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CoachComponent {
  geminiService = inject(GeminiService);
  ayahs = [
    { surah: 'الفاتحة', number: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ' },
    { surah: 'الإخلاص', number: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
    { surah: 'الفلق', number: 1, text: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ' },
    { surah: 'الناس', number: 1, text: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ' },
  ];
  selectedAyah = signal(this.ayahs[0]);
  isRecording = signal(false);
  isProcessing = signal(false);
  result = signal<any>(null);
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording() {
    this.result.set(null); this.audioChunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
      this.mediaRecorder.start(); this.isRecording.set(true);
    } catch { alert('الرجاء السماح باستخدام الميكروفون.'); }
  }
  stopRecording() {
    if (!this.mediaRecorder) return;
    this.mediaRecorder.onstop = async () => { await this.processAudio(new Blob(this.audioChunks, { type: 'audio/webm' })); };
    this.mediaRecorder.stop();
    this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
    this.isRecording.set(false);
  }
  async processAudio(blob: Blob) {
    this.isProcessing.set(true);
    try {
      const b64 = await this.blobToBase64(blob);
      this.result.set(await this.geminiService.analyzeRecitation(b64.split(',')[1], this.selectedAyah().text));
    } catch { alert('حدث خطأ. حاول مرة أخرى.'); } finally { this.isProcessing.set(false); }
  }
  private blobToBase64(blob: Blob): Promise<string> { return new Promise((res, rej) => { const r = new FileReader(); r.onloadend = () => res(r.result as string); r.onerror = rej; r.readAsDataURL(blob); }); }
}
