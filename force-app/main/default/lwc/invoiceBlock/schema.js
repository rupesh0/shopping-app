import PURCHASE_ORDER_ID from "@salesforce/schema/PurchaseOrder__c.Id";
import PURCHASE_ORDER_NAME from "@salesforce/schema/PurchaseOrder__c.Name";
import PURCHASE_ORDER_STATUS from "@salesforce/schema/PurchaseOrder__c.OrderStatus__c";
import PURCHASE_ORDER_PRICE from "@salesforce/schema/PurchaseOrder__c.OrderPrice__c";

import PURCHASE_LINE_ITEM_ID from "@salesforce/schema/PurchaseOrderLineItems__c.Id";
import PURCHASE_LINE_ITEM_NAME from "@salesforce/schema/PurchaseOrderLineItems__c.Name";
import PURCHASE_LINE_ITEM_QUANTITY from "@salesforce/schema/PurchaseOrderLineItems__c.quantity__c";
import PURCHASE_LINE_ITEM_PRODUCT_ID from "@salesforce/schema/PurchaseOrderLineItems__c.Product__c";

import PURCHASE_LINE_ITEM_PRICE from "@salesforce/schema/PurchaseOrderLineItems__c.Product__r.PricePerUnit__c";
import PURCHASE_LINE_ITEM_PRODUCT_NAME from "@salesforce/schema/PurchaseOrderLineItems__c.Product__r.Name";

export const PURCHASE_ORDER_FIELDS = {
  id: PURCHASE_ORDER_ID,
  name: PURCHASE_ORDER_NAME,
  status: PURCHASE_ORDER_STATUS,
  price: PURCHASE_ORDER_PRICE
};

export const PURCHASE_ORDER_ITEM_FIELDS = {
  id: PURCHASE_LINE_ITEM_ID,
  name: PURCHASE_LINE_ITEM_NAME,
  quantity: PURCHASE_LINE_ITEM_QUANTITY,
  productId: PURCHASE_LINE_ITEM_PRODUCT_ID,
  productName: PURCHASE_LINE_ITEM_PRODUCT_NAME,
  price: PURCHASE_LINE_ITEM_PRICE
};
