import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Directive({
  selector: '[appIfRole]',
  standalone: false
})
export class IfRoleDirective {

private authSrv = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  private destroyed$ = new Subject<void>();
  private requiredRole?: string;

  @Input('appIfRole') set role(value: string | undefined) {
    this.requiredRole = value;
  }

  ngOnInit() {
  this.authSrv.currentUser$
    .pipe(takeUntil(this.destroyed$))
    .subscribe(user => {
      this.viewContainer.clear();
      if(user){ 
        if (!this.requiredRole || user.role === this.requiredRole) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
