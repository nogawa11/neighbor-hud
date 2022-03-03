import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button"]

  connect() {
    console.log("Hello, Stimulus!");
  }

  openCard(event) {
    event.preventDefault();
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
  }

  create() {
    console.log("Hello");
  }
}
