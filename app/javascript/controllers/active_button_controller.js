import { Controller } from "stimulus";

export default class extends Controller {
  static targets = ["topButton", "categoryButton", "feed"];

  connect() {
    this.filter = {
      "filter": "",
      "category": [],
      "date": []
    };

    this.#handleButtons(this.topButtonTargets, "filter");
    this.#handleButtons(this.categoryButtonTargets, "category");
  }

  /* --------------------------------- Private -------------------------------- */
  #getFormattedPath(button, params) {
    if (params === "category") {
      return button.children[1].innerText.toLowerCase();
    } else {
      const path = button.innerText.replace(/\s/g, "");
      return path.toLowerCase();
    }
  }

  #updateMap(res) {
    const map = document.querySelector("#mapbox");
    map.outerHTML = res;
  }

  #fetchHome(path, params, options) {
    fetch(`/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.#updateMap(responseText);
        history.pushState(null, null, `/?${params}=${path}`);
      })
    );
  }

  #fetchFeed(path, params, options) {
    fetch(`/feed/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.feedTarget.outerHTML = responseText;
        history.pushState(null, null, `/feed/?${params}=${path}`);
      })
    );
  }


  #fetchData(e, params) {
    const options = {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    };

    const path = this.#getFormattedPath(e.currentTarget, params);

    if (this.#isInFeedPage()) {
      this.#fetchFeed(path, params, options);
    } else {
      this.#fetchHome(path, params, options);
    }
  }

  #isInFeedPage() {
    return (/\/feed.*/).test(window.location.pathname);
  }

  #isInIncidentsNewPage() {
    return (/\/incidents\/new.*/).test(window.location.pathname);
  }

  #addCategoryToFilter(button) {
    // this.filter[params] = [...this.filter[params], this.#getFormattedPath(button, params)];
    const path = this.#getFormattedPath(button, "category");
    this.filter["category"] = this.filter["category"].includes(path)
      ? this.filter["category"].filter((item) => item !== path)
      : [...this.filter["category"], path];
    }

    #addTypeToFilter(button) {
    const type = this.#getFormattedPath(button, "filter")
    this.filter["filter"] = type;
  }

  #setActiveClass(targets, button) {
    targets.forEach((sibling) => {
      sibling.classList.remove("active");
    });
    button.classList.add("active");
  }

  #handleButtons(targets, params) {
    targets.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.#fetchData(e, params);
        this.#setActiveClass(targets, button);
        params === "category"
          ? this.#addCategoryToFilter(button)
          : this.#addTypeToFilter(button);
        console.log(this.filter);

      });
    });
  }
}
