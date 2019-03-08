import { Column, Entity } from 'typeorm';
import Base from './Base';

@Entity()
class User extends Base {
  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', unique: true })
  phoneNumber: string;
}

export default User;
