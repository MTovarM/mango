import { Provider } from "./provider";

export interface Product {
    Key?:             string;
    Codigo:           string;
    Ganancia:         number;
    Inversion:        number;
    Marca:            string;
    Nombre:           string;
    Nota:             string;
    Origen:           Provider;
    PrecioAntesIVA:   number;
    PrecioCompra:     number;
    PrecioVenta:      number;
    Tipo:             string;
    Unidades:         number;
    UnidadesVendidas: number;
}