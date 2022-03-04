import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["topButton", "categoryButton"];

  connect() {
    this.#handleButtons(this.topButtonTargets, "filter");
    this.#handleButtons(this.categoryButtonTargets, "category");
  }

  /* --------------------------------- Private -------------------------------- */
  #getFormattedPath(button, params) {
    if (params === "category") {
      console.log(button);
      return button.children[1].innerText.toLowerCase();
    } else {
      console.log(button);
      const path = button.innerText.replace(/\s/g, "");
      return path.toLowerCase();
    }
  }

  #fetchData(e, params) {
    const options = {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    };

    const path = this.#getFormattedPath(e.currentTarget, params);

    fetch(`/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        const map = document.querySelector("#mapbox");
        map.outerHTML = responseText;
        history.pushState(null, null, `/?${params}=${path}`);
      })
    );
  }

  #handleButtons(targets, params) {
    targets.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.#fetchData(e, params);
        targets.forEach((sibling) => {
          sibling.classList.remove("active");
        });
        button.classList.add("active");
      });
    });
  }
}
