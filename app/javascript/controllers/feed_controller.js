import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["feed", "feedButton"]

  connect(){
    console.log("hello from feed")
  }

  showFeed(){
    console.log("hello");
    this.feedTarget.classList.toggle("remove");
  }
}
