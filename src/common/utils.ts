import { createHash, randomBytes } from 'crypto';
import moment from 'moment';
import { CatalogObject, ListCatalogResponse } from 'square-connect';

import { Session } from '../common/types';
import squareAPI from '../common/squareAPI';

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
  let parsedVariations = {};
  variations.forEach(variation => {
    parsedVariations[variation.id] = {
      name: variation.item_variation_data.name,
      price: variation.item_variation_data.price_money.amount
    };
  });

  return parsedVariations;
};

const parseModifierListIDs = (modifier_lists) => {
  let parsedModifierLists = [];
  if (modifier_lists != undefined) {
    modifier_lists.forEach(modifier_list => {
      parsedModifierLists.push(modifier_list.modifier_list_id);
    });
  }
  return parsedModifierLists;
};

const parseModifierIDs = (modifiers) => {
  let parsedModifierIDs = [];
  if (modifiers != undefined) {
    modifiers.forEach(modifier => {
      parsedModifierIDs.push(modifier.id)
    });
  }
  return parsedModifierIDs;
}

const parseModifers = (modifiers) => {
  let parsedModifiers = {};
  modifiers.forEach(modifier => {
    parsedModifiers[modifier.id] = {
      name: modifier.modifier_data.name,
      price: modifier.modifier_data.price_money.amount
    }
  });
  return parsedModifiers;
};

const parseModifierList = (modifier_list): Object => ({
  name: modifier_list.name,
  modifier_ids: parseModifierIDs(modifier_list.modifiers),
  modifiers: parseModifers(modifier_list.modifiers)
});

const parseItem = (item): Object => ({
  name: item.name,
  description: item.description,
  variations: parseVariations(item.variations),
  modifier_lists: parseModifierListIDs(item.modifier_list_info)
});

const parseCatalog = async (): Promise<Object> => {
  let data: ListCatalogResponse = await squareAPI.fetchCatalog();
  let catalog = {
    items: {},
    modifier_lists: {},
    categories: {},
    discounts: {},
    taxes: {},
  };

  data['objects'].forEach(object => {
    console.log(object.type);
    switch (object.type) {
      case 'ITEM': {
        catalog.items[object.id] = parseItem(object.item_data);
        break;
      }
      case 'MODIFIER_LIST': {
        catalog.modifier_lists[object.id] = parseModifierList(object.modifier_list_data);
        break;
      }
      case 'CATEGORY': {
        break;
      }
      case 'DISCOUNT': {
        break;
      }
      case 'TAX': {
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
