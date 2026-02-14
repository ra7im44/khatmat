import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-khatma-detail',
  templateUrl: './khatma-detail.component.html',
  styleUrls: ['./khatma-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhatmaDetailComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  loading = false;
  data: any;

  constructor(private khatmaService: KhatmaService) {}

  ngOnInit() {
    this.loading = true;
    this.khatmaService.getData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          this.data = result;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching data', error);
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}