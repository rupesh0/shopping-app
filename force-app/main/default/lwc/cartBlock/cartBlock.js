import { api, LightningElement } from "lwc";
import { stringFormat } from "c/utils";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { COLUMNS } from "./constants";

export default class CartBlock extends LightningElement {
  @api get products() {
    return this._products;
  }
  set products(value) {
    this._products = JSON.parse(JSON.stringify(value));
  }

  _products = [];

  deleteFromCart(event) {
    const recId = event.detail.row.Id;
    const index = this.products.findIndex((product) => product.Id === recId);

    const toastEvent = new ShowToastEvent({
      title: this.products[index].Name,
      message: "Removed From Cart",
      variant: "success"
    });

    this._products.splice(index, 1);
    this._products = [...this._products];
    this.dispatchEvent(toastEvent);
  }

  updateCart({ detail }) {
    const updatedRows = detail.draftValues;

    updatedRows.forEach((element) => {
      const updatedQuantity = element.selectedQuantity;
      const productId = element.Id;
      const product = this.products.find((prod) => prod.Id === productId);

      if (updatedQuantity <= 0) {
        const event = new ShowToastEvent({
          title: product.Name,
          message: this.labels.invalid_negative_quantity,
          variant: "error"
        });
        this.dispatchEvent(event);
      } else if (updatedQuantity > product.QuantityAvailable__c) {
        const event = new ShowToastEvent({
          title: product.Name,
          message: this.labels.invalid_greater_than_available_quantity,
          variant: "error"
        });
        this.dispatchEvent(event);
      } else {
        product.selectedQuantity = updatedQuantity;
        const event = new ShowToastEvent({
          title: product.Name,
          message: this.labels.product_quantity_updated,
          variant: "success"
        });
        this.dispatchEvent(event);
      }
    });

    this.grid.draftValues = [];
  }

  goToProducts() {}

  placeOrder() {}

  get grid() {
    return this.template.querySelector("lightning-datatable");
  }

  get columns() {
    return COLUMNS;
  }

  get toolbarSubTitle() {
    return stringFormat(
      this.labels.common_label_x_items,
      this._products.length
    );
  }

  get labels() {
    return {
      common_label_x_items: "{0} items",
      common_label_cart: "Cart",
      common_label_go_to_products: "Go to products",
      common_label_place_order: "Place order",
      invalid_negative_quantity: "Selected Quantity Shoud Be greater than 0",
      invalid_greater_than_available_quantity:
        "Selected Quantity Shoud Be less than Available Quantity",
      product_quantity_updated: "Product Quantity Updated"
    };
  }
}
