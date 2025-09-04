public with sharing class ShoppingCartController {
  @AuraEnabled(cacheable=true)
  public static List<Product2> getProducts() {
    return ProductSelector.newInstance().getAllAvailableProducts();
  }

  @AuraEnabled
  public static Id placeOrder(Map<Id, Integer> cartMap) {
    Set<Id> ids = cartMap.keySet();
    fflib_SObjectUnitOfWork uow = getUnitOfWork();
    List<Product2> productToUpdate = ProductSelector.newInstance()
      .selectByIds(new List<Id>(ids));

    Decimal totalPrice = 0;
    for (Product2 product : productToUpdate) {
      product.QuantityAvailable__c =
        product.QuantityAvailable__c - cartMap.get(product.Id);
      totalPrice += cartMap.get(product.Id) * product.PricePerUnit__c;
    }
    uow.registerDirty(productToUpdate);

    PurchaseOrder__c productOrder = new PurchaseOrder__c(
      OrderPrice__c = totalPrice,
      OrderStatus__c = 'Pending'
    );
    uow.registerNew(productOrder);

    for (Id productId : cartMap.keySet()) {
      PurchaseOrderLineItems__c lineItem = new PurchaseOrderLineItems__c(
        Product__c = productId,
        quantity__c = cartMap.get(productId)
      );
      uow.registerNew(
        lineItem,
        PurchaseOrderLineItems__c.PurchaseOrder__c,
        productOrder
      );
    }
    uow.commitWork();

    return productOrder.Id;
  }

  private static fflib_SObjectUnitOfWork getUnitOfWork() {
    fflib_SObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(
      new List<Schema.SObjectType>{
        Product2.SObjectType,
        PurchaseOrder__c.SObjectType,
        PurchaseOrderLineItems__c.SObjectType
      }
    );
    return uow;
  }
}
