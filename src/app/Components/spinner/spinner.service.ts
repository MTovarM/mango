import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  IsLoading$ = new Subject<boolean>();

  show(): void {
    this.IsLoading$.next(true);
  }

  hide(): void {
    this.IsLoading$.next(false);
  }

}
