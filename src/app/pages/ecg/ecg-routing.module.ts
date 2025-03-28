import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ECGComponent } from './ecg/ecg.component';

const routes: Routes = [
  { path: '', component: ECGComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ECGRoutingModule { }
