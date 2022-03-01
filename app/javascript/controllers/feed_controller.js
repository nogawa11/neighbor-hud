import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["feedButton", "feed"]

  connect(){
    console.log("hello from feed")
  }

  showFeed(){
    console.log("hello");
    this.feedTarget.classList.toggle("remove");
  }
}
