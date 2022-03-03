import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["home", "incidents", "new", "route", "notifications"]

  connect() {
    console.log("Hello, Stimulus!");
    this.links = document.querySelectorAll(".nav__link");
    this.#setActiveLink();
  }

  /* --------------------------------- Private -------------------------------- */

  #setActiveLink() {
    const path = window.location.pathname;

    switch (true) {
      case path === "/":
        return this.homeTarget.classList.add("active");
      case path === "/feed" || (/incidents\/\d+/).test(path):
        return this.incidentsTarget.classList.add("active");
      case path === "/incidents/new":
        return this.newTarget.classList.add("active");
      case path === "/notifications":
        return this.notificationsTarget.classList.add("active");
      case path === "/route":
        return this.routeTarget.classList.add("active");
      default:
        return
    }
  }
}
