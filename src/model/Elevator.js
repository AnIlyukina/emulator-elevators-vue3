export default class Elevator {
  constructor(floorCount, id, currentFloor, translateY) {
    this.id = id;
    this.status = "free";
    this.currentFloor = currentFloor ? currentFloor : 1;
    this.transform = null;
    this.floor = floorCount;
    this.position = translateY ? Math.abs(translateY) : 0;
    this.translateY = null;
  }

  move(floor, height) {
    const sizeMove = floor - this.currentFloor;
    const animationTime = Math.abs(sizeMove * 1000);
    let translateY = -((floor - 1) * height);

    this.status = "busy";

    this.currentFloor = floor;

    let element = this.getDomElement();

    const currentTranslateY = this.position ? this.position + translateY : translateY

    element.style.transitionDuration = animationTime / 1000 + "s";
    element.style.transform = `translate(0, ${currentTranslateY}px)`;
    element.style.transitionTimingFunction = "linear";
    this.transform = sizeMove > 0 ? "up" : "down";
    let finish = this.moving(animationTime).then(() => {
      this.translateY = translateY;
      this.status = "chill";
      return this.chilling(3000);
    });

    return finish;
  }

  getDomElement() {
    return document.querySelector(".elevator" + this.id);
  }

  moving(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  chilling(delay) {
    return new Promise((resolve) =>
      setTimeout(() => {
        this.status = "free";
        resolve();
      }, delay)
    );
  }
}
