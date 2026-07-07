import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  usuario = '';
  password = '';
  cargando = false;
  error = '';
  avisoSesionExpirada = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.avisoSesionExpirada = this.route.snapshot.queryParamMap.get('sesionExpirada') === '1';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


  onSubmit(): void {
    if (!this.usuario.trim() || !this.password.trim()) {
      return;
    }
    this.cargando = true;
    this.error = '';
    this.authService.login(this.usuario, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/productos']);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Usuario o contraseña incorrectos.';
      },
    });
  }
}
