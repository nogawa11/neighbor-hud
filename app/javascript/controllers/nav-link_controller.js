import { Controller } from "stimulus"

export default class extends Controller {

  connect() {
    console.log("Hello, Stimulus!");
    const links = document.querySelectorAll(".nav__link");
    links.forEach((link) => {
      if (this.#checkPathname(link)) {
        link.classList.add("active");
      }
    })
  }

/* --------------------------------- Private -------------------------------- */

  #checkPathname(link) {
    const path = link.pathname;
    const currentPath = window.location.pathname;

    const linkPath = this.#getSlicedPath(path);
    const windowPath = this.#getSlicedPath(currentPath);

    return linkPath === windowPath;
  }

  #getSlicedPath(path) {
    return path.slice(1).split("/")[0];
  }
}
