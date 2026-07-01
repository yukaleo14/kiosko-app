import { Routes } from '@angular/router';
import { ProductoBuscarComponent } from './components/producto-buscar/producto-buscar.component';
import { ProductoListComponent } from './components/producto-list/producto-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'consulta', pathMatch: 'full' },
  { path: 'consulta', component: ProductoBuscarComponent },
  { path: 'productos', component: ProductoListComponent },
  { path: '**', redirectTo: 'consulta' },
];
