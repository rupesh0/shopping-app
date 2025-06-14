public with sharing class ProductSelector implements ProductISelector {
  private static Dependency impl = new Dependency(
    ProductSelector.class
  );

  public static ProductISelector newInstance() {
    return (ProductISelector) impl.newInstance();
  }

  public List<Product2> getAllAvailableProducts() {
    return [
      SELECT
        Id,
        Name,
        ProductCode,
        Description,
        PricePerUnit__c,
        QuantityAvailable__c
      FROM Product2
      WHERE QuantityAvailable__c > 0
    ];
  }

  public List<Product2> selectByIds(List<Id> ids) {
    return [
      SELECT
        Id,
        Name,
        ProductCode,
        Description,
        PricePerUnit__c,
        QuantityAvailable__c
      FROM Product2
      WHERE Id IN :ids
    ];
  }
}
