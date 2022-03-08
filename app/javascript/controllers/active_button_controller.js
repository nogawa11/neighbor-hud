import { Controller } from "stimulus";

export default class extends Controller {
  static targets = [
    "topButton",
    "categoryButton",
    "feed",
    "startDate",
    "endDate",
    "test",
  ];

  connect() {
    const date = new Date();
    this.today = date.toISOString().replace(/T.*/, "").split("-").join("-");
    this.oneWeekAgo = new Date(date.setDate(date.getDate() - 7))
      .toISOString()
      .replace(/T.*/, "")
      .split("-")
      .join("-");

    this.dateInputs = [this.startDateTarget, this.endDateTarget];
    this.filter = {
      filter: "",
      category: "",
      startDate: this.oneWeekAgo,
      endDate: this.today
    };

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

  #fetchHome(path, params, options) {
    fetch(`/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.#updateMap(responseText);
        // history.pushState(null, null, `/?${params}=${path}`);
      })
    );
  }

  #fetchFeed(path, params, options) {
    fetch(`/feed/?${params}=${path}`, options).then((response) =>
      response.text().then((responseText) => {
        this.feedTarget.outerHTML = responseText;
        // history.pushState(null, null, `/feed/?${params}=${path}`);
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
    return /\/feed.*/.test(window.location.pathname);
  }

  #isInIncidentsNewPage() {
    return /\/incidents\/new.*/.test(window.location.pathname);
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
    const dates = `${
      this.#isFilterEmpty("category") || this.#isFilterEmpty("filter")
    }start_date=${this.filter.startDate}&end_date=${this.filter.endDate}`;

    if (this.#isInFeedPage()) {
      return `/feed?${category}${filter}${dates}`;
    } else {
      return `/${category}${filter}${dates}`;
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

  #handleDateChange() {
    this.startDateInput.addEventListener("change", () => {
        this.filter.startDate = startDate.value;
        this.#addToUrl();
    });
    this.endDateInput.addEventListener("change", () => {
      this.filter.endDate = endDate.value;
      this.#addToUrl();
  });
  }

  #handleButtons(targets, params) {
    targets.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        this.#fetchData(e, params);
        this.#setActiveClass(targets, button);
        this.#addToFilter(button, params);
        this.#getDate();
        this.#addToUrl()
      });
    });
  }
}
