import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ToastService } from './toast.service';
import { signal, computed } from '@angular/core';

@Component({
  selector: 'app-khatma-card',
  templateUrl: './khatma-card.component.html',
  styleUrls: ['./khatma-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KhatmaCardComponent {
  // Using signals to manage the state of the toast
  toastVisible = signal(false);

  // Computed properties to calculate values dynamically
  get toastMessage(): string {
      return this.toastVisible() ? 'Toast is now visible' : 'Toast is hidden';
  }

  constructor(private toastService: ToastService) {}

  // Improve type safety in method signatures
  showToast(): void {
    this.toastVisible.set(true);
    this.toastService.displayToast(this.toastMessage);
  }

  hideToast(): void {
    this.toastVisible.set(false);
  }
}