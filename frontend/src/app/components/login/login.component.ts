import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private toast = inject(HotToastService);

  loginForm = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', Validators.required],
    recordar: [true]
  });

  ngOnInit(): void {
    // Si ya tiene sesión activa, redirigir automáticamente a consulta
    if (this.authService.getToken()) {
      this.router.navigate(['/consulta']);
      return;
    }

    // Precompletar el usuario guardado si existía previamente
    const usuarioRecordado = localStorage.getItem('kiosko_recordar_usuario');
    if (usuarioRecordado) {
      this.loginForm.patchValue({
        usuario: usuarioRecordado,
        recordar: true,
      });
    }
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.usuarioService.limpiarPerfil();
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usuario, password, recordar } = this.loginForm.value;
      const debeRecordar = !!recordar;

      this.authService.login({ usuario, password }, debeRecordar).subscribe({
        next: () => {
          if (debeRecordar && usuario) {
            localStorage.setItem('kiosko_recordar_usuario', usuario);
          } else {
            localStorage.removeItem('kiosko_recordar_usuario');
          }

          this.usuarioService.cargarPerfil().subscribe({
            next: () => {
              this.toast.success('¡Bienvenido! Sesión iniciada');
              this.router.navigate(['/consulta']);
            },
            error: (err) => console.error('Error al cargar colores:', err)
          });
        },
        error: () => this.toast.error('Credenciales incorrectas')
      });
    }
  }
}
