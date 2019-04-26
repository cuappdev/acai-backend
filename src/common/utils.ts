import { createHash, randomBytes } from 'crypto';
import moment from 'moment';
import {
  CatalogItem,
  CatalogItemModifierListInfo,
  CatalogModifierList,
  CatalogObject,
  CatalogTax,
  ListCatalogResponse,
} from 'square-connect';

import {
  CatalogOutput,
  ItemOutput,
  ItemVariationsOutput,
  ModifierListOutput,
  ModifiersOutput,
  Session,
  TaxOutput,
} from '../common/types';

const ITEM = 'ITEM';
const MODIFIER_LIST = 'MODIFIER_LIST';
const TAX = 'TAX';

const createSession = (): Session => ({
  sessionToken: generateToken(),
  sessionExpiration: moment().add(1, 'd').toDate(),
  refreshToken: generateToken(),
});

const extractAuthToken = (header: string): string => {
  const token = header.replace('Bearer', '').trim();
  if (!token) {
    throw new Error('Could not extract authentication token');
  }
  return token;
};

const generateHash = (input: string) =>
  createHash('sha256').update(input).digest('hex');

const generateToken = () => randomBytes(24).toString('hex');

const parseModifers = (modifiers: CatalogObject[]): ModifiersOutput => {
  const parsedModifiers = {};
  modifiers.forEach(({ id, modifier_data }) => {
    parsedModifiers[id] = {
      name: modifier_data.name,
      price: modifier_data.price_money.amount,
    };
  });
  return parsedModifiers;
};

const parseModifierList = ({ name, modifiers }: CatalogModifierList): ModifierListOutput => ({
  name,
  modifiers: parseModifers(modifiers),
});

const parseModifierListInfo = ({ modifier_list_id }: CatalogItemModifierListInfo): string =>
  modifier_list_id;

const parseVariations = (variations: CatalogObject[]): ItemVariationsOutput => {
  const parsedVariations = {};
  variations.forEach(({ id, item_variation_data }) => {
    parsedVariations[id] = {
      name: item_variation_data.name,
      price: item_variation_data.price_money.amount,
    };
  });

  return parsedVariations;
};

const parseItem = (
  { name, description, variations, modifier_list_info, tax_ids }: CatalogItem,
): ItemOutput => {
  if (modifier_list_info) {
    return {
      name,
      description,
      tax_ids,
      variations: parseVariations(variations),
      modifier_list_ids: modifier_list_info.map(parseModifierListInfo),
    };
  }
};

const parseTax = (tax: CatalogTax): TaxOutput => ({
  name: tax.name,
  percentage: tax.percentage,
});

const parseCatalog = ({ objects }: ListCatalogResponse): CatalogOutput => {
  const catalog = {
    items: {},
    modifier_lists: {},
    taxes: {},
  };
  objects.forEach(
    ({ 'type': objType, id, item_data, modifier_list_data, tax_data }: CatalogObject) => {
      switch (objType) {
        case ITEM:
          catalog.items[id] = parseItem(item_data);
          break;
        case MODIFIER_LIST:
          catalog.modifier_lists[id] = parseModifierList(modifier_list_data);
          break;
        case TAX:
          catalog.taxes[id] = parseTax(tax_data);
          break;
      }
    },
  );
  return catalog;
};

export default {
  createSession,
  extractAuthToken,
  generateHash,
  generateToken,
  parseCatalog,
};
