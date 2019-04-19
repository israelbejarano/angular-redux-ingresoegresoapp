import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private afBD: AngularFirestore, public authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const usuario = this.authService.getUsuario();
    return this.afBD.doc(`${usuario.uid}/ingresos-egresos`).collection('items')
      .add({...ingresoEgreso});
  }
}
