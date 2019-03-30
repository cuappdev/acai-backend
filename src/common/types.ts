export type SerializedBase = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
};

export type SerializedTransaction = SerializedBase & {
  status: string,
  total: number,
};

export type SerializedUser = SerializedBase & {
  customerId: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string,
  session: Session,
};

export type Session = {
  sessionToken: string,
  sessionExpiration: Date,
  refreshToken: string,
};
