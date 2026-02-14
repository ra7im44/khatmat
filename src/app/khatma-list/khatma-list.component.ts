// Sample content (to be updated)
import { Component, Signal, computed } from '@angular/core';
import { KhatmaService } from './khatma.service';

@Component({
  selector: 'app-khatma-list',
  templateUrl: './khatma-list.component.html',
  styleUrls: ['./khatma-list.component.css']
})
export class KhatmaListComponent {
  searchQuery: Signal<string> = Signal.of('');
  khatmas: Khatma[] = [];

  constructor(private khatmaService: KhatmaService) {
    this.loadKhatmas();
  }

  loadKhatmas() {
    this.khatmaService.getKhatmas().subscribe({
      next: (data) => { this.khatmas = data; },
      error: (err) => console.error('Error loading khatmas:', err)
    });
  }

  trackByKhatmaId(index: number, khatma: Khatma): number {
    return khatma.id;
  }

  get filteredKhatmas() {
    const query = this.searchQuery.read();
    return this.khatmas.filter(khatma => 
      khatma.name ? khatma.name.includes(query) : false
    );
  }
}