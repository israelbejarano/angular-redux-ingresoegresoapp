import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit {

  forma: FormGroup;
  tipo = 'ingreso';

  constructor(public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.forma = new FormGroup({
      'descripcion': new FormControl('', Validators.required),
      'monto': new FormControl(0, Validators.min(0))
    });
  }

  crearIngresoEgreso() {
    const ingresoEgreso = new IngresoEgreso({...this.forma.value, tipo: this.tipo});
    console.log(ingresoEgreso);
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then(() => {
      this.forma.reset({monto: 0});
      Swal.fire('Creado', ingresoEgreso.descripcion, 'success');
    })
    .catch(error => {
      console.error(error)
    });
  }

}
