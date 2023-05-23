import { Identificacion } from "./identification";
import { Ubicacion } from "./location";
import { Product } from "./product";
import { Provider } from "./provider";

export interface Customer {
    Key?:             string;
    Contacto:         string;
    Fecha:            string;
    Identificacion:   Identificacion;
    IsDetal:          boolean;
    IsMan:            boolean;
    IsPersonaNatural: boolean;
    Nombre:           string;
    Origen:           Provider;
    Pago:             string;
    Productos:        Product[];
    Ubicacion:        Ubicacion;
}
