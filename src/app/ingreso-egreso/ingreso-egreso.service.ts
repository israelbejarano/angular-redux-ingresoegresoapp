import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsListenerSubscription: Subscription = new Subscription();

  constructor(private afBD: AngularFirestore, public authService: AuthService, private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListenerSubscription = this.store.select('auth').pipe(filter(auth => auth.user != null))
      .subscribe(auth => this.ingresoEgresoItems(auth.user.uid));
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsListenerSubscription = this.afBD.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges().pipe(map(docData => {
        return docData.map(doc => {
          return {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      })).subscribe((coleccion: any[]) => {
        console.log(coleccion);
        this.store.dispatch(new SetItemsAction(coleccion));
      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const usuario = this.authService.getUsuario();
    return this.afBD.doc(`${usuario.uid}/ingresos-egresos`).collection('items')
      .add({...ingresoEgreso});
  }

  cancelarSubscription() {
    this.ingresoEgresoItemsListenerSubscription.unsubscribe();
    this.ingresoEgresoListenerSubscription.unsubscribe();
  }
}
