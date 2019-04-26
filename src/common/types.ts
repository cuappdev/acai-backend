export type ItemInput = {
  id: string,
  quantity: number,
  modifiers: string[],
};

export type ItemVariationOutput = {
  name: string,
  price: number,
};

export type ItemVariationsOutput = {
  [id: string]: ItemVariationOutput,
};

export type ItemOutput = {
  name: string,
  description: string,
  variations: ItemVariationsOutput,
  modifier_list_ids: string[],
  tax_ids: string[],
};

export type ModifierOutput = {
  name: string,
  price: number,
};

export type ModifiersOutput = {
  [id: string]: ModifierOutput,
};

export type ModifierListOutput = {
  name: string,
  modifiers: ModifiersOutput,
};

export type TaxOutput = {
  name: string,
  percentage: string,
};

export type CatalogOutput = {
  items: { [id: string]: ItemOutput },
  modifier_lists: { [id: string]: ModifierListOutput },
  taxes: { [id: string]: TaxOutput },
};

export type SerializedBase = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
};

export type SerializedTransaction = SerializedBase & {
  orderID: string,
  status: string,
  total: number,
};

export type SerializedUser = SerializedBase & {
  customerID: string,
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
