import { api, LightningElement } from "lwc";

export default class Toolbar extends LightningElement {
  @api toolbarTitle;
  @api toolbarSubTitle;
}
