import { LightningElement, track } from 'lwc';
import placeOrder from "@salesforce/apex/ShoppingCartControllerLightning.placeOrder";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pubsub from "c/pubsub";
const fields = [
    { label: 'Product Name ', fieldName: 'Name', sortable : true },
    { label: 'Product Code', fieldName: 'ProductCode', sortable : true },
    { label: 'Price Per Unit', fieldName: 'PricePerUnit__c', sortable : true },
    { label: 'Quantity', fieldName: 'Quantity', sortable : true },
    { label: 'Total', fieldName: 'Total', sortable : true }
    ];

export default class InvoiceBlock extends LightningElement {
    @track selectedProducts = [];
    fields = fields;
    sortBy;
    sortDirection;
    totalPrice = 0;
    @track cartMapObj;
    connectedCallback(){
        pubsub.register('setProductsInInvoice', this.setSelectedProducts.bind(this));
        pubsub.fire('getProductsInInvoice', {});
    }
    setSelectedProducts = function(allProducts){
        this.selectedProducts = allProducts['products'];
        this.totalPrice = 0;
        this.selectedProducts.forEach(product => {
            product['Total'] = product['Quantity'] * product['PricePerUnit__c'];
            this.totalPrice += product['Total'];
        });
    }
    handleSortResult =  function(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        let isReverse = this.sortDirection === 'asc' ? 1 : -1;
        let sortResult = Object.assign([], this.selectedProducts);
        this.selectedProducts =  sortResult.sort( (a,b) => {
            if(a[this.sortBy] > b[this.sortBy]){
              return isReverse ;
            }else{
              return -1*isReverse ;
            }
        });
    }
    placeOrder = function(){
        this.cartMapObj = {};
        this.selectedProducts.forEach(product => {
            this.cartMapObj[product.Id] = product['Quantity'] ;
        });
        placeOrder({ cartMap : this.cartMapObj })
          .then(result => {
              const event = new ShowToastEvent({
                  title: 'Congratulation',
                  message: 'Your Order has been Placed',
                  variant: 'success'
              });
              this.dispatchEvent(event);
              window.close();          
          })
          .catch(error => {
            const event = new ShowToastEvent({
                title: 'Soory',
                message: 'Error Occure While Placing Order'+ error,
                variant: 'error'
            });
            this.dispatchEvent(event);
            window.close();
        });
    }
}