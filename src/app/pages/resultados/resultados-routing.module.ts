import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultadosComponent } from './resultados/resultados.component';

const routes: Routes = [
  { path: '', component: ResultadosComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadosRoutingModule { }
