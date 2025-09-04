export class GoToCardEvent extends CustomEvent {
  constructor(selectedProducts) {
    super(GoToCardEvent.type, { detail : { selectedProducts }});
  }

  static get type() {
    return "gotocart";
  }
}
