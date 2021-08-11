import { NgModule } from '@angular/core';
import { DispComponent } from './component/disp/disp.component';
import { ListComponent } from './component/list/list.component';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ListComponent
  },
  {
    path: 'disp',
    component: DispComponent
  },
  {
    path: 'disp/:id',
    component: DispComponent
  }
];
@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes)
  ],
  declarations: []
})
export class AppRoutingModule { }
