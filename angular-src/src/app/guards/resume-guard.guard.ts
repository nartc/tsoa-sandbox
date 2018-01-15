import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import swal, {SweetAlertDismissalReason, SweetAlertOptions} from 'sweetalert2';

@Injectable()
export class ResumeGuardGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const swalOptions: SweetAlertOptions = {
      title: 'Oops',
      text: 'This section is not available in this version.',
      confirmButtonText: 'View my Resume',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
      type: 'error'
    };

    swal(swalOptions)
      .then((result: SweetAlertResult) => {
        if (result.value) {
          this.router.navigate(['/resume']);
        } else if (result.dismiss) {
          console.log('--> Reason: ', result.dismiss);
        }
      });

    return false;
  }
}

export interface SweetAlertResult {
  value?: boolean,
  dismiss?: SweetAlertDismissalReason
}
