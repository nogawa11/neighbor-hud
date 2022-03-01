import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button"]

  connect() {
    console.log("Helloo, Stimulus!");
  }

  openCard() {
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
  }
}
