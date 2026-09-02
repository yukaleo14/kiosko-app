import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private usuarioService = inject(UsuarioService);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) { }

  private fb = inject(FormBuilder);


  loginForm = this.fb.group({
    mail: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioService.limpiarPerfil();
    this.router.navigate(['/login']);
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.usuarioService.cargarPerfil().subscribe({
            next: () => {
              alert('Login correcto');
              this.router.navigate(['/productos']);
            },
            error: (err) => console.error('Error al cargar colores:', err)
          });
        },
        error: () => alert('Credenciales incorrectas')
      });
    }
  }
}
