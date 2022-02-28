import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button"]

  connect() {
  }

  openCard() {
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
  }
}
