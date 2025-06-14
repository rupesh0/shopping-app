import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import pubsub from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';
import getProducts from '@salesforce/apex/ShoppingCartControllerLightning.getProducts';
const fields = [
                { label: 'Product Name ', fieldName: 'Name', sortable : true, },
                { label: 'Product Code', fieldName: 'ProductCode', sortable : true, },
                { label: 'Product Description', fieldName: 'Description', sortable : true, },
                { label: 'Price Per Unit', fieldName: 'PricePerUnit__c', sortable : true, },
                { label: 'Quantity Available', fieldName: 'QuantityAvailable__c', sortable : true, }
                ];

export default class ProductBlock extends LightningElement {

    @track allProducts = [];
    @track searchedProduct = [];
    @track fields = fields;
    @track  errror;
    sortBy;
    sortDirection;
    @track searchKey;
    @track selectedRows;
    @wire(getProducts)
    wiredData({ error, data }) {
      if (data) {
        this.allProducts = JSON.parse(JSON.stringify(data));
        this.searchedProduct = this.allProducts;
      }else if (error) {
        this.error = error;
      }
    }
    get noRecords(){
      return this.searchedProduct.length === 0 ? false : true ;
    }
    searchProduct  = function(event){
        this.searchedProduct = [];
        this.searchKey = event.target.value;
        this.allProducts.forEach(product => {
          if(product.Name.toLowerCase().includes(this.searchKey.toLowerCase())){
            this.searchedProduct.push(product);
          }
        }); 
    }
    handleSortResult =  function(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        let isReverse = this.sortDirection === 'asc' ? 1 : -1;
        let sortResult = Object.assign([], this.searchedProduct);
        this.searchedProduct =  sortResult.sort( (a,b) => {
            if(a[this.sortBy] > b[this.sortBy]){
              return isReverse ;
            }else{
              return -1*isReverse ;
            }
        });
    }
    @track selectedItem;
    addToCart = function(event){
        this.selectedItem = this.template.querySelector("lightning-datatable").getSelectedRows(); 
        pubsub.fire('addToCart', { 'selectedProduct' : JSON.parse(JSON.stringify(this.selectedItem))}); 
        this.selectedItem.forEach(item => {
           if(item.QuantityAvailable__c > 0){
                item.QuantityAvailable__c--;
                const event = new ShowToastEvent({
                    title: item.Name,
                    message: 'Added to cart',
                    variant: 'success'
                });
                this.dispatchEvent(event);
           }else{
                const event = new ShowToastEvent({
                    title: item.Name,
                    message: 'Out Of Stock',
                    variant: 'error'
                   });
                this.dispatchEvent(event);
           }
        });
        this.selectedRows = []; 
        this.searchedProduct = [... this.searchedProduct]; 
      }
    connectedCallback(){
        this.registerAll();
      }
    registerAll(){
        pubsub.register('updateCart', this.handleUpdate.bind(this));
        pubsub.register('deletedFromCart', this.handleDelete.bind(this));
      }
    handleUpdate(message){
        const updatedproducts = message['updatedProducts'];
        this.allProducts.forEach(product => {
          if(updatedproducts.has(product['Id'])){
              product['QuantityAvailable__c'] = updatedproducts.get(product['Id']);
          }  
        });
        this.searchedProduct = [... this.searchedProduct];
      }
    handleDelete(message){
        const recId = message['deleteId'];
        const quantity = message['quantity'];
        this.allProducts.forEach(product => {
          if(product.Id === recId){
            product['QuantityAvailable__c'] = quantity;
          }
        });
        this.searchedProduct = [... this.searchedProduct];
      }
}