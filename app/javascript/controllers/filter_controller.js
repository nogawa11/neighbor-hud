import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button", "closedCard"]

  connect() {
  }

  openCard() {
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
    this.closedCardTarget.classList.toggle("open");
  }
}
