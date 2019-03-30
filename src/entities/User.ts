import { Column, Entity } from 'typeorm';
import { SerializedUser } from '../common/types';
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

  @Column()
  sessionToken: string;

  @Column()
  sessionExpiration: Date;

  @Column()
  refreshToken: string;

  serialize(): SerializedUser {
    return {
      ...super.serialize(),
      customerId: this.customerId,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      session: {
        sessionToken: this.sessionToken,
        sessionExpiration: this.sessionExpiration,
        refreshToken: this.refreshToken,
      },
    };
  }
}

export default User;
