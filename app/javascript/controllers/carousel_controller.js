// TODO: Delete carousel.
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["carousel", "leftButton", "rightButton"]

  connect() {
    console.log(this.carouselTarget.style.transform);
    this.categoriesWidth = this.carouselTarget.children.length * 80 - 240;
    this.xAxis = 0;
  }

  previous() {
    this.xAxis -= this.xAxis < this.categoriesWidth ? -80 : 0;
    this.carouselTarget.scroll({ left: this.xAxis, behavior: 'smooth' });
    console.log(this.categoriesWidth);
    console.log(this.xAxis);
  }

  next() {
    this.xAxis -= this.xAxis > 0 ? 80 : 0;
    this.carouselTarget.scroll({left: this.xAxis, behavior: 'smooth'});
    console.log(this.categoriesWidth);
    console.log(this.xAxis);
    // this.xAxis += this.xAxis === 0 ? 0 : 80;
    // this.carouselTarget.style.transform = `translateX(${this.xAxis}px)`
    // console.log(this.xAxis);
  }
}
