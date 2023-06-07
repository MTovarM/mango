import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TableDataSource } from 'src/app/shared/Utils/table-source';
import { NumberCompareValidator } from 'src/app/shared/Validators/major-minor.validation';
import { CalculatorService } from 'src/app/shared/services/calculator.service';
import { FirebaseService } from 'src/app/Services/firebase.service';
import { DataManagerService } from 'src/app/Services/data-manager.service';
import { EMPTY, Observable, Subject, catchError, debounceTime, map, mergeMap, startWith, switchMap, takeUntil } from 'rxjs';
import { Product } from 'src/app/shared/models/product';
import { Provider } from 'src/app/shared/models/provider';
import { Purchase } from 'src/app/shared/models/purchase';
import { Customer } from 'src/app/shared/models/customer';
import { Table } from 'src/app/shared/enum/db-tables-enum';

interface PurchaseProduct {
  date: Date;
  code: string;
  name: string;
  annotations: string;
  brand: string;
  type: string;
  purchasePrice: number;
  priceWithoutIVA: number;
  salePrice: number;
  investmentPrice: number;
  units: number;
}

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.css']
})
export class PurchasesComponent {

  brandOptions: string[] = [];
  typeOptions: string[] = [];
  typeFilteredOptions: Observable<string[]> = new Observable<string[]>;
  brandFilteredOptions: Observable<string[]> = new Observable<string[]>;
  dataForm: UntypedFormGroup = new FormBuilder().group({});
  providerForm: UntypedFormGroup = new FormBuilder().group({});
  headerColumns: string[] = ['code', 'name', 'units', 'purchasePrice', 'investmentPrice'];
  columns: string[] = ['actions', ...this.headerColumns]
  columnsName = new Map<string, string>();
  products2Add: PurchaseProduct[] = [];
  tableSource = new TableDataSource<PurchaseProduct>();
  editing: boolean;

  private codes: string[] = [];
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private calculatorService: CalculatorService,
    private toastService: ToastrService,
    private dataManager: DataManagerService,
    private firebaseService: FirebaseService
  ) {
    this.editing = false;
  }

  ngOnInit() {
    this.initializingForms();
    this.defineColumnsName();
    this.priceWithoutIVA?.valueChanges.subscribe(() => this.calculateValues());
    this.units?.valueChanges.subscribe(() => this.calculateValues());
    this.code?.valueChanges.subscribe(() => {
      if (this.code?.hasError('sameCode')) {
        this.code?.setErrors({});
      }
    });

    this.typeFilteredOptions = this.type ? this.type?.valueChanges.pipe(debounceTime(300), startWith(''), map(value => {
      const filtered = this._typeFilter(value || '');
      if (filtered.length <= 0) {
        this.type?.setErrors({ invalidOption: true });
      }
      return filtered;
    })) : new Observable<string[]>;
    
    this.brandFilteredOptions = this.brand ? this.brand?.valueChanges.pipe(debounceTime(300), startWith(''), map(value => {
      const filtered = this._brandFilter(value || ''); 
      if (this._brandFilter(value).length <= 0) {
        this.brand?.setErrors({ invalidOption: true });
      }
      return filtered;
    })) : new Observable<string[]>;

    //Cragar código de productos
    this.dataManager.inventary$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: Product[]) => this.codes = data.map(p => p.Codigo));

    //Cargar marcas
    this.dataManager.brands$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        Object.values(data[0]).forEach((d) => {
          const option = d as string;
          if (!option.includes('-')) {
            this.brandOptions.push(option);
          }
        });
      });

    //cargar tipos
    this.dataManager.types$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        Object.values(data[0]).forEach((d) => {
          const option = d as string;
          if (!option.includes('-')) {
            this.typeOptions.push(option);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  typeDisplayFn(type: string): string {
    return type && type ? type : '';
  }

  /**
   * Guardar en base de datos
 */
  savePurchase(): void {
    //Lista Purchaseproductos
    // Proveedor
    let provider: Provider = {
      Nombre: this.providerName?.value.trim(),
      Contacto: this.providerContact?.value.trim()
    };
    let PurchaseproductList: Product[] = this.products2Add.map(p => {
      return {
        Codigo: p.code.trim(),
        Ganancia: 0,
        Inversion: p.investmentPrice,
        Marca: p.brand.trim(),
        Nombre: p.name.trim(),
        Nota: p.annotations?.trim(),
        Origen: provider,
        PrecioAntesIVA: p.priceWithoutIVA,
        PrecioCompra: p.purchasePrice,
        PrecioVenta: p.salePrice,
        Tipo: p.type.trim(),
        Unidades: p.units,
        UnidadesVendidas: 0
      }
    });
    //Compra
    let purchase: Purchase = {
      Fecha: new Date(),
      Total: this.getTotal(),
      Proveedor: provider,
      ListaProductos: PurchaseproductList.map(p => p.Codigo)
    };
    
    
    const saveProduct = new Subject<{
      product: Product,
      productName: string
    }>();

    saveProduct
    .pipe(
      takeUntil(this.ngUnsubscribe),
      mergeMap(d => this.firebaseService.putRegisters(d.product,Table.Inventary).pipe(catchError(e => EMPTY)))
    )
    .subscribe(response => {
    });

    
    PurchaseproductList.forEach(product => {
      saveProduct.next({product: product, productName: product.Nombre});
      
    });
    this.firebaseService.putRegisters(purchase, Table.Purchases).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap(response1 => this.firebaseService.putRegisters(provider, Table.Providers))
    ).subscribe(response2 => {
      if (response2.succcess) {
        this.toastService.success(`El información se guardó correctamente.` ,'Información');
      }
      this.dataManager.getInventary();
    });
  }

  /**
   * Calcular campos de precio
   */
  calculateValues(): void {
    const priceWithoutIVA = this.priceWithoutIVA?.value;
    const units = this.units?.value;

    //Precio compra
    this.purchasePrice?.setValue(this.calculatorService.productWithIva(priceWithoutIVA));
    //Precio venta
    this.salePrice?.setValue(this.calculatorService.salePrice(this.purchasePrice?.value));
    //Valor invertido
    this.investmentPrice?.setValue(this.calculatorService.invesmentPrice(this.purchasePrice?.value, units));
  }

  /**
   * Evento Añadir Purchaseproducto
   * @returns 
   */
  addProduct(): void {
    if (this.codeExist(this.code?.value)) {
      this.code?.setErrors({ sameCode: true });
      this.toastService.warning(
        'El código del producto que desea agregar ya existe.',
        'Código ya existe'
      );
      return;
    }
    this.codes.push(this.dataForm.value.code);
    this.products2Add.push(this.dataForm.value);
    this.tableSource.setData(this.products2Add);
    this.resetDataForm();
  }

  /**
   * Evento de eliminar fila
   * @param element 
   */
  deleteRow(element: PurchaseProduct): void {
    this.products2Add = this.products2Add.filter(p => p.code != element.code);
    this.tableSource.setData(this.products2Add);
  }

  /**
   * Evento cuando se edita fila
   * @param element 
   */
  editRow(element: PurchaseProduct): void {
    this.dataForm.setValue(element);
    this.editing = true;
    this.code?.disable();
  }

  /**
   * Evento cuando se guarda edición
   * @returns 
   */
  saveEdition(): void {
    debugger;
    this.editing = false;
    this.code?.enable();
    this.products2Add = this.products2Add.map(p => {
      if (p.code == this.code?.value) {
        return this.dataForm.value;
      }
      return p;
    });
    this.tableSource.setData(this.products2Add);
    this.resetDataForm();
  }

  /**
   * Evento cuando se cancela edición
   */
  cancelEdition(): void {
    this.editing = false;
    this.resetDataForm();
    this.code?.enable();
  }

  /**
   * Obtener total invertido
   * @returns Total Purchaseproductos
   */
  getTotal(): number {
    return this.products2Add.map(p => p.investmentPrice).reduce((acc, investmentPrice) => acc + investmentPrice, 0);

  }
  private _typeFilter(type: string): string[] {
    return this.typeOptions.filter(option => option.toLowerCase().trim().includes(type?.toLowerCase().trim()))
  }
  private _brandFilter(brand: string): string[] {
    return this.brandOptions.filter(option => option.toLowerCase().trim().includes(brand?.toLowerCase().trim()))
  }

  /**
   * Reset dataForm
   */
  private resetDataForm() {
    this.dataForm.reset({
      date: new Date()
    });
  }
  /**
   * Se definen los nombres de las columnas
   */
  private defineColumnsName() {
    this.columnsName.set('code', 'Código');
    this.columnsName.set('name', 'Nombre');
    this.columnsName.set('units', 'Unidades');
    this.columnsName.set('purchasePrice', 'Precio compra c/u');
    this.columnsName.set('investmentPrice', 'Valor invertido');
  }

  /**
   * Validar si código ya existe
   * @param code 
   * @returns 
   */
  private codeExist(code: string): boolean {
    if (this.codes?.find(p => p == code)) {
      return true;
    }
    return false;
  }

  /**
   * Creación formularios
   */
  private createForms(): void {
    this.dataForm = this.formBuilder.group({
      date: [new Date()],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      annotations: ['', [Validators.maxLength(50)]],
      brand: ['', [Validators.required]],
      type: ['', [Validators.required]],
      units: ['', [Validators.required, new NumberCompareValidator(1, 100000)]],
      priceWithoutIVA: ['', [Validators.required, new NumberCompareValidator(1, 1000000000)]],
      purchasePrice: ['', [Validators.required]],
      salePrice: ['', [Validators.required]],
      investmentPrice: ['', [Validators.required]],
    });

    this.providerForm = this.formBuilder.group({
      providerName: ['', [Validators.required]],
      providerContact: ['', [Validators.required]],
    });
  }

  /**
   * Inicializar formularios
   */
  private initializingForms(): void {
    this.createForms();

    // this.purchasePrice?.disable();
    // this.salePrice?.disable();
    // this.investmentPrice?.disable();
  }

  //Obtener valores
  get date() {
    return this.dataForm.get('date');
  }
  get code() {
    return this.dataForm.get('code');
  }
  get name() {
    return this.dataForm.get('name');
  }
  get annotations() {
    return this.dataForm.get('annotations');
  }
  get brand() {
    return this.dataForm.get('brand');
  }
  get type() {
    return this.dataForm.get('type');
  }
  get purchasePrice() {
    return this.dataForm.get('purchasePrice');
  }
  get priceWithoutIVA() {
    return this.dataForm.get('priceWithoutIVA');
  }
  get salePrice() {
    return this.dataForm.get('salePrice');
  }
  get investmentPrice() {
    return this.dataForm.get('investmentPrice');
  }
  get units() {
    return this.dataForm.get('units');
  }
  get providerName() {
    return this.providerForm.get('providerName');
  }
  get providerContact() {
    return this.providerForm.get('providerContact');
  }

}