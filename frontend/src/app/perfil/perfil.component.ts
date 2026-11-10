import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private toast = inject(HotToastService);

  private perfilSub?: Subscription;

  perfilForm = this.fb.group({
    nombreLocal: ['', Validators.required],
    // Limitamos a 2 caracteres directamente en las validaciones
    marca: ['', [Validators.required, Validators.maxLength(2)]],
    colorHeader: ['', Validators.required],
    colorMarca: ['', Validators.required],
  });

  ngOnInit(): void {

    this.perfilSub = this.usuarioService.perfil$.subscribe(perfil => {
      if (perfil) {
        this.perfilForm.patchValue({
          nombreLocal: perfil.nombreLocal,
          marca: perfil.marca,
          colorHeader: perfil.colorHeader,
          colorMarca: perfil.colorMarca,
        });
      } else {
        // Si no hay perfil, podemos limpiar el formulario o establecer valores por defecto
        this.usuarioService.cargarPerfil().subscribe();
      }
    });
  }

  ngOnDestroy(): void {
    this.perfilSub?.unsubscribe();
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      const datosActualizados = {
        nombreLocal: this.perfilForm.value.nombreLocal ?? '',
        marca: this.perfilForm.value.marca ?? 'ej',
        colorHeader: this.perfilForm.value.colorHeader ?? '#FFFFFF',
        colorMarca: this.perfilForm.value.colorMarca ?? '#000000'
      };

      this.usuarioService.actualizarPerfil(datosActualizados).subscribe({
        next: () => {
          this.toast.success('Perfil actualizado con éxito');
        },
        error: (err) => {
          console.error('Error al actualizar el perfil:', err);
          this.toast.error('Hubo un error al actualizar el perfil. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }

  obtenerColorContraste(hex: string): string {
    if (!hex) return '#000000';
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#FFFFFF';
  }
}
