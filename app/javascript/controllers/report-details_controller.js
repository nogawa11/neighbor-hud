import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button", "location", "title", "reportButton", "detailsCard", "category", "categoryItem"];

  previousLocation = '';
  previousTitle = '';
  previousCategory = '';

  get location() {
    return this.locationTarget.value;
  }

  get category() {
    return this.categoryTarget.value;
  }

  get title() {
    return this.titleTarget.value.trim();
  }

  get isLocationChanged() {
    return this.previousLocation !== this.location;
  }

  get isTitleChanged() {
    return this.previousTitle !== this.title;
  }

  get isCategoryChanged() {
    return this.previousTitle !== this.title;
  }

  get isFormValid() {
    return (this.isLocationChanged && this.isTitleChanged && this.isCategoryChanged);
  }

  set disableForm(value) {
    this.reportButtonTarget.disabled = value;
  }

  connect() {
    this.previousLocation = this.location;
    this.previousTitle = this.title;
    this.#removeActiveClass();
  }

  openCard(event) {
    event.preventDefault();
    this.buttonTarget.classList.toggle("open");
    this.cardTarget.classList.toggle("open");
    this.reportButtonTarget.classList.toggle("open");
    this.detailsCardTarget.classList.toggle("open");
  }

  validateForm() {
    this.disableForm = this.isFormValid ? false : true;
  }

  #removeActiveClass() {
    this.categoryItemTargets.forEach(item => {
      item.classList.remove("active");
    });
  }

  setActiveButton(e) {
    this.#removeActiveClass();
    e.currentTarget.classList.add("active");
    this.setCategory(e);
  }

  setCategory(e) {
    const category = e.currentTarget.children[1].innerText.toLowerCase();
    this.categoryTarget.value = category;
  }

}
