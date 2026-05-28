import { Directive, inject, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[ifAuthenticated]',
  standalone:false
})
export class IfAuthenticatedDirective implements OnInit, OnDestroy {

  private authSrv = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  private destroyed$ = new Subject<void>();

  ngOnInit() {
    this.authSrv.currentUser$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => {
        this.viewContainer.clear();
        if (user) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
