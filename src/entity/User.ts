import { Column, Entity } from 'typeorm';
import Base from './Base';

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
}

export default User;
