import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
abstract class Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export default Base;
