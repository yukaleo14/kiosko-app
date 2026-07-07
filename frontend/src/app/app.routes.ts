import { Routes } from '@angular/router';
import { ProductoBuscarComponent } from './components/producto-buscar/producto-buscar.component';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'consulta', pathMatch: 'full' },
  { path: 'consulta', component: ProductoBuscarComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'productos',
    component: ProductoListComponent,
    canActivate: [authGuard], // protegida: solo la dueña logueada
  },
  { path: '**', redirectTo: 'consulta' },
];
