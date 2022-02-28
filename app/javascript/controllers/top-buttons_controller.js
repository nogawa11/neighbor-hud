import { Controller } from "stimulus"

export default class extends Controller {

  connect() {
    console.log("Hello, Stimulus!");
    const buttons = Array.from(this.element.children);
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("active");
      });
    })
  }
}
