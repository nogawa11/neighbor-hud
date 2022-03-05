import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button", "location", "category", "title", "reportButton"]

  previousLocation = '';
  previousCategory = '';
  previousTitle = '';

  get location() {
    return this.locationTarget.value;
  }

  get category() {
    return this.categoryTarget.value;
  }

  get title() {
    return this.titleTarget.value;
  }

  get isLocationChanged() {
    return this.previousLocation !== this.location;
  }

  get isCategoryChanged() {
    return this.previousCategory !== this.category;
  }

  get isTitleChanged() {
    return this.previousTitle !== this.title;
  }

  get isFormValid() {
    return (this.isLocationChanged || this.isCategoryChanged) || this.isTitleChanged;
  }

  set disableForm(value) {
    this.reportButtonTarget.disabled = value;
  }

  connect() {
    console.log("Hello, Stimulus!");
    this.previousLocation = this.location;
    this.previousCategory = this.category;
    this.previousTitle = this.title;
    this.disableForm = true;
  }

  openCard(event) {
    event.preventDefault();
    this.buttonTarget.classList.toggle("open")
    this.cardTarget.classList.toggle("open");
  }

  validateForm() {
    this.disableForm = this.isFormValid ? false : true;
  }

  // create() {
  //   console.log("Hello");
  // }
}
