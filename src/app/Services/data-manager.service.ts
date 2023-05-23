import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Product } from '../shared/models/product';
import { Purchase } from '../shared/models/purchase';
import { Customer } from '../shared/models/customer';
import { Provider } from '../shared/models/provider';
import { Table } from '../shared/enum/db-tables-enum';

@Injectable({
  providedIn: 'root'
})
export class DataManagerService implements OnDestroy {

  private _inventary = new Subject<Product[]>();
  private _purchases = new Subject<Purchase[]>();
  private _customers = new Subject<Customer[]>();
  private _providers = new Subject<Provider[]>();
  private _brands = new Subject<any[]>();
  private _types = new Subject<any>();

  private ngUnsubscribe = new Subject<void>(); 

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnDestroy(): void {
    debugger;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get inventary$(): Observable<Product[]>{
    return this._inventary.asObservable();
  }

  get customers$(): Observable<Customer[]>{
    return this._customers.asObservable();
  }

  get brands$(): Observable<any[]>{
    return this._brands.asObservable();
  }

  get types$(): Observable<any>{
    return this._types.asObservable();
  }

  get purchases$(): Observable<Purchase[]>{
    return this._purchases.asObservable();
  }

  getInventary(): void {
    this.firebaseService.getAll(Table.Inventary)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: Product[]) => this._inventary.next(data));
  }

  getCustomers(): void {
    this.firebaseService.getAll(Table.Customer)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: Customer[]) => this._customers.next(data));
  }

  getPurchase(): void {
    this.firebaseService.getAll(Table.Purchases)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: Purchase[]) => this._purchases.next(data));
  }

  getBrands(): void {
    this.firebaseService.getAll(Table.Brands)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => this._brands.next(data));
  }

  getTypes(): void {
    this.firebaseService.getAll(Table.Types)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => this._types.next(data));
  }

  getProviders(): void {
    this.firebaseService.getAll(Table.Providers)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: Provider[]) => this._providers.next(data));
  }
}
