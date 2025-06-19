export class GoToCardEvent extends CustomEvent {
  constructor(selectedProducts) {
    super(GoToCardEvent.type, { selectedProducts });
  }

  static get type() {
    return "gotocart";
  }
}
