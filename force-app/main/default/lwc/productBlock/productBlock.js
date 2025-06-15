import { LightningElement, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { COLUMNS } from "./constants";

export default class ProductBlock extends LightningElement {
  @api
  get products() {
    return this._products;
  }
  set products(value) {
    this._products = JSON.parse(JSON.stringify(value));
  }

  _products = [];
  sortBy;
  sortDirection;
  searchKey;
  selectedIdToQuantityMap = {};

  searchProduct(event) {
    this.searchKey = event.target.value;
  }

  handleSortResult(event) {
    this.sortBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    const isReverse = this.sortDirection === "asc" ? 1 : -1;

    this._products = this._products.sort((a, b) => {
      if (a[this.sortBy] > b[this.sortBy]) {
        return isReverse;
      }
      return -1 * isReverse;
    });
    this.refreshGridRecords();
  }

  addToCart() {
    const selectedRows = this.grid.getSelectedRows();
    selectedRows.forEach((row) => {
      const product = this.products.find((prod) => prod.Id === row.Id);

      if (product.QuantityAvailable__c > product.selectedQuantity) {
        product.selectedQuantity++;
        const event = new ShowToastEvent({
          title: product.Name,
          message: this.labels.common_label_added_to_cart,
          variant: "success"
        });
        this.dispatchEvent(event);
      } else {
        const event = new ShowToastEvent({
          title: product.Name,
          message: this.labels.common_label_out_of_stock,
          variant: "error"
        });
        this.dispatchEvent(event);
      }
    });
    this.grid.selectedRows = [];
    this.refreshGridRecords();
  }

  refreshGridRecords() {
    this.grid.data = this.productsToDisplay;
  }

  get columns() {
    return COLUMNS;
  }

  get productsToDisplay() {
    if (this.searchKey) {
      return this.products.filter((product) => {
        return product.Name.toLowerCase().includes(
          this.searchKey.toLowerCase()
        );
      });
    }
    return this.products;
  }

  get grid() {
    return this.template.querySelector("lightning-datatable");
  }

  get labels() {
    return {
      common_label_products : 'Products',
      common_label_add_to_cart: 'Add to cart',
      common_label_out_of_stock: 'Out of stock',
      common_label_added_to_cart : 'Added to cart',
      search_product_placeholder : 'Search Products...'
    }
  }
}
