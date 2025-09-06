import { api, wire, LightningElement } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {
  getFieldDisplayValue,
  getFieldValue,
  getRecord
} from "lightning/uiRecordApi";
import { getRelatedListRecords } from "lightning/uiRelatedListApi";

import { PURCHASE_ORDER_ITEM_FIELDS, PURCHASE_ORDER_FIELDS } from "./schema";

export default class InvoiceBlock extends LightningElement {
  @api recordId;

  purchaseOrderData = {};
  purchaseOrderItems = [];
  activeSections = ["details", "items"];
  columns = [
    { label: this.labels.common_label_name, fieldName: "name", type: "text" },
    { label: this.labels.product_name, fieldName: "productName", type: "text" },
    { label: this.labels.quantity, fieldName: "quantity", type: "number" },
    {
      label: this.labels.price_per_unit,
      fieldName: "pricePerUnit",
      type: "currency"
    }
  ];

  @wire(getRecord, {
    recordId: "$recordId",
    fields: Object.values(PURCHASE_ORDER_FIELDS)
  })
  wiredRecord({ error, data }) {
    if (error) {
      let message = this.labels.common_label_unknown_error;
      if (Array.isArray(error.body)) {
        message = error.body.map((e) => e.message).join(", ");
      } else if (typeof error.body.message === "string") {
        message = error.body.message;
      }
      this.dispatchEvent(
        new ShowToastEvent({
          message,
          variant: "error"
        })
      );
    } else if (data) {
      this.purchaseOrderData = {
        label: getFieldValue(data, PURCHASE_ORDER_FIELDS.name),
        id: this.recordId,
        status: getFieldDisplayValue(data, PURCHASE_ORDER_FIELDS.status),
        orderPrice: getFieldValue(data, PURCHASE_ORDER_FIELDS.price)
      };
    }
  }

  @wire(getRelatedListRecords, {
    parentRecordId: "$recordId",
    relatedListId: "PurchaseOrderLineItems__r",
    fields: [
      "PurchaseOrderLineItems__c.Id",
      "PurchaseOrderLineItems__c.Name",
      "PurchaseOrderLineItems__c.quantity__c",
      "PurchaseOrderLineItems__c.Product__r.PricePerUnit__c",
      "PurchaseOrderLineItems__c.Product__r.Name"
    ],
    pageSize: 1999
  })
  listInfo({ error, data }) {
    if (data) {
      this.purchaseOrderItems = data.records.map((record) => {
        return {
          id: record.id,
          name: getFieldValue(record, PURCHASE_ORDER_ITEM_FIELDS.name),
          quantity: getFieldValue(record, PURCHASE_ORDER_ITEM_FIELDS.quantity),
          productName: getFieldValue(
            record,
            PURCHASE_ORDER_ITEM_FIELDS.productName
          ),

          pricePerUnit: getFieldValue(record, PURCHASE_ORDER_ITEM_FIELDS.price)
        };
      });

      console.log(this.purchaseOrderItems, data);
    } else if (error) {
      this.dispatchEvent(
        new ShowToastEvent({
          message: error,
          variant: "error"
        })
      );
    }
  }

  get labels() {
    return {
      order_summary: "Order Summary",
      common_label_x_items: "{0} items",
      common_label_unknown_error: "Unknown error",
      order_details: "Order Details",
      order_items: "Order Items",
      order_name: "Order Name",
      order_status: "Order Status",
      order_total_amount: "Total Amount",
      number_of_products: "Number of Products",
      common_label_name: "Name",
      product_name: "Product Name",
      quantity: "Quantity",
      price_per_unit: "Price Per Unit"
    };
  }
}
