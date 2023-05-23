import { Provider } from "./provider";

export interface Purchase {
    Key?: string;
    Fecha: Date;
    ListaProductos: string[]; //Código de productos
    Proveedor: Provider;
    Total: number;
}
