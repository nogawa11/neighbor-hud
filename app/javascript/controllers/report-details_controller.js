import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["card", "button", "location", "title", "reportButton", "detailsCard", "category"]

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
    this.disableForm = true;
  }

  closeCard(event) {
    event.preventDefault();
    this.buttonTarget.classList.toggle("close");
    this.cardTarget.classList.toggle("close");
    this.reportButtonTarget.classList.toggle("close");
    this.detailsCardTarget.classList.toggle("close");
  }

  validateForm() {
    this.disableForm = this.isFormValid ? false : true;
  }

  // addCategoryToForm() {
  //   const input = document.querySelector(".categories__list")
  //   input.addEventListener("change", (e) => {
  //     document.querySelector("categories__button").value = e.currentTarget.value
  //   })
  // }

  // create() {
  //   console.log("Hello");
  // }
}
