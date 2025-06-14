import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import pubsub from 'c/pubsub';
const fields = [
    { label: 'Product Name ', fieldName: 'Name' },
    { label: 'Product Code', fieldName: 'ProductCode' },
    { label: 'Price Per Unit', fieldName: 'PricePerUnit__c' },
    { label: 'Quantity', fieldName: 'Quantity', editable : true },
    { type : "button",
                typeAttributes: {
                  label: 'delete' ,
                  name: 'delete'
              } }
    ];

export default class CartBlock extends LightningElement {
    @track fields = fields;
    @track cartItemMap = new Map();
    @track updatedProductsMap;
    @track cartItems = [];
    get noCartItems(){
        return this.cartItems.length === 0 ? false : true;
    }

    deleteFromCart = function (event) {
        const recId = event.detail.row.Id;
        const quantity = this.cartItemMap.get(recId)['totalQuantity'];
        const toastEvent = new ShowToastEvent({
            title: this.cartItemMap.get(recId).Name,
            message: 'Removed From Cart',
            variant: 'success' });
        this.dispatchEvent(toastEvent);
        this.cartItemMap.delete(recId);
        this.cartItems = [...this.cartItemMap.values()];
        pubsub.fire('deletedFromCart', {'deleteId' : recId , 'quantity' : quantity});
    }
    updateCart = function(event) {
        const updatedFields = event.detail.draftValues;
        this.updatedProductsMap = new Map();
        updatedFields.forEach(element => {
            const totalQuantity = this.cartItemMap.get(element.Id)['totalQuantity']
            if(element['Quantity'] <= 0){
                const event = new ShowToastEvent({
                    title: this.cartItemMap.get(element.Id).Name,
                    message: 'Selected Quantity Shoud Be greater than 0',
                    variant: 'error' 
                });
                this.dispatchEvent(event); 
            }else if(totalQuantity >= element['Quantity']){
                        this.cartItemMap.get(element.Id)['Quantity'] = element['Quantity'];
                        this.updatedProductsMap.set(element.Id, totalQuantity - element['Quantity']);
                        const event = new ShowToastEvent({
                            title: this.cartItemMap.get(element.Id).Name,
                            message: 'Product Quantity Updated ',
                            variant: 'success' });
                        this.dispatchEvent(event);
            }else{
                const event = new ShowToastEvent({
                    title: this.cartItemMap.get(element.Id).Name,
                    message: 'Selected Quantity Shoud Be Less than Available Quantity',
                    variant: 'error' });
                this.dispatchEvent(event);
            }
        });
        pubsub.fire('updateCart', {'updatedProducts' : this.updatedProductsMap});
        this.draftValues = [];
        this.cartItems = [...this.cartItemMap.values()];
        return refreshApex(this.cartItems);
      }

    connectedCallback(){
        pubsub.register('addToCart', this.handleAdd.bind(this));
        pubsub.register('getProductsInInvoice', this.setProductsInInvoice.bind(this));
      }
    handleAdd(message){
        const selectedProducts = JSON.parse(JSON.stringify(message))['selectedProduct'];
        selectedProducts.forEach( product => {
            if(product['QuantityAvailable__c'] > 0){
                if(this.cartItemMap.has(product.Id)){
                    this.cartItemMap.get(product.Id)['Quantity']++;
                }else{
                    product['Quantity'] =  1;
                    product['totalQuantity'] = product.QuantityAvailable__c;
                    this.cartItemMap.set(product.Id, JSON.parse(JSON.stringify(product)));
                }
            }
        });
        this.cartItems = [...this.cartItemMap.values()];
    }
    setProductsInInvoice(message){
        pubsub.fire('setProductsInInvoice', {'products' : this.cartItems});
    }
}