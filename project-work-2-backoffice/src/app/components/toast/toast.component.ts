import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastService, Toast } from '../../service/toast.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  standalone: false
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  private destroyed$ = new Subject<void>();
  toasts: Toast[] = [];

  ngOnInit() {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(t => this.toasts = t);
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }
}
