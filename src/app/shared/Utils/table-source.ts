// Importamos las clases necesarias
import { DataSource } from '@angular/cdk/table';
import { Observable, ReplaySubject } from 'rxjs';

// Definimos una clase que extiende DataSource
export class TableDataSource<T> extends DataSource<T> {

  // Creamos un ReplaySubject para almacenar los datos
  private _dataStream = new ReplaySubject<T[]>();

  constructor() {
    super();
  }

  // Implementamos el método connect de DataSource, que devuelve un Observable
  connect(): Observable<T[]> {
    return this._dataStream;
  }

  // Implementamos el método disconnect de DataSource
  disconnect() {}

  // Este método se llama para actualizar los datos
  setData(data: T[]): void {
    this._dataStream.next(data);
  }
}
