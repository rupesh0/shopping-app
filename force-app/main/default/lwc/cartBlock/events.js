export class GoToProductsEvent extends CustomEvent {
  constructor(selectedProducts) {
    super(GoToProductsEvent.type, { detail: { selectedProducts } });
  }

  static get type() {
    return "gotoproducts";
  }
}

export class PlaceOrderEvent extends CustomEvent {
  constructor(selectedProducts) {
    super(PlaceOrderEvent.type, { detail: { selectedProducts } });
  }

  static get type() {
    return "placeorder";
  }
}
