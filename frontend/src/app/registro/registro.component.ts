import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private toast = inject(HotToastService);

  cargando = false;

  registerForm = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    nombreLocal: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid || this.cargando) {
      return;
    }

    this.cargando = true;
    const { usuario, password } = this.registerForm.value;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.toast.success('Usuario registrado correctamente');
        this.authService.login({ usuario, password }).subscribe({
          next: () => {
            this.usuarioService.cargarPerfil().subscribe({
              next: () => {
                this.cargando = false;
                this.router.navigate(['/perfil']);
              },
              error: (err) => {
                this.cargando = false;
                console.error('Error al cargar perfil tras registro:', err);
              }
            });
          },
          error: (err) => {
            this.cargando = false;
            console.error('Error al iniciar sesión tras registro:', err);
          }
        });
      },
      error: (err: any) => {
        this.cargando = false;
        if (err.status === 409) {
          this.toast.error('El nombre de usuario ya existe. Por favor elegí otro.');
        } else {
          this.toast.error('Error al registrar usuario. Verifique los datos.');
        }
      }
    });
  }
}
