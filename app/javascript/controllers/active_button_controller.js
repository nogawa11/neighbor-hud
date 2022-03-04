import {
  Controller
} from "stimulus"

export default class extends Controller {
  static targets = ["topButton"]

  connect() {
    this.topButtonTargets.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.fetchData(e);
        this.topButtonTargets.forEach((sibling) => {
          sibling.classList.remove("active");
        })
        button.classList.add("active");
      });
    })
  }

  fetchData(e) {
    const options = {
      method: "GET",
      headers: {
        'Accept': 'text/plain'
      }
    }
    const path = this.#getFormattedPath(e.target);
    fetch(`/?filter=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        const map = document.querySelector("#mapbox");
        map.outerHTML = responseText;
        history.pushState(null, null, `/?filter=${path}`);
      })
    );
  }

/* --------------------------------- Private -------------------------------- */
  #getFormattedPath(button) {
    const path = button.innerText.replace(/\s/g, '');
    return path.toLowerCase();
  }
}
