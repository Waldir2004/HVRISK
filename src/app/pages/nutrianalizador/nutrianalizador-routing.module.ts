import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NutrianalizadorComponent } from './nutrianalizador/nutrianalizador.component';

const routes: Routes = [
  { path: '', component: NutrianalizadorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NutrianalizadorRoutingModule { }
