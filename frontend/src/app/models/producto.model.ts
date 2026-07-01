export interface Producto {
  id: number;
  nombre: string;
  codigo?: string;
  precio: number;
  stock: number;
  categoria?: string;
  activo: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

// Forma usada al crear/editar desde el formulario (sin campos generados por el backend)
export type ProductoForm = Omit<
  Producto,
  'id' | 'creadoEn' | 'actualizadoEn'
>;
