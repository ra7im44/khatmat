import { Component, inject, signal, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KhatmaService } from '../../../services/khatma.service';

// ═══════════ INTERFACES ═══════════

interface Verse {
  number: number;
  surahNumber: number;
  text: string;
  translationEn?: string;
  numberInSurah: number;
  pageNumber?: number;
  surahName?: string;
  hizbQuarter?: number;
}

type SharePlatform = 'whatsapp' | 'telegram' | 'x';
type ReadingMode = 'continuous' | 'verse' | 'mushaf';
type BookmarkType = 'khatma' | 'hifz' | 'tadabbur';

interface ReciterOption {
  id: string;
  name: string;
}

interface QuranApiAyah {
  number: number;
  numberInSurah: number;
  text: string;
  page?: number;
  hizbQuarter?: number;
  surah?: {
    number: number;
    name: string;
    englishName: string;
  };
}

interface QuranApiResponse {
  code: number;
  status: string;
  data?: {
    ayahs?: QuranApiAyah[];
  };
}

interface SavedBookmark {
  verseNumber: number;
  type: BookmarkType;
  surahName?: string;
  ayahInSurah?: number;
  label?: string;
  timestamp: number;
}

interface SearchResult {
  verse: Verse;
  index: number;
  matchStart: number;
  contextBefore?: string;
  contextAfter?: string;
  score?: number;
}

// Surah info for display
interface SurahInfo {
  number: number;
  name: string;
  startIndex: number;
  endIndex: number;
  versesCount: number;
}

interface VerseNote {
  verseNumber: number;
  text: string;
  reflection?: string;
  timestamp: number;
}

interface MemorizationItem {
  verseNumber: number;
  surahName?: string;
  ayahInSurah: number;
}

// ═══════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════

@Component({
  selector: 'app-juz-reader',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './juz-reader.component.html',
  styleUrl: './juz-reader.component.css'
})
export class JuzReaderComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private khatmaService = inject(KhatmaService);
  private lastLoadKey: string | null = null;
  private scrollDebouncer: ReturnType<typeof setTimeout> | null = null;

  juzNumber = signal<number>(1);
  khatmaId = signal<string | null>(null);
  readerName = signal<string | null>(null);
  verses = signal<Verse[]>([]);
  loading = signal(true);
  loadError = signal<string | null>(null);
  accessError = signal<string | null>(null);

  // ─── Settings ───
  fontSize = signal(24);
  isDarkMode = signal(false);
  scrollProgress = signal(0);
  showTranslation = signal(false);

  // ─── Reading Modes ───
  readingMode = signal<ReadingMode>('continuous');
  currentVerseIndex = signal(0); // for verse-by-verse mode
  mushafCurrentPage = signal(1);

  // ─── Focus Mode ───
  focusMode = signal(false);

  // ─── Search ───
  showSearch = signal(false);
  searchQuery = signal('');
  searchResults = signal<SearchResult[]>([]);

  // ─── Navigation ───
  showGoTo = signal(false);
  goToType = signal<'surah' | 'juz' | 'ayah'>('surah');
  goToValue = signal('');

  // ─── Audio & AI ───
  currentAudio: HTMLAudioElement | null = null;
  isPlaying = signal(false);
  currentPlayingVerse = signal<number | null>(null);
  currentPlayingWordIndex = signal<number | null>(null);
  private wordPlaybackActive = false;
  private wordPlaybackAbort = false;
  reciterId = signal<string>('ar.alafasy');
  readonly reciters: ReciterOption[] = [
    { id: 'ar.alafasy', name: 'العفاسي' },
    { id: 'ar.husary', name: 'الحصري' },
    { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط' },
    { id: 'ar.minshawi', name: 'المنشاوي' }
  ];
  showAiCoach = signal(false);
  aiRecording = signal(false);

  // ─── Phase 2: Audio Enhancements ───
  continuousPlay = signal(false);
  private continuousAbort = false;
  playbackSpeed = signal(1);
  repeatCount = signal(1);
  repeatRemaining = signal(0);
  sleepTimerMinutes = signal(0);
  sleepTimerActive = signal(false);
  sleepTimerRemaining = signal(0);
  private sleepTimerInterval: ReturnType<typeof setInterval> | null = null;
  showAudioSettings = signal(false);

  // ─── Phase 2: Tadabbur / Notes ───
  verseNotes = signal<VerseNote[]>([]);
  activeNoteVerse = signal<number | null>(null);
  noteText = signal('');
  reflectionText = signal('');
  showReflectionPrompt = signal(false);
  verseOfTheDay = signal<Verse | null>(null);

  // ─── Phase 2: Memorization ───
  memorizationMode = signal(false);
  revealedVerses = signal<Set<number>>(new Set());
  quickTestMode = signal(false);
  quickTestVerse = signal<Verse | null>(null);
  quickTestRevealed = signal(false);
  memorizationPlaylist = signal<MemorizationItem[]>([]);
  showMemorizationPanel = signal(false);

  // ─── Bookmarks ───
  savedBookmarks = signal<SavedBookmark[]>([]);
  showBookmarksPanel = signal(false);
  bookmarkTypeFilter = signal<BookmarkType | 'all'>('all');
  lastReadPosition = signal<{ juz: number; verseIndex: number; scrollY: number } | null>(null);
  showContinueReading = signal(false);

  // ─── Toast ───
  showToast = signal(false);
  toastMessage = signal('');

  // ─── UI Drawers ───
  showSettingsDrawer = signal(false);
  showVotdPopup = signal(false);

  // ─── Caches ───
  private verseWordsCache = new Map<number, string[]>();
  private verseWordAudioCache = new Map<number, Array<{ text: string; audioUrl: string }>>();

  // ─── Computed ───
  surahsInJuz = computed<SurahInfo[]>(() => {
    const v = this.verses();
    if (!v.length) return [];
    const map = new Map<number, SurahInfo>();
    v.forEach((verse, idx) => {
      if (!map.has(verse.surahNumber)) {
        map.set(verse.surahNumber, {
          number: verse.surahNumber,
          name: verse.surahName || `سورة ${verse.surahNumber}`,
          startIndex: idx,
          endIndex: idx,
          versesCount: 1
        });
      } else {
        const s = map.get(verse.surahNumber)!;
        s.endIndex = idx;
        s.versesCount++;
      }
    });
    return Array.from(map.values());
  });

  currentVerse = computed(() => {
    const v = this.verses();
    const i = this.currentVerseIndex();
    return v[i] ?? null;
  });

  mushafPages = computed<number[]>(() => {
    const v = this.verses();
    if (!v.length) return [];
    const pages = new Set<number>();
    v.forEach(verse => {
      if (verse.pageNumber) pages.add(verse.pageNumber);
    });
    return Array.from(pages).sort((a, b) => a - b);
  });

  mushafPageVerses = computed(() => {
    const page = this.mushafCurrentPage();
    return this.verses().filter(v => v.pageNumber === page);
  });

  currentSurahName = computed(() => {
    const v = this.currentVerse();
    return v?.surahName || '';
  });

  filteredBookmarks = computed(() => {
    const filter = this.bookmarkTypeFilter();
    const all = this.savedBookmarks();
    if (filter === 'all') return all;
    return all.filter(b => b.type === filter);
  });

  // ═══════════ LIFECYCLE ═══════════

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const juz = Number(params.get('juz'));
      if (Number.isFinite(juz) && juz >= 1 && juz <= 30) {
        this.juzNumber.set(juz);
        this.processRouteContext();
      } else {
        this.loading.set(false);
      }
    });

    this.route.queryParams.subscribe(params => {
      const kId = params['khatmaId'];
      if (typeof kId === 'string' && kId.trim()) {
        this.khatmaId.set(kId);
      } else {
        this.khatmaId.set(null);
      }
      this.processRouteContext();
    });

    // Restore settings
    const savedSize = localStorage.getItem('quran-font-size');
    if (savedSize) this.fontSize.set(Number(savedSize));

    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode.set(savedTheme === 'dark');

    const savedReciter = localStorage.getItem('quran-reciter');
    if (savedReciter && this.reciters.some(r => r.id === savedReciter)) {
      this.reciterId.set(savedReciter);
    }

    const savedMode = localStorage.getItem('quran-reading-mode') as ReadingMode | null;
    if (savedMode && ['continuous', 'verse', 'mushaf'].includes(savedMode)) {
      this.readingMode.set(savedMode);
    }

    // Load bookmarks
    this.loadBookmarks();

    // Load Phase 2 data
    this.loadNotes();
    this.loadMemorizationPlaylist();

    // Check last read position
    this.loadLastReadPosition();
  }

  private processRouteContext() {
    const juz = this.juzNumber();
    if (!(Number.isFinite(juz) && juz >= 1 && juz <= 30)) {
      this.accessError.set('رقم الجزء غير صالح.');
      this.loading.set(false);
      this.verses.set([]);
      return;
    }

    this.accessError.set(null);
    const currentKhatmaId = this.khatmaId();

    if (currentKhatmaId) {
      const khatma = this.khatmaService.getKhatmaById(currentKhatmaId)();
      if (!khatma) {
        this.accessError.set('الختمة غير موجودة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      const part = khatma.parts.find(p => p.juzNumber === juz);
      if (!part) {
        this.accessError.set('الجزء غير موجود داخل هذه الختمة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      if (part.status === 'available') {
        this.accessError.set('لازم تحجز الجزء من صفحة الختمة أولاً قبل القراءة.');
        this.loading.set(false);
        this.verses.set([]);
        this.lastLoadKey = null;
        return;
      }

      this.readerName.set(part.reservedBy || part.completedBy || null);
    } else {
      this.readerName.set(null);
    }

    const loadKey = `${juz}|${currentKhatmaId ?? ''}`;
    if (this.lastLoadKey === loadKey && (this.verses().length > 0 || this.loading())) {
      return;
    }

    this.lastLoadKey = loadKey;
    this.loadJuz(juz);
  }

  async loadJuz(juz: number) {
    this.loading.set(true);
    this.loadError.set(null);
    this.verses.set([]);
    this.verseWordsCache.clear();
    this.verseWordAudioCache.clear();

    try {
      const [arabicResponse, englishTranslationResponse] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/juz/${juz}/en.asad`)
      ]);

      if (!arabicResponse.ok || !englishTranslationResponse.ok) {
        throw new Error(`HTTP ${arabicResponse.status}/${englishTranslationResponse.status}`);
      }

      const arabicPayload = (await arabicResponse.json()) as QuranApiResponse;
      const englishTranslationPayload = (await englishTranslationResponse.json()) as QuranApiResponse;

      const ayahs = arabicPayload.data?.ayahs ?? [];
      const englishTranslationAyahs = englishTranslationPayload.data?.ayahs ?? [];

      if (!ayahs.length) {
        throw new Error('No ayahs returned');
      }

      const englishTranslationByNumber = new Map<number, string>(
        englishTranslationAyahs.map((ayah) => [ayah.number, ayah.text])
      );

      const bismillahPattern = /^[\ufeff]?\u0628\u0650\u0633\u0652\u0645\u0650\s+\u0671\u0644\u0644\u0651\u064e\u0647\u0650\s+\u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650\s+\u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650\s*/;

      const mappedVerses: Verse[] = ayahs.map((ayah) => {
        let text = ayah.text;
        const surahNum = ayah.surah?.number ?? 1;
        // Strip Bismillah from first ayah of each Surah (except Al-Fatiha and At-Tawba)
        if (ayah.numberInSurah === 1 && surahNum !== 1 && surahNum !== 9) {
          text = text.replace(bismillahPattern, '').trim();
        }
        return {
          number: ayah.number,
          surahNumber: surahNum,
          numberInSurah: ayah.numberInSurah,
          text,
          translationEn: englishTranslationByNumber.get(ayah.number),
          pageNumber: ayah.page,
          surahName: ayah.surah?.name,
          hizbQuarter: ayah.hizbQuarter
        };
      });

      this.verses.set(mappedVerses);

      // Set mushaf page to first available
      if (mappedVerses.length && mappedVerses[0].pageNumber) {
        this.mushafCurrentPage.set(mappedVerses[0].pageNumber);
      }

      // Pick verse of the day
      this.pickVerseOfTheDay();

      // Check if there's a continue-reading position for this juz
      const lastPos = this.lastReadPosition();
      if (lastPos && lastPos.juz === juz) {
        this.showContinueReading.set(true);
      }
    } catch {
      this.loadError.set('تعذر تحميل آيات الجزء حالياً. تأكد من الاتصال بالإنترنت ثم حاول مرة أخرى.');
    } finally {
      this.loading.set(false);
    }
  }

  // ═══════════ SCROLL & PROGRESS ═══════════

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    this.scrollProgress.set(docHeight > 0 ? (scrolled / docHeight) * 100 : 0);

    // Auto-save reading position (debounced)
    if (this.scrollDebouncer) clearTimeout(this.scrollDebouncer);
    this.scrollDebouncer = setTimeout(() => this.saveReadingPosition(), 1500);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Focus mode toggle with F key
    if (event.key === 'f' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      this.toggleFocusMode();
    }

    // Arrow keys for verse-by-verse mode
    if (this.readingMode() === 'verse') {
      if (event.key === 'ArrowLeft') this.nextVerse();
      if (event.key === 'ArrowRight') this.prevVerse();
    }
  }

  // ═══════════ READING MODES ═══════════

  setReadingMode(mode: ReadingMode) {
    this.readingMode.set(mode);
    localStorage.setItem('quran-reading-mode', mode);
    if (mode === 'verse') {
      this.currentVerseIndex.set(0);
    }
  }

  // Verse-by-verse navigation
  nextVerse() {
    const max = this.verses().length - 1;
    this.currentVerseIndex.update(i => Math.min(i + 1, max));
  }

  prevVerse() {
    this.currentVerseIndex.update(i => Math.max(i - 1, 0));
  }

  goToVerse(index: number) {
    if (index >= 0 && index < this.verses().length) {
      this.currentVerseIndex.set(index);
    }
  }

  // Mushaf pagination
  nextMushafPage() {
    const pages = this.mushafPages();
    const current = this.mushafCurrentPage();
    const idx = pages.indexOf(current);
    if (idx < pages.length - 1) {
      this.mushafCurrentPage.set(pages[idx + 1]);
    }
  }

  prevMushafPage() {
    const pages = this.mushafPages();
    const current = this.mushafCurrentPage();
    const idx = pages.indexOf(current);
    if (idx > 0) {
      this.mushafCurrentPage.set(pages[idx - 1]);
    }
  }

  // ═══════════ FOCUS MODE ═══════════

  toggleFocusMode() {
    this.focusMode.update(v => !v);
  }

  // ═══════════ SEARCH ═══════════

  toggleSearch() {
    this.showSearch.update(v => !v);
    if (!this.showSearch()) {
      this.searchQuery.set('');
      this.searchResults.set([]);
    }
  }

  performSearch() {
    let q = this.searchQuery().trim();
    if (!q || q.length < 2) {
      this.searchResults.set([]);
      return;
    }

    // Check if query is a number (verse number search)
    const verseNumSearch = parseInt(q, 10);
    const isNum = !isNaN(verseNumSearch);

    // Normalize query
    const normalizedQ = this.normalizeForMatch(q);
    const allVerses = this.verses();
    const results: SearchResult[] = [];

    allVerses.forEach((verse, index) => {
      let score = 0;
      let matchStart = -1;

      // 1. Direct Verse Number Match
      if (isNum && verse.numberInSurah === verseNumSearch) {
        score += 100;
        matchStart = 0;
      }

      // 2. Normalized Text Match
      const normalizedVerse = this.normalizeForMatch(verse.text);

      if (normalizedVerse.includes(normalizedQ)) {
        score += 50;
        matchStart = normalizedVerse.indexOf(normalizedQ);
        // Bonus for exact word match (surrounded by space or start/end)
        const outputQ = normalizedQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (new RegExp(`(^|\\s)${outputQ}($|\\s)`).test(normalizedVerse)) {
          score += 20;
        }
      }

      // 3. Surah Name Match
      if (verse.surahName && this.normalizeForMatch(verse.surahName).includes(normalizedQ)) {
        score += 30;
        matchStart = 0;
      }

      if (score > 0) {
        const prevVerse = index > 0 ? allVerses[index - 1] : undefined;
        const nextVerse = index < allVerses.length - 1 ? allVerses[index + 1] : undefined;

        results.push({
          verse,
          index,
          matchStart,
          contextBefore: prevVerse ? prevVerse.text.slice(-35) : undefined,
          contextAfter: nextVerse ? nextVerse.text.slice(0, 35) : undefined,
          score
        });
      }
    });

    // Sort by score (descending)
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    this.searchResults.set(results);
  }

  jumpToSearchResult(result: SearchResult) {
    const mode = this.readingMode();
    if (mode === 'verse') {
      this.goToVerse(result.index);
    } else if (mode === 'mushaf') {
      if (result.verse.pageNumber) {
        this.mushafCurrentPage.set(result.verse.pageNumber);
      }
    } else {
      // Continuous: scroll to element
      const el = document.getElementById(`verse-${result.verse.number}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    this.showSearch.set(false);
  }

  // ═══════════ GO TO NAVIGATOR (Removed) ═══════════

  navigateToVerseIndex(idx: number) {
    const mode = this.readingMode();
    if (mode === 'verse') {
      this.goToVerse(idx);
    } else if (mode === 'mushaf') {
      const verse = this.verses()[idx];
      if (verse?.pageNumber) this.mushafCurrentPage.set(verse.pageNumber);
    } else {
      const verse = this.verses()[idx];
      const el = document.getElementById(`verse-${verse?.number}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ═══════════ FONT & THEME ═══════════

  increaseFontSize() {
    this.fontSize.update(s => Math.min(s + 2, 48));
    localStorage.setItem('quran-font-size', String(this.fontSize()));
  }

  decreaseFontSize() {
    this.fontSize.update(s => Math.max(s - 2, 16));
    localStorage.setItem('quran-font-size', String(this.fontSize()));
  }

  resetFontSize() {
    this.fontSize.set(26);
    localStorage.setItem('quran-font-size', '26');
  }

  toggleTheme() {
    this.isDarkMode.update(d => !d);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
    if (this.isDarkMode()) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  toggleTranslation() {
    this.showTranslation.update(v => !v);
  }

  // ═══════════ AUDIO ═══════════

  async playAudio(verse: Verse) {
    if (this.currentPlayingVerse() === verse.number && this.currentAudio && this.isPlaying()) {
      this.stopPlayback();
      return;
    }

    this.stopPlayback();

    const preferredReciter = this.reciterId();
    let audioUrl = await this.fetchAyahAudioUrl(verse.number, preferredReciter);
    let activeReciter = preferredReciter;

    if (!audioUrl && preferredReciter !== 'ar.alafasy') {
      audioUrl = await this.fetchAyahAudioUrl(verse.number, 'ar.alafasy');
      activeReciter = 'ar.alafasy';
      this.reciterId.set('ar.alafasy');
      localStorage.setItem('quran-reciter', 'ar.alafasy');
      this.triggerToast('القارئ المختار غير متاح لهذه الآية، تم التحويل للعفاسي');
    }

    if (!audioUrl) {
      this.triggerToast('تعذر تشغيل التلاوة حالياً');
      return;
    }

    this.currentAudio = new Audio(audioUrl);
    this.currentPlayingVerse.set(verse.number);
    this.isPlaying.set(true);

    this.currentAudio.onended = () => {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
    };

    this.currentAudio.onerror = () => {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
      this.triggerToast(activeReciter === preferredReciter ? 'تعذر تشغيل هذا القارئ الآن' : 'تعذر تشغيل التلاوة حالياً');
    };

    try {
      await this.currentAudio.play();
    } catch {
      this.isPlaying.set(false);
      this.currentAudio = null;
      this.currentPlayingVerse.set(null);
      this.triggerToast('تعذر تشغيل التلاوة حالياً');
    }
  }

  copyVerse(verse: Verse) {
    const surahLabel = verse.surahName || `سورة ${verse.surahNumber}`;
    const translationLine = verse.translationEn ? `\n\nEnglish translation:\n${verse.translationEn}` : '';
    navigator.clipboard.writeText(`${verse.text}\n— ${surahLabel} : ${verse.numberInSurah}${translationLine}`);
    this.triggerToast('تم نسخ الآية بنجاح');
  }

  // Regex matching standalone Waqf / pause marks (no Arabic letters)
  private readonly WAQF_MARK_RE = /^[\u06D6-\u06ED\u06DE\u06DF\u0600-\u0605\u0610-\u061A\u0640\u08D4-\u08E1\u08E3-\u08FF\uFDFD]+$/;

  // Check if a token is a standalone Waqf/pause mark (no letters)
  private isStandaloneWaqfMark(token: string): boolean {
    return this.WAQF_MARK_RE.test(token) || !this.normalizeForMatch(token);
  }

  getVerseWords(verse: Verse): string[] {
    const cached = this.verseWordsCache.get(verse.number);
    if (cached) return cached;
    let text = verse.text;

    // Strip Bismillah prefix from the first ayah of each Surah
    // (except Al-Fatiha #1 where it IS the ayah, and At-Tawba #9 which has no Bismillah)
    if (verse.numberInSurah === 1 && verse.surahNumber !== 1 && verse.surahNumber !== 9) {
      const bismillahPattern = /^[\ufeff]?\u0628\u0650\u0633\u0652\u0645\u0650\s+\u0671\u0644\u0644\u0651\u064e\u0647\u0650\s+\u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650\s+\u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650\s*/;
      text = text.replace(bismillahPattern, '').trim();
    }

    const rawTokens = text.split(/\s+/).filter(Boolean);

    // Merge standalone Waqf marks (e.g. ۚ ۖ ۗ) into the PRECEDING word.
    // alquran.cloud sometimes splits them as separate tokens, but quran.com
    // does not — so merging keeps the word count aligned with audio units.
    const words: string[] = [];
    for (const token of rawTokens) {
      if (this.isStandaloneWaqfMark(token) && words.length > 0) {
        // Attach to previous word
        words[words.length - 1] += ' ' + token;
      } else {
        words.push(token);
      }
    }

    this.verseWordsCache.set(verse.number, words);
    return words;
  }

  // Strip all diacritics/marks, keep only base Arabic letters + Alif Wasla
  private normalizeForMatch(text: string): string {
    return text
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u06DF-\u06E4\u06E7-\u06E8\u06EA-\u06EC\u0615-\u061A\u0640]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')  // أ إ آ ٱ → ا
      .replace(/\u0649/g, '\u064A')                       // ى → ي
      .replace(/\u0629/g, '\u0647')                       // ة → ه
      .replace(/[^\u0621-\u063A\u0641-\u064A]/g, '')
      .trim();
  }

  // Check if two normalized words are close enough to match
  private fuzzyMatch(a: string, b: string): boolean {
    if (a === b) return true;
    if (!a || !b) return false;
    // One contains the other
    if (a.startsWith(b) || a.endsWith(b) || b.startsWith(a) || b.endsWith(a)) return true;
    // Check character overlap >= 60%
    const longer = a.length >= b.length ? a : b;
    const shorter = a.length >= b.length ? b : a;
    let matches = 0;
    const used = new Array(longer.length).fill(false);
    for (const ch of shorter) {
      const pos = longer.indexOf(ch, 0);
      for (let k = 0; k < longer.length; k++) {
        if (!used[k] && longer[k] === ch) { used[k] = true; matches++; break; }
      }
    }
    return matches / longer.length >= 0.6;
  }

  // Build a mapping between display word indices and audio unit indices
  // using normalized text matching with look-ahead on mismatch
  private alignWords(
    displayWords: string[],
    audioUnits: Array<{ text: string; audioUrl: string }>
  ): { displayToAudio: Map<number, number>; audioToDisplay: Map<number, number> } {
    const displayToAudio = new Map<number, number>();
    const audioToDisplay = new Map<number, number>();

    // Pre-normalize all words
    const normDisplayArr = displayWords.map(w => this.normalizeForMatch(w));
    const normAudioArr = audioUnits.map(u => this.normalizeForMatch(u.text));

    let audioIdx = 0;
    const LOOK_AHEAD = 3;

    for (let dIdx = 0; dIdx < displayWords.length; dIdx++) {
      const normDisplay = normDisplayArr[dIdx];
      if (!normDisplay) continue; // skip pure marks (no letters)
      if (audioIdx >= audioUnits.length) break;

      const normAudio = normAudioArr[audioIdx];

      if (normDisplay === normAudio || this.fuzzyMatch(normDisplay, normAudio)) {
        // Direct or fuzzy match
        displayToAudio.set(dIdx, audioIdx);
        audioToDisplay.set(audioIdx, dIdx);
        audioIdx++;
      } else {
        // Look ahead in audio array for a match
        let found = false;
        for (let ahead = 1; ahead <= LOOK_AHEAD && audioIdx + ahead < audioUnits.length; ahead++) {
          if (normDisplay === normAudioArr[audioIdx + ahead] || this.fuzzyMatch(normDisplay, normAudioArr[audioIdx + ahead])) {
            // Skip unmatched audio units and jump to the match
            audioIdx = audioIdx + ahead;
            displayToAudio.set(dIdx, audioIdx);
            audioToDisplay.set(audioIdx, dIdx);
            audioIdx++;
            found = true;
            break;
          }
        }

        if (!found) {
          // Look ahead in display array — maybe the audio word matches a future display word
          // (display has an extra word the audio doesn't have). Don't advance audioIdx.
          let displayAhead = false;
          for (let ahead = 1; ahead <= LOOK_AHEAD && dIdx + ahead < displayWords.length; ahead++) {
            const futureNorm = normDisplayArr[dIdx + ahead];
            if (futureNorm && (futureNorm === normAudio || this.fuzzyMatch(futureNorm, normAudio))) {
              displayAhead = true;
              break;
            }
          }

          if (displayAhead) {
            // This display word has no audio counterpart — map to current audio but DON'T advance audioIdx
            displayToAudio.set(dIdx, audioIdx);
            // Don't set audioToDisplay so the real match gets it later
          } else {
            // True fallback: assign and advance
            displayToAudio.set(dIdx, audioIdx);
            if (!audioToDisplay.has(audioIdx)) {
              audioToDisplay.set(audioIdx, dIdx);
            }
            audioIdx++;
          }
        }
      }
    }

    return { displayToAudio, audioToDisplay };
  }

  async pronounceWord(word: string, verse: Verse, wordIndex: number) {
    if (!word.trim()) return;

    // If already playing, stop immediately (click-to-stop)
    if (this.wordPlaybackActive) {
      this.stopPlayback();
      return;
    }

    this.stopPlayback();
    const wordAudioUnits = await this.getWordAudioUnits(verse);
    if (!wordAudioUnits.length) {
      this.triggerToast('تعذر تشغيل نطق الكلمات');
      return;
    }

    const displayWords = this.getVerseWords(verse);

    let audioIdx: number;

    if (displayWords.length === wordAudioUnits.length) {
      // Counts match → direct 1:1 index
      audioIdx = wordIndex;
    } else {
      // Counts differ → find best match by normalized text
      const normClicked = this.normalizeForMatch(word);
      let bestIdx = -1;

      if (normClicked) {
        const expectedPos = Math.round(wordIndex * (wordAudioUnits.length / displayWords.length));
        let bestDist = Infinity;

        for (let i = 0; i < wordAudioUnits.length; i++) {
          const normAudio = this.normalizeForMatch(wordAudioUnits[i].text);
          if (normAudio === normClicked || normAudio.includes(normClicked) || normClicked.includes(normAudio)) {
            const dist = Math.abs(i - expectedPos);
            if (dist < bestDist) {
              bestDist = dist;
              bestIdx = i;
            }
          }
        }
      }

      audioIdx = bestIdx >= 0
        ? bestIdx
        : Math.round(wordIndex * (wordAudioUnits.length / displayWords.length));
    }

    // Clamp to valid range
    audioIdx = Math.max(0, Math.min(audioIdx, wordAudioUnits.length - 1));

    // Start continuous playback from clicked word through end of verse
    this.wordPlaybackActive = true;
    this.wordPlaybackAbort = false;
    this.currentPlayingVerse.set(verse.number);
    this.isPlaying.set(true);

    for (let i = audioIdx; i < wordAudioUnits.length; i++) {
      if (this.wordPlaybackAbort) break;

      // Highlight the corresponding display word
      let highlightIdx: number;
      if (displayWords.length === wordAudioUnits.length) {
        highlightIdx = i;
      } else {
        highlightIdx = Math.round(i * (displayWords.length / wordAudioUnits.length));
        highlightIdx = Math.min(highlightIdx, displayWords.length - 1);
      }
      this.currentPlayingWordIndex.set(highlightIdx);

      const unit = wordAudioUnits[i] as { text: string; audioUrl: string; fallbackUrl?: string };
      if (unit?.audioUrl) {
        try {
          await this.playWordAudio(unit.audioUrl);
        } catch {
          // Primary URL failed — try fallback (API's original URL)
          if (unit.fallbackUrl && unit.fallbackUrl !== unit.audioUrl) {
            try { await this.playWordAudio(unit.fallbackUrl); } catch { /* skip */ }
          }
        }
      }
    }

    this.wordPlaybackActive = false;
    this.isPlaying.set(false);
    this.currentPlayingVerse.set(null);
    this.currentPlayingWordIndex.set(null);
  }

  private playWordAudio(audioUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio = null; }
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onended = () => resolve();
      this.currentAudio.onerror = () => reject(new Error('Audio error'));
      this.currentAudio.play().catch(reject);
    });
  }

  stopPlayback() {
    this.wordPlaybackAbort = true;
    this.wordPlaybackActive = false;
    if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio = null; }
    this.isPlaying.set(false);
    this.currentPlayingVerse.set(null);
    this.currentPlayingWordIndex.set(null);
  }

  shareVerse(verse: Verse, platform: SharePlatform) {
    const surahLabel = verse.surahName || `سورة ${verse.surahNumber}`;
    const base = `${location.origin}/#/quran/juz/${this.juzNumber()}`;
    const text = `${verse.text}\n— ${surahLabel} : ${verse.numberInSurah}\n\n${base}`;
    const encoded = encodeURIComponent(text);
    const urls: Record<SharePlatform, string> = {
      whatsapp: `https://wa.me/?text=${encoded}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(base)}&text=${encoded}`,
      x: `https://x.com/intent/tweet?text=${encoded}`
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  }

  // ═══════════ BOOKMARKS ═══════════

  addBookmark(verse: Verse, type: BookmarkType) {
    const bookmark: SavedBookmark = {
      verseNumber: verse.number,
      type,
      surahName: verse.surahName,
      ayahInSurah: verse.numberInSurah,
      timestamp: Date.now()
    };
    this.savedBookmarks.update(items => {
      // Remove duplicate of same verse+type
      const filtered = items.filter(b => !(b.verseNumber === verse.number && b.type === type));
      const updated = [...filtered, bookmark];
      localStorage.setItem('quran-bookmarks-v2', JSON.stringify(updated));
      return updated;
    });
    const typeLabel = type === 'khatma' ? 'ختمة' : type === 'hifz' ? 'حفظ' : 'تدبر';
    this.triggerToast(`تم حفظ علامة "${typeLabel}" على الآية`);
  }

  removeBookmark(verseNumber: number, type: BookmarkType) {
    this.savedBookmarks.update(items => {
      const updated = items.filter(b => !(b.verseNumber === verseNumber && b.type === type));
      localStorage.setItem('quran-bookmarks-v2', JSON.stringify(updated));
      return updated;
    });
    this.triggerToast('تم إزالة العلامة المرجعية');
  }

  jumpToBookmark(b: SavedBookmark) {
    const idx = this.verses().findIndex(v => v.number === b.verseNumber);
    if (idx !== -1) {
      if (this.readingMode() === 'mushaf') {
        const v = this.verses()[idx];
        if (v.pageNumber) this.mushafCurrentPage.set(v.pageNumber);
      } else {
        this.goToVerse(idx);
        setTimeout(() => {
          const el = document.getElementById(`verse-${b.verseNumber}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      this.showBookmarksPanel.set(false);
    } else {
      this.triggerToast('هذه الآية موجودة في جزء آخر');
    }
  }

  isBookmarked(verseNumber: number): boolean {
    return this.savedBookmarks().some(b => b.verseNumber === verseNumber);
  }

  getBookmarkTypes(verseNumber: number): BookmarkType[] {
    return this.savedBookmarks()
      .filter(b => b.verseNumber === verseNumber)
      .map(b => b.type);
  }

  private loadBookmarks() {
    // v2 bookmarks
    const raw = localStorage.getItem('quran-bookmarks-v2');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SavedBookmark[];
        if (Array.isArray(parsed)) this.savedBookmarks.set(parsed);
      } catch { /* ignore */ }
    }
  }

  // ─── Auto-Bookmark / Last Read Position ───

  private saveReadingPosition() {
    const juz = this.juzNumber();
    const pos = { juz, verseIndex: this.currentVerseIndex(), scrollY: window.scrollY };
    localStorage.setItem('quran-last-read', JSON.stringify(pos));
  }

  private loadLastReadPosition() {
    const raw = localStorage.getItem('quran-last-read');
    if (raw) {
      try {
        const pos = JSON.parse(raw) as { juz: number; verseIndex: number; scrollY: number };
        this.lastReadPosition.set(pos);
      } catch { /* ignore */ }
    }
  }

  continueReading() {
    const pos = this.lastReadPosition();
    if (!pos) return;
    this.showContinueReading.set(false);

    if (pos.juz !== this.juzNumber()) {
      this.router.navigate(['/quran/juz', pos.juz]);
      return;
    }

    if (this.readingMode() === 'verse') {
      this.goToVerse(pos.verseIndex);
    } else {
      setTimeout(() => window.scrollTo({ top: pos.scrollY, behavior: 'smooth' }), 200);
    }
  }

  // ═══════════ PHASE 2: AUDIO ENHANCEMENTS ═══════════

  toggleContinuousPlay() {
    if (this.continuousPlay()) {
      this.continuousPlay.set(false);
      this.continuousAbort = true;
      this.stopPlayback();
    } else {
      this.continuousPlay.set(true);
      this.continuousAbort = false;
      // Start from current verse in verse mode, or first verse
      const startIdx = this.readingMode() === 'verse' ? this.currentVerseIndex() : 0;
      this.playContinuousFromIndex(startIdx);
    }
  }

  private async playContinuousFromIndex(startIdx: number) {
    const allVerses = this.verses();
    for (let i = startIdx; i < allVerses.length; i++) {
      if (this.continuousAbort || !this.continuousPlay()) break;

      const verse = allVerses[i];
      const repeat = this.repeatCount();

      for (let r = 0; r < repeat; r++) {
        if (this.continuousAbort) break;
        this.repeatRemaining.set(repeat - r);

        await this.playVerseAudioSync(verse);
        if (this.continuousAbort) break;
      }

      // Update verse-by-verse index
      if (this.readingMode() === 'verse') {
        this.currentVerseIndex.set(i);
      }
    }

    this.continuousPlay.set(false);
    this.repeatRemaining.set(0);
  }

  private playVerseAudioSync(verse: Verse): Promise<void> {
    return new Promise(async (resolve) => {
      const preferredReciter = this.reciterId();
      let audioUrl = await this.fetchAyahAudioUrl(verse.number, preferredReciter);
      if (!audioUrl) audioUrl = await this.fetchAyahAudioUrl(verse.number, 'ar.alafasy');

      if (!audioUrl) { resolve(); return; }

      if (this.currentAudio) { this.currentAudio.pause(); this.currentAudio = null; }
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.playbackRate = this.playbackSpeed();
      this.currentPlayingVerse.set(verse.number);
      this.isPlaying.set(true);

      this.currentAudio.onended = () => {
        this.isPlaying.set(false);
        this.currentPlayingVerse.set(null);
        resolve();
      };

      this.currentAudio.onerror = () => {
        this.isPlaying.set(false);
        this.currentPlayingVerse.set(null);
        resolve();
      };

      try {
        await this.currentAudio.play();
      } catch {
        this.isPlaying.set(false);
        this.currentPlayingVerse.set(null);
        resolve();
      }
    });
  }

  setPlaybackSpeed(speed: number) {
    this.playbackSpeed.set(speed);
    if (this.currentAudio) {
      this.currentAudio.playbackRate = speed;
    }
  }

  setRepeatCount(count: number) {
    this.repeatCount.set(Math.max(1, Math.min(count, 50)));
  }

  // ─── Sleep Timer ───

  startSleepTimer(minutes: number) {
    this.clearSleepTimer();
    this.sleepTimerMinutes.set(minutes);
    this.sleepTimerActive.set(true);
    this.sleepTimerRemaining.set(minutes * 60);

    this.sleepTimerInterval = setInterval(() => {
      this.sleepTimerRemaining.update(v => v - 1);
      if (this.sleepTimerRemaining() <= 0) {
        this.stopPlayback();
        this.continuousPlay.set(false);
        this.continuousAbort = true;
        this.clearSleepTimer();
        this.triggerToast('انتهى مؤقت النوم — تم إيقاف التلاوة');
      }
    }, 1000);

    this.triggerToast(`مؤقت النوم: ${minutes} دقيقة`);
  }

  clearSleepTimer() {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }
    this.sleepTimerActive.set(false);
    this.sleepTimerRemaining.set(0);
  }

  formatTimerDisplay(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  // ═══════════ PHASE 2: TADABBUR / NOTES ═══════════

  openNoteEditor(verseNumber: number) {
    this.activeNoteVerse.set(verseNumber);
    const existing = this.verseNotes().find(n => n.verseNumber === verseNumber);
    this.noteText.set(existing?.text || '');
    this.reflectionText.set(existing?.reflection || '');
  }

  closeNoteEditor() {
    this.activeNoteVerse.set(null);
    this.noteText.set('');
    this.reflectionText.set('');
  }

  saveNote() {
    const verseNumber = this.activeNoteVerse();
    if (!verseNumber) return;

    const note: VerseNote = {
      verseNumber,
      text: this.noteText(),
      reflection: this.reflectionText() || undefined,
      timestamp: Date.now()
    };

    this.verseNotes.update(notes => {
      const filtered = notes.filter(n => n.verseNumber !== verseNumber);
      const updated = [...filtered, note];
      localStorage.setItem('quran-notes', JSON.stringify(updated));
      return updated;
    });
    this.triggerToast('تم حفظ الملاحظة');
    this.closeNoteEditor();
  }

  deleteNote(verseNumber: number) {
    this.verseNotes.update(notes => {
      const updated = notes.filter(n => n.verseNumber !== verseNumber);
      localStorage.setItem('quran-notes', JSON.stringify(updated));
      return updated;
    });
    this.triggerToast('تم حذف الملاحظة');
  }

  hasNote(verseNumber: number): boolean {
    return this.verseNotes().some(n => n.verseNumber === verseNumber);
  }

  getNote(verseNumber: number): VerseNote | undefined {
    return this.verseNotes().find(n => n.verseNumber === verseNumber);
  }

  private loadNotes() {
    const raw = localStorage.getItem('quran-notes');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as VerseNote[];
        if (Array.isArray(parsed)) this.verseNotes.set(parsed);
      } catch { /* ignore */ }
    }
  }

  pickVerseOfTheDay() {
    const v = this.verses();
    if (!v.length) return;
    // Deterministic daily pick based on date + juz
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + this.juzNumber();
    const idx = seed % v.length;
    this.verseOfTheDay.set(v[idx]);
  }

  toggleReflectionPrompt() {
    this.showReflectionPrompt.update(v => !v);
  }

  // ═══════════ PHASE 2: MEMORIZATION ═══════════

  toggleMemorizationMode() {
    this.memorizationMode.update(v => !v);
    if (!this.memorizationMode()) {
      this.revealedVerses.set(new Set());
    }
  }

  toggleRevealVerse(verseNumber: number) {
    this.revealedVerses.update(set => {
      const newSet = new Set(set);
      if (newSet.has(verseNumber)) newSet.delete(verseNumber);
      else newSet.add(verseNumber);
      return newSet;
    });
  }

  isVerseRevealed(verseNumber: number): boolean {
    return this.revealedVerses().has(verseNumber);
  }

  // ─── Quick Test ───

  startQuickTest() {
    const v = this.verses();
    if (!v.length) return;
    this.quickTestMode.set(true);
    this.quickTestRevealed.set(false);
    const idx = Math.floor(Math.random() * v.length);
    this.quickTestVerse.set(v[idx]);
  }

  revealQuickTest() {
    this.quickTestRevealed.set(true);
  }

  nextQuickTest() {
    this.startQuickTest();
  }

  exitQuickTest() {
    this.quickTestMode.set(false);
    this.quickTestVerse.set(null);
    this.quickTestRevealed.set(false);
  }

  // ─── Memorization Playlist ───

  addToPlaylist(verse: Verse) {
    this.memorizationPlaylist.update(items => {
      if (items.some(i => i.verseNumber === verse.number)) return items;
      const updated = [...items, { verseNumber: verse.number, surahName: verse.surahName, ayahInSurah: verse.numberInSurah }];
      localStorage.setItem('quran-mem-playlist', JSON.stringify(updated));
      return updated;
    });
    this.triggerToast('تمت الإضافة لقائمة الحفظ');
  }

  removeFromPlaylist(verseNumber: number) {
    this.memorizationPlaylist.update(items => {
      const updated = items.filter(i => i.verseNumber !== verseNumber);
      localStorage.setItem('quran-mem-playlist', JSON.stringify(updated));
      return updated;
    });
  }

  isInPlaylist(verseNumber: number): boolean {
    return this.memorizationPlaylist().some(i => i.verseNumber === verseNumber);
  }

  private loadMemorizationPlaylist() {
    const raw = localStorage.getItem('quran-mem-playlist');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as MemorizationItem[];
        if (Array.isArray(parsed)) this.memorizationPlaylist.set(parsed);
      } catch { /* ignore */ }
    }
  }

  // ═══════════ UTILITY ═══════════

  setReciter(reciterId: string) {
    if (!this.reciters.some(r => r.id === reciterId)) return;
    this.reciterId.set(reciterId);
    localStorage.setItem('quran-reciter', reciterId);
    this.stopPlayback();
  }

  private normalizeArabicWord(value: string): string {
    return value
      .replace(/[\u064B-\u065F\u0670]/g, '')
      .replace(/[\u0622\u0623\u0625\u0671]/g, '\u0627')  // أ إ آ ٱ → ا
      .replace(/\u0649/g, '\u064A')                       // ى → ي
      .replace(/\u0629/g, '\u0647')                       // ة → ه
      .replace(/[^\u0621-\u063A\u0641-\u064A]/g, '')
      .trim();
  }

  private async fetchAyahAudioUrl(ayahNumber: number, reciterId: string): Promise<string | null> {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/${reciterId}`);
      if (!response.ok) return null;
      const payload = await response.json() as { data?: { audio?: string } };
      return payload.data?.audio ?? null;
    } catch { return null; }
  }

  private async getWordAudioUnits(verse: Verse): Promise<Array<{ text: string; audioUrl: string }>> {
    const cached = this.verseWordAudioCache.get(verse.number);
    if (cached) return cached;
    try {
      const verseKey = `${verse.surahNumber}:${verse.numberInSurah}`;
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,audio_url`);
      if (!response.ok) return [];
      const payload = await response.json() as {
        verse?: { words?: Array<{ char_type_name?: string; audio_url?: string | null; text_uthmani?: string }>; };
      };

      // Filter to only actual words (not end markers)
      const wordEntries = (payload.verse?.words ?? [])
        .filter((w) => w.char_type_name === 'word' && !!w.audio_url);

      // Build sequential audio URLs.
      // The CDN files are numbered sequentially (001, 002, 003...) for words only,
      // but the API's audio_url uses position numbers that include gaps for Waqf marks.
      // So we construct the correct sequential URL ourselves:
      //   wbw/{surah3}_{ayah3}_{seq3}.mp3
      const surahPad = String(verse.surahNumber).padStart(3, '0');
      const ayahPad = String(verse.numberInSurah).padStart(3, '0');

      const units = wordEntries.map((w, idx) => {
        const seqPad = String(idx + 1).padStart(3, '0');
        const seqUrl = `https://verses.quran.com/wbw/${surahPad}_${ayahPad}_${seqPad}.mp3`;
        // Keep the API URL as fallback
        const apiUrl = `https://verses.quran.com/${w.audio_url as string}`;
        return {
          text: w.text_uthmani ?? '',
          audioUrl: seqUrl,
          fallbackUrl: apiUrl
        };
      });

      this.verseWordAudioCache.set(verse.number, units);
      return units;
    } catch { return []; }
  }

  markAsCompleted() {
    const currentKhatmaId = this.khatmaId();
    const juz = this.juzNumber();
    if (!currentKhatmaId) {
      alert('تمت القراءة بنجاح. هذا الجزء غير مرتبط بختمة محددة.');
      return;
    }
    const khatma = this.khatmaService.getKhatmaById(currentKhatmaId)();
    const part = khatma?.parts.find(p => p.juzNumber === juz);
    if (!khatma || !part) {
      alert('تعذر تحديث حالة الجزء داخل الختمة.');
      return;
    }
    const completionName = this.readerName() || part.reservedBy || part.completedBy || 'قارئ';
    this.khatmaService.updatePartStatus(currentKhatmaId, juz, 'completed', completionName);
    alert('تم إتمام الجزء وتحديث الختمة، تقبل الله!');
    this.router.navigate(['/khatmat', currentKhatmaId]);
  }

  startAiRecording() { this.aiRecording.set(true); }
  stopAiRecording() { this.aiRecording.set(false); }

  getJuzName(juz: number): string {
    return this.khatmaService.getJuzName(juz);
  }

  getJuzSurahs(juz: number): string {
    const surahs = this.khatmaService.getJuzSurahs(juz);
    return surahs.length ? surahs.join('، ') : 'غير متاح';
  }

  private triggerToast(message: string) {
    this.toastMessage.set(message);
    this.showToast.set(true);
    setTimeout(() => this.showToast.set(false), 2200);
  }

  ngOnDestroy() {
    this.stopPlayback();
    this.saveReadingPosition();
    this.clearSleepTimer();
    this.continuousAbort = true;
    if (this.scrollDebouncer) clearTimeout(this.scrollDebouncer);
  }
}
