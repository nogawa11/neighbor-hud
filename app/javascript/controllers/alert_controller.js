import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  // static targets = [ 'test' ]

  connect() {
    const alert = document.querySelector(".alert-dismissible")
    setTimeout(() => {
      alert.style.display = "none"
    }, 3000);
  }
}
