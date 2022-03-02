import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "content", "full", "map" ]

  connect() {
    console.log("read");
  }

  open(event) {
    const map = document.querySelector(".mapboxgl-canvas");
    map.classList.toggle("open")
    this.mapTarget.classList.toggle("open");
    this.contentTarget.classList.toggle("open")
  }
}
