import { createHash, randomBytes } from 'crypto';
import moment from 'moment';
import { CatalogObject, ListCatalogResponse } from 'square-connect';

import squareAPI from '../common/squareAPI';
import { Session } from '../common/types';

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

const parseVariations = (variations) => {
  const parsedVariations = {};
  variations.forEach((variation) => {
    parsedVariations[variation.id] = {
      name: variation.item_variation_data.name,
      price: variation.item_variation_data.price_money.amount,
    };
  });

  return parsedVariations;
};

const parseModifierListIDs = (modifierLists) => {
  const parsedModifierLists = [];
  if (modifierLists) {
    modifierLists.forEach((modifierList) => {
      parsedModifierLists.push(modifierList.modifier_list_id);
    });
  }
  return parsedModifierLists;
};

const parseModifierIDs = (modifiers) => {
  const parsedModifierIDs = [];
  if (modifiers) {
    modifiers.forEach((modifier) => {
      parsedModifierIDs.push(modifier.id);
    });
  }
  return parsedModifierIDs;
};

const parseModifers = (modifiers) => {
  const parsedModifiers = {};
  modifiers.forEach((modifier) => {
    parsedModifiers[modifier.id] = {
      name: modifier.modifier_data.name,
      price: modifier.modifier_data.price_money.amount,
    };
  });
  return parsedModifiers;
};

const parseModifierList = (modifierList): Object => ({
  name: modifierList.name,
  modifier_ids: parseModifierIDs(modifierList.modifiers),
  modifiers: parseModifers(modifierList.modifiers),
});

const parseItem = (item): Object => ({
  name: item.name,
  description: item.description,
  variations: parseVariations(item.variations),
  modifier_lists: parseModifierListIDs(item.modifier_list_info),
  tax_ids: item.tax_ids,
});

const parseTax = (tax): Object => ({
  name: tax.name,
  percentage: tax.percentage,
});

const parseCatalog = async (): Promise<Object> => {
  const data: ListCatalogResponse = await squareAPI.fetchCatalog();
  const catalog = {
    items: {},
    modifier_lists: {},
    taxes: {},
  };

  data['objects'].forEach((object) => {
    switch (object.type) {
      case ITEM: {
        catalog.items[object.id] = parseItem(object.item_data);
        break;
      }
      case MODIFIER_LIST: {
        catalog.modifier_lists[object.id] = parseModifierList(object.modifier_list_data);
        break;
      }
      case TAX: {
        catalog.taxes[object.id] = parseTax(object.tax_data);
        break;
      }
      default: {
        break;
      }
    }
  });
  return catalog;
};

export default {
  createSession,
  extractAuthToken,
  generateHash,
  generateToken,
  parseCatalog,
};
