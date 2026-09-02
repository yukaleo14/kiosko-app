
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  registerForm = this.fb.group({
    mail: ['', [Validators.required, Validators.email]],
    nombreLocal: ['', Validators.required],
    password: ['', [Validators.minLength(4)]]
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Usuario registrado correctamente');
          this.authService.login(this.registerForm.value).subscribe({
            next: () => {
              this.router.navigate(['/perfil']);
            },
            error: (err) => console.error('Error al cargar colores:', err)
          });
        },
        error: (err: any) => console.error('Error al registrar usuario:', err)
      });
    }
  }


}
