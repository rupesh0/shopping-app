import { LightningElement } from 'lwc';

export default class ShoppingCart extends LightningElement {
    productBlock = false;
    cartBlock = true;
    invoiceBlock = true;
    invoiceNumber = Math.ceil(Math.random()*1000000);
    showCart = function () {
      this.productBlock = true;
      this.cartBlock = false;
      this.invoiceBlock = true;
    }
    showProducts = function(){
      this.productBlock = false;
      this.cartBlock = true;
    }
    showInvoice = function(){
      this.invoiceBlock = false;
      this.cartBlock = true;
    }
}