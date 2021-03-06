import { Column, Entity, OneToMany } from 'typeorm';
import { SerializedUser } from '../common/types';
import Base from './Base';
import Transaction from './Transaction';

@Entity('users')
class User extends Base {
  @Column({ unique: true })
  customerID: string;

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

  @OneToMany(type => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  serialize(): SerializedUser {
    return {
      ...super.serialize(),
      customerID: this.customerID,
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
