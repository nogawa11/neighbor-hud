import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [
    "topButton",
    "categoryButton",
    "feed",
    "startDate",
    "endDate",
    "search",
  ];

  connect() {
    const date = new Date();
    this.today = date
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");
    this.oneWeekAgo = new Date(date.setDate(date.getDate() - 7))
      .toLocaleDateString("en-GB")
      .split("/")
      .reverse()
      .join("-");

    this.dateInputs = [this.startDateTarget, this.endDateTarget];
    this.filter = {
      filter: "",
      category: "",
      startDate: this.oneWeekAgo,
      endDate: this.today,
      location: "",
    };

    this.requestOptions = {
      method: "GET",
      headers: {
        Accept: "text/plain",
      },
    };

    this.#getLocation();
    this.#addToUrl();
    this.#handleButtons(this.topButtonTargets, "filter");
    this.#handleButtons(this.categoryButtonTargets, "category");
    this.#handleDateChange();
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

  #fetchHome() {
    fetch(`${window.location.search}&start_date=${this.filter.startDate}&end_date=${this.filter.endDate}`, this.requestOptions).then((response) => {
      response.text().then((responseText) => {
        this.#updateMap(responseText);
      });
    });
  }

  #fetchFeed() {
    fetch(`/feed/${window.location.search}&start_date=${this.filter.startDate}&end_date=${this.filter.endDate}`, this.requestOptions).then(
      (response) =>
        response.text().then((responseText) => {
          this.feedTarget.outerHTML = responseText;
        })
    );
  }

  #fetchData() {
    if (this.#isInFeedPage()) {
      this.#fetchFeed();
    } else {
      this.#fetchHome();
    }
  }

  #isInFeedPage() {
    return /\/feed.*/.test(window.location.pathname);
  }

  #addToFilter(button, params) {
    const element = this.#getFormattedPath(button, params);
    this.filter[params] = element;
  }

  #setActiveClass(targets, button) {
    targets.forEach((sibling) => {
      sibling.classList.remove("active");
    });
    button.classList.add("active");
  }

  #isFilterEmpty(type) {
    return this.filter[type] === "" ? "" : "&";
  }

  #getNewUrl() {
    const category =
      this.filter.category.length > 0 ? `category=${this.filter.category}` : "";
    const filter =
      this.filter.filter.length > 0
        ? `${this.#isFilterEmpty("category")}filter=${this.filter.filter}`
        : "";
    const location =
      this.filter.location.length > 0
        ? `${this.#isFilterEmpty("category") || this.#isFilterEmpty("filter")
      }location=${this.filter.location}` : "";

    if (this.#isInFeedPage()) {
      return `/feed?${category}${filter}${location}`;
    } else {
      return `/?${category}${filter}${location}`;
    }
  }

  #addToUrl() {
    history.pushState(null, null, this.#getNewUrl());
  }

  #getDate() {
    const startDate = this.startDateTarget.value;
    const endDate = this.endDateTarget.value;
    this.filter.startDate = startDate;
    this.filter.endDate = endDate;
  }

  #getLocation() {
    if (this.#isInFeedPage()) {
      const location = this.searchTarget.value;
      this.filter.location = location;
    }
  }

  #handleDateChange() {
    this.dateInputs.forEach((input, index) => {
      input.addEventListener("change", (e) => {
        this.#getDate();
        this.#addToUrl();
        this.#fetchData();
      });
    });
  }

  #handleButtons(targets, params) {
    targets.forEach((button) => {
      button.addEventListener("click", (e) => {
        console.log("clicked");
        e.preventDefault();
        this.#setActiveClass(targets, button);
        this.#addToFilter(button, params);
        this.#getDate();
        this.#addToUrl();
        this.#fetchData();
      });
    });
  }
}
