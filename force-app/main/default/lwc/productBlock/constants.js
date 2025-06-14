const COLUMNS = [
  { label: "Product Name ", fieldName: "Name", sortable: true },
  { label: "Product Code", fieldName: "ProductCode", sortable: true },
  { label: "Product Description", fieldName: "Description", sortable: true },
  { label: "Price Per Unit", fieldName: "PricePerUnit__c", sortable: true },
  {
    label: "Quantity Available",
    fieldName: "QuantityAvailable__c",
    sortable: true
  },
  {
    label: "Quantity Selected",
    fieldName: "selectedQuantity",
    sortable: true
  }
];

export { COLUMNS };
