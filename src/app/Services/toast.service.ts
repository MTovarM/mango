import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toast: ToastrService
  ) { }

    error(title: string, message: string): void {
      this.toast.error(title, message);
    }

    success(title: string, message: string): void {
      this.toast.success(title, message);
    }

    warning(title: string, message: string): void {
      this.toast.warning(title, message);
    }

    info(title: string, message: string): void {
      this.toast.info(title, message);
    }
}
