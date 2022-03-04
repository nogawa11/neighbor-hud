import { Controller } from "stimulus"

export default class extends Controller {
  static targets = []

  connect() {
    console.log("Hello, Stimulus!");
  }

  setActive() {
    console.log("Clicked");
  }

}
