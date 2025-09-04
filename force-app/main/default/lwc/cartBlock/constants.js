const COLUMNS = [
  { label: "Product Name ", fieldName: "Name" },
  { label: "Product Code", fieldName: "ProductCode" },
  { label: "Price Per Unit", fieldName: "PricePerUnit__c" },
  {
    label: "Quantity Available",
    fieldName: "QuantityAvailable__c",
    sortable: true
  },
  {
    label: "Quantity Selected",
    fieldName: "selectedQuantity",
    sortable: true,
    editable: true,
    type: "number"
  },
  {
    type: "button",
    typeAttributes: {
      label: "delete",
      name: "delete"
    }
  }
];

export { COLUMNS };
