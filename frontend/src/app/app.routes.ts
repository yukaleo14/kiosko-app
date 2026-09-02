import { Routes } from '@angular/router';
import { ProductoBuscarComponent } from './components/producto-buscar/producto-buscar.component';
import { ProductoListComponent } from './components/producto-list/producto-list.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegistroComponent } from './registro/registro.component';
import { PerfilComponent } from './perfil/perfil.component';


export const routes: Routes = [
  // Si entra a la raíz, intenta ir a consulta
  { path: '', redirectTo: 'consulta', pathMatch: 'full' },
  
  { 
    path: 'consulta', 
    component: ProductoBuscarComponent,
    canActivate: [authGuard] // <-- AGREGADO: Ahora la consulta requiere sesión
  },
  
  { path: 'login', component: LoginComponent }, //
  { path: 'registro', component: RegistroComponent }, //[cite: 22]

  {path: 'perfil', component: PerfilComponent, canActivate: [authGuard]},
  
  {
    path: 'productos',
    component: ProductoListComponent,
    canActivate: [authGuard], // protegida: solo kioskos logueados[cite: 22]
  },
  
  // Cualquier otra URL no reconocida redirige al login[cite: 22]
  { path: '**', redirectTo: 'login' },
];
