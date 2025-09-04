import { LightningElement, wire } from "lwc";
import getProducts from "@salesforce/apex/ShoppingCartController.getProducts";

export default class ShoppingCart extends LightningElement {
  error;
  allProductMap = {};
  cartProducts = [];
  displayState = {
    productBlock: false,
    cartBlock: false,
    invoiceBlock: false
  };

  @wire(getProducts)
  getProductsCallback({ error, data }) {
    if (data) {
      data.forEach((record) => {
        const copy = JSON.parse(JSON.stringify(record));
        copy.selectedQuantity = 0;
        this.allProductMap[record.Id] = copy;
      });
      this.showProductBlock();
    } else if (error) {
      this.error = error;
    }
  }

  goToCart({ detail }) {
    this.cartProducts = detail.selectedProducts;
    this.showCartBlock();
  }

  showProductBlock() {
    this.displayState = {
      productBlock: true,
      cartBlock: false,
      invoiceBlock: false
    };
  }

  showCartBlock() {
    this.displayState = {
      productBlock: false,
      cartBlock: true,
      invoiceBlock: false
    };
  }

  get products() {
    return [...Object.values(this.allProductMap)];
  }
}
