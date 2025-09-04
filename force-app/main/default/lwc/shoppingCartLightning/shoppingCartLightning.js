import { LightningElement, wire } from "lwc";
import getProducts from "@salesforce/apex/ShoppingCartController.getProducts";

export default class ShoppingCart extends LightningElement {
  products = [];
  error;
  displayState = {
    productBlock: false,
    cartBlock: false,
    invoiceBlock: false
  };

  @wire(getProducts)
  getProductsCallback({ error, data }) {
    if (data) {
      this.products = data.map((record) => {
        const copy = JSON.parse(JSON.stringify(record));
        copy.selectedQuantity = 0;
        return copy;
      });
      this.updateView(true, false, false);
    } else if (error) {
      this.error = error;
    }
  }

  goToCart({ detail }) {
    this.updateSelectedProducts(detail.selectedProducts);
    this.updateView(false, true, false);
  }

  goToProducts({ detail }) {
    this.updateSelectedProducts(detail.selectedProducts);
    this.updateView(true, false, false);
  }

  placeOrder({ detail }) {
    this.updateSelectedProducts(detail.selectedProducts);
    this.updateView(false, false, true);
  }

  updateSelectedProducts(selectedProducts) {
    const selectedIdToQuantityMap = {};
    selectedProducts.forEach((product) => {
      selectedIdToQuantityMap[product.Id] = product.selectedQuantity;
    });

    this.products.forEach((product) => {
      if (selectedIdToQuantityMap[product.Id]) {
        product.selectedQuantity = selectedIdToQuantityMap[product.Id];
      } else {
        product.selectedQuantity = 0;
      }
    });
  }

  updateView(productBlock, cartBlock, invoiceBlock) {
    this.displayState = {
      productBlock,
      cartBlock,
      invoiceBlock
    };
  }

  get cartProducts() {
    return this.products.filter((product) => product.selectedQuantity > 0);
  }
}
