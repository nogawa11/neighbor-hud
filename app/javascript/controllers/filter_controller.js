import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button", "closedCard", "categories", "date", "feed"]

  connect() {
  }

  openCard() {
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
    this.closedCardTarget.classList.toggle("open");
  }

  closeFilter() {
    this.buttonTarget.classList.toggle("open")
    this.categoriesTarget.classList.toggle("open");
    this.dateTarget.classList.toggle("open");
    this.feedTarget.classList.toggle("open");
  }
}
