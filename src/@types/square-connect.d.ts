/* tslint:disable:variable-name */

declare module 'square-connect' {
  class Request {
    idempotency_key: string;
  }

  class Response {
    errors?: Error[];
  }

  type Error = {
    category: string,
    code: string,
    detail?: string,
    field?: string,
  };

  type Card = {
    id: string,
    card_brand?: string,
    last_4?: string,
    exp_month?: number,
    exp_year?: number,
    cardholder_name?: string,
  };

  type Customer = {
    id: string,
    given_name: string,
    family_name: string,
    email_address: string,
    phone_number: string,
    cards?: Card[],
  };

  type Money = {
    amount: number,
    currency: string,
  };

  class OrderLineItemTax {
    catalog_object_id: string;
    name?: string;
    percentage?: string;
  }

  class OrderLineItemModifier {
    catalog_object_id: string;
    name?: string;
    base_price_money?: Money;
    total_price_money?: Money;
  }

  class OrderLineItemDiscount {
    catalog_object_id: string;
    name?: string;
    'type'?: string;
    percentage?: string;
    amount_money?: Money;
    applied_money?: Money;
  }

  class OrderLineItem {
    catalog_object_id: string;
    name?: string;
    variation_name?: string;
    quantity: number;
    modifiers?: OrderLineItemModifier[];
    taxes?: OrderLineItemTax[];
    discounts?: OrderLineItemDiscount[];
    base_price_money?: Money;
    gross_sales_money?: Money;
    total_tax_money?: Money;
    total_discount_money?: Money;
    total_money?: Money;
  }

  class Order {
    id?: string;
    location_id: string;
    line_items: OrderLineItem[];
    taxes: OrderLineItemTax[];
    discounts: OrderLineItemDiscount[];
    total_tax_money?: Money;
    total_discount_money?: Money;
    total_money?: Money;
  }

  class Tender {
    id: string;
    transaction_id: string;
    amount_money?: string;
    tip_money?: string;
    processing_fee_money?: string;
    customer_id: string;
  }

  class Transaction {
    id?: string;
    order_id: string;
    tenders?: Tender[];
  }

  class CatalogItemModifierListInfo {
    modifier_list_id: string;
    min_selected_modifiers?: number;
    max_selected_modifiers?: number;
    enabled?: boolean;
  }

  class CatalogItem {
    name: string;
    description: string;
    variations: CatalogObject[];
    modifier_list_info: CatalogItemModifierListInfo[];
    tax_ids: string[];
  }

  class CatalogItemVariation {
    item_id: string;
    name: string;
    ordinal?: number;
    price_money: Money;
  }

  class CatalogTax {
    name: string;
    percentage: string;
  }

  class CatalogDiscount {
    name: string;
    discount_type: string;
    percentage?: string;
    amount_money?: Money;
  }

  class CatalogModifierList {
    name: string;
    selection_type: string;
    modifiers: CatalogObject[];
  }

  class CatalogModifier {
    name: string;
    price_money: Money;
  }

  class CatalogObject {
    'type': string;
    id: string;
    item_data?: CatalogItem;
    item_variation_data?: CatalogItemVariation;
    tax_data?: CatalogTax;
    discount_data?: CatalogDiscount;
    modifier_list_data?: CatalogModifierList;
    modifier_data?: CatalogModifier;
  }

  class BatchRetrieveOrdersRequest {
    order_ids: string[];
  }

  class BatchRetrieveOrdersResponse extends Response {
    orders?: Order[];
  }

  class CreateCustomerRequest extends Request {
    given_name: string;
    family_name: string;
    email_address: string;
    phone_number: string;
  }

  class CreateCustomerResponse extends Response {
    customer?: Customer;
  }

  class CreateCustomerCardRequest extends Request {
    customer_id: string;
    card_nonce: string;
  }

  class CreateCustomerCardResponse extends Response {
    card?: Card;
  }

  class CreateOrderRequest extends Request {
    order: Order;
  }

  class CreateOrderResponse extends Response {
    order?: Order;
  }

  class ChargeRequest extends Request {
    amount_money: Money;
    card_nonce?: string;
    customer_card_id?: string;
    customer_id?: string;
    order_id: string;
  }

  class ChargeResponse extends Response {
    transaction?: Transaction;
  }

  class ListCatalogRequest { }

  class ListCatalogResponse extends Response {
    objects: CatalogObject[];
  }

  class CatalogApi {
    listCatalog(req: ListCatalogRequest): ListCatalogResponse;
  }

  class CustomersApi {
    createCustomer(req: CreateCustomerRequest): CreateCustomerResponse;
    createCustomerCard(req: CreateCustomerCardRequest): CreateCustomerCardResponse;
  }

  class OrdersApi {
    createOrder(locationID: string, req: CreateOrderRequest): CreateOrderResponse;
    batchRetrieveOrders(
      locationID: string,
      req: BatchRetrieveOrdersRequest,
    ): BatchRetrieveOrdersResponse;
  }

  class TransactionsApi {
    charge(locationID: string, req: ChargeRequest): ChargeResponse;
  }

  class ApiClient {
    static instance: any;
  }
}
