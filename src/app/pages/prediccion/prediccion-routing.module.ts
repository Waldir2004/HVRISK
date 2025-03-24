import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrediccionComponent } from './prediccion/prediccion.component';

const routes: Routes = [
  { path: '', component: PrediccionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrediccionRoutingModule { }
