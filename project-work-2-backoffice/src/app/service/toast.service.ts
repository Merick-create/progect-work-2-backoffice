import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();
  private counter = 0;

  show(message: string, type: Toast['type'] = 'info', duration = 4500) {
    const toast: Toast = { id: ++this.counter, message, type };
    this.toasts.next([...this.toasts.value, toast]);
    if (duration > 0) setTimeout(() => this.dismiss(toast.id), duration);
  }

  success(m: string) { this.show(m, 'success'); }
  error(m: string) { this.show(m, 'error', 6000); }
  warning(m: string) { this.show(m, 'warning'); }
  info(m: string) { this.show(m, 'info'); }

  dismiss(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}
