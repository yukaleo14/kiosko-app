import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  mail: string;

  @Column({ type: 'varchar', unique: true })
  nombreLocal: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 2, default: 'DC' })
  marca: string;

  @Column({ type: 'varchar', default: '#E7E6FF' })
  colorHeader: string;

  @Column({ type: 'varchar', default: '#000000' })
  colorMarca: string;

  @Column({ type: 'varchar', default: '#000000' })
  colorBotones: string;
}