import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Base, { SerializedBase } from './Base';

export type SerializedUser = SerializedBase & {
  customerId: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
};

@Entity('users')
class User extends Base {
  @Column({ unique: true })
  customerId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ unique: true })
  phoneNumber: string;

  serialize(): SerializedUser {
    return {
      ...super.serialize(),
      customerId: this.customerId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
    };
  }
}

export default User;
