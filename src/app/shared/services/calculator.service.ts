import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  //Variables de configuración
  private gainMargin: number = 0.20;
  private iva: number = 0.19; 

  constructor() { }

  ivaValue(value: number): number {
    value = value ? value: 0;
    return +(value * this.iva).toFixed(2);
  }

  productWithIva(value: number): number {
    value = value ? value: 0;
    return +(value + (value*this.iva)).toFixed(2);
  }

  salePrice(value: number): number {
    value = value ? value: 0;
    return +(value + (value * this.gainMargin)).toFixed(2);
  }

  invesmentPrice(value: number, units: number): number {
    value = value ? value: 0;
    units = units ? units: 0;
    return +(value * units).toFixed(2);
  }

}
