export class IngresoEgreso {
    descripcion: string;
    monto: number;
    tipo: string;
    uid?: string;

    constructor(obj: DataObj) {
        this.descripcion = obj && obj.descripcion || null;
        this.monto = obj && obj.monto || null;
        this.tipo = obj && obj.tipo || null;
        // this.uid = obj && obj.uid || null; // no se usa y asi no mete null en firebase
    }
}

interface DataObj {
    descripcion: string;
    monto: number;
    tipo: string;
    uid?: string;
}
