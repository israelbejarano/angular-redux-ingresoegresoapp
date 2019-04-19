import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private afBD: AngularFirestore, public authService: AuthService, private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.store.select('auth').pipe(filter(auth => auth.user != null))
      .subscribe(auth => this.ingresoEgresoItems(auth.user.uid));
  }

  private ingresoEgresoItems(uid: string) {
    this.afBD.collection(`${uid}/ingresos-egresos/items`)
      .valueChanges().subscribe(docData => {
        console.log(docData);
      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const usuario = this.authService.getUsuario();
    return this.afBD.doc(`${usuario.uid}/ingresos-egresos`).collection('items')
      .add({...ingresoEgreso});
  }
}
