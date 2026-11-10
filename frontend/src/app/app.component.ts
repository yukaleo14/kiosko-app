import { Component, inject, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsuarioService } from './services/usuario.service';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  marcaActual: string = '.';
  nombreLocalActual: string = '';
  colorHeaderActual: string = '#E7E6FF';
  colorMarcaActual: string = '#000000';
  colorBotonesActual: string = '#000000';

  menuAbierto: boolean = false;

  private perfilSub?: Subscription;

  toggleMenu(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.menuAbierto && !this.elementRef.nativeElement.contains(event.target)) {
      this.menuAbierto = false;
    }
  }

  ngOnInit() {
    // Si hay un token válido, disparamos la carga inicial del perfil
    if (this.authService.getToken()) {
      this.usuarioService.cargarPerfil().subscribe();

    }
  }


  cerrarSesion(): void {
    this.menuAbierto = false; // Cerramos el menú
    this.usuarioService.limpiarPerfil();
    this.authService.logout();

    this.router.navigate(['/login']);
  }

  // Función que calcula el contraste óptimo
  obtenerColorContraste(hex: string): string {
    if (!hex) return '#000000';

    // Eliminamos el '#' inicial si existe
    hex = hex.replace('#', '');

    // Extraemos los valores RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Fórmula YIQ para calcular la percepción de luminosidad
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

    // Si el valor es mayor o igual a 128, el fondo es claro y retorna texto negro. 
    // De lo contrario, retorna texto blanco.
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  }

}
