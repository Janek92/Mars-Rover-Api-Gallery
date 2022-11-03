class SetUrl {
  constructor() {
    this.choseRover = document.querySelector(".interface__chose-rover");
    this.dateType = document.querySelector(".interface__date-type");
    this.dateFormat = document.querySelector(".interface__date-format");
    this.solFormat = document.querySelector(".interface__sol-format");
    this.dateValues = this.dateFormat.querySelector('input[type="date"]');
    this.solValue = this.solFormat.querySelector('input[type="number"]');
    this.choseRover.addEventListener("click", this.setValues.bind(this));
    this.dateType.addEventListener("click", this.setDateOrSol.bind(this));
    this.dateValues.addEventListener(
      "change",
      this.generateUrlByDateType.bind(this)
    );
    this.solFormat.addEventListener(
      "submit",
      this.generateUrlByDateType.bind(this)
    );
    this.spinner = document.querySelector(".spinner");
  }
  spinnerOn() {
    this.spinner.classList.add("visible");
  }
  spinnerOff() {
    this.spinner.classList.remove("visible");
  }
  //method to use in generateManifests for date and sol values and chose type of date section on
  valuesForRovers(rover, minDate, maxDate, maxSol) {
    this.dateValues.setAttribute("min", minDate);
    this.dateValues.setAttribute("max", maxDate);
    this.solValue.setAttribute("max", maxSol);
    this.rover = rover;
    this.dateType.style.display = "grid";
    this.solValue.value = "none";
    this.dateValues.value = "none";
  }
  //async method to use in setValues
  async generateManifests(rover) {
    await fetch(
      `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}/?api_key=dlMqkVNwg4kVXWabBfXGrkndVVfCGm6lagFF8gbj`
    )
      .then((response) => response.json())
      .then((res) =>
        this.valuesForRovers(
          rover,
          res.photo_manifest.landing_date,
          res.photo_manifest.max_date,
          res.photo_manifest.max_sol
        )
      )
      .catch((error) =>
        alert("Niepowodzenie podczas pobierania API : " + error)
      );
    await this.smoothScroll(this.dateType);
    this.spinnerOff();
  }
  //a method for adding button pointed class
  searchBtnToSetPointed(e, section) {
    const btns = section.querySelectorAll("button");
    btns.forEach((btn) => {
      btn.classList.contains("pointed");
      btn.classList.remove("pointed");
    });
    e.target.classList.add("pointed");
  }
  //scroll method
  smoothScroll(nextSection) {
    let scrollPos =
      nextSection.offsetTop + nextSection.clientHeight + window.innerHeight;
    window.scrollTo(0, scrollPos);
  }
  //generate inputs date and sol values based on chosen rover - used async method because of time for api connection
  async setValues(e) {
    this.spinnerOn();
    if (e.target.textContent === "curiosity") {
      this.generateManifests("curiosity");
    } else if (e.target.textContent === "opportunity") {
      this.generateManifests("opportunity");
    } else if (e.target.textContent === "spirit") {
      this.generateManifests("spirit");
    } else {
      this.spinnerOff();
      return;
    }
    this.searchBtnToSetPointed(e, this.choseRover);
    document.querySelector(".gallery").textContent = "";
  }
  //display a table with sol or date on
  setDateOrSol(e) {
    if (e.target.textContent === "earth date") {
      this.solFormat.style.display = "none";
      this.dateFormat.style.display = "grid";
    } else if (e.target.textContent === "sol") {
      this.dateFormat.style.display = "none";
      this.solFormat.style.display = "grid";
    } else {
      return;
    }
    this.searchBtnToSetPointed(e, this.dateType);
    if (this.solFormat.style.display === "none") {
      this.smoothScroll(this.dateFormat);
    } else if (this.dateFormat.style.display === "none") {
      this.smoothScroll(this.solFormat);
    }
  }
  //generate api link on the sol or date based
  generateUrlByDateType(e, url) {
    if (e.target.name === "date") {
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover}/photos?earth_date=${e.target.value}&api_key=dlMqkVNwg4kVXWabBfXGrkndVVfCGm6lagFF8gbj`;
    } else {
      e.preventDefault();
      url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover}/photos?sol=${this.solValue.value}&api_key=dlMqkVNwg4kVXWabBfXGrkndVVfCGm6lagFF8gbj`;
    }
    this.downloadPics(url);
  }
  //fetch api
  downloadPics(urlPhotos) {
    this.spinnerOn();
    fetch(urlPhotos)
      .then((response) => response.json())
      .then((res) => this.showImages(res))
      .catch((error) =>
        alert("Niepowodzenie podczas pobierania API : " + error)
      );
  }
  //create gallery method
  showImages(data) {
    this.spinnerOff();
    const gallery = document.querySelector(".gallery");
    let value = 0;
    let lastSec;
    let nr = data.photos.length;
    //conditional statement for adding images to div(which is in section) with max 40 elements
    gallery.textContent = "";
    for (let i = 0; i < nr; i++) {
      if (value % 40 == 0) {
        let section = document.createElement("section");
        section.innerHTML = "<button>show/hide images</button>";
        gallery.appendChild(section);
        let div = document.createElement("div");
        i < 40 ? (div.style.height = "auto") : (div.style.height = "0");
        section.appendChild(div);
        lastSec = gallery.querySelector("section:nth-last-child(1)");
        lastSec.classList.add(`photos_from_${value + 1}`);
      }
      value++;
      let img = document.createElement("img");
      img.setAttribute("src", data.photos[i].img_src);
      img.setAttribute("data-camera", data.photos[i].camera.full_name);
      img.setAttribute("data-earth_date", data.photos[i].earth_date);
      img.setAttribute("data-sol", data.photos[i].sol);
      lastSec.querySelector("div").appendChild(img);
    }
    const imagesSlots = gallery.querySelectorAll("section");
    imagesSlots.forEach((slot) =>
      slot.addEventListener("click", this.hidingShowingImg)
    );

    imagesSlots.forEach((slot) =>
      slot.querySelector("div").addEventListener("click", this.choseImg)
    );

    this.smoothScroll(gallery);
  }
  //expanding the section with photos
  hidingShowingImg(e) {
    if (e.target.localName === "button") {
      let div = e.target.parentElement.querySelector("div");
      if (div.style.height === "0px") {
        div.style.height = "auto";
      } else if (div.style.height !== 0) {
        div.style.height = 0;
      }
    }
  }
  //picture preview method
  choseImg(e) {
    e.target.style.transform = "scale(0.95)";
    e.target.addEventListener("transitionend", () => {
      e.target.style.transform = "scale(1)";
    });
    let viewingPhoto = e.target;
    let nextSib = viewingPhoto.nextSibling;
    let prevSib = viewingPhoto.previousSibling;
    let nextLink;
    const pictureOnScreen = document.createElement("div");
    pictureOnScreen.classList.add("preview");
    //section with camera, date and sol information
    const section = document.createElement("section");
    const camera = document.createElement("p");
    camera.innerHTML = `camera type : ${viewingPhoto.getAttribute(
      "data-camera"
    )}`;
    const date = document.createElement("p");
    date.innerHTML = `Earth date : ${viewingPhoto.getAttribute(
      "data-earth_date"
    )}`;
    const sol = document.createElement("p");
    sol.innerHTML = `Martian sol : ${viewingPhoto.getAttribute("data-sol")}`;
    section.append(camera, date, sol);
    //left arrow
    const left = document.createElement("div");
    left.classList.add("left-arrow");
    left.innerHTML = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
    //close picture icon
    const close = document.createElement("div");
    close.classList.add("close");
    close.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    //right arrow
    const right = document.createElement("div");
    right.classList.add("right-arrow");
    right.innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
    //picture
    const photo = document.createElement("img");
    photo.setAttribute("src", `${e.target.getAttribute("src")}`);
    pictureOnScreen.append(photo, left, close, right, section);
    //way on set preview on DOM before script
    const src = document.querySelector("script");
    document.body.insertBefore(pictureOnScreen, src);
    //previev controls function
    const previewArrowsControl = (whichSib, element) => {
      nextLink = whichSib.currentSrc;
      viewingPhoto = element;
      photo.setAttribute("src", `${nextLink}`);
      nextSib = viewingPhoto.nextSibling;
      prevSib = viewingPhoto.previousSibling;
      camera.innerHTML = `camera type : ${viewingPhoto.getAttribute(
        "data-camera"
      )}`;
    };
    //previev controls events
    right.addEventListener("click", () =>
      previewArrowsControl(nextSib, viewingPhoto.nextSibling)
    );
    left.addEventListener("click", () =>
      previewArrowsControl(prevSib, viewingPhoto.previousSibling)
    );
    close.addEventListener("click", () => {
      document.body.removeChild(pictureOnScreen);
    });
    section.addEventListener("click", () => {
      section.classList.toggle("--invisible");
    });
  }
}

class Menu {
  constructor() {
    this.header = document.querySelector(".welcome");
    this.wrapper = document.querySelector(".wrapper");
    this.introduction = document.querySelector(".introduction");
    this.interface = document.querySelector(".interface");
    this.footer = document.querySelector(".about");
    this.burger = document.querySelector(".menu__burger");
    this.fa = this.burger.querySelector(".fa");
    this.nav = document.querySelector(".menu");
    this.navLinks = this.nav.querySelectorAll("ul li a");
    this.navLinks.forEach((link) =>
      link.addEventListener("click", this.menu.bind(this))
    );
    this.burger.addEventListener("click", this.toggleMenu.bind(this));
    window.addEventListener("scroll", this.hideHeader.bind(this));
    window.addEventListener("scroll", this.menuForDesktops.bind(this));
  }
  //setting blur effect when menu is expanded
  headerWrapperBlur(value) {
    this.header.style.filter = `blur(${value}px)`;
    this.wrapper.style.filter = `blur(${value}px)`;
  }
  //slide out burger icon with scroll on smaller devices
  hideBurgerIfScroll() {
    if (window.innerWidth >= 1024) return;
    //Limit event occurance (commented in order of problems while resize):
    // if (this.opacityLevel > '40' && this.fa.classList.contains('fa-bars')) return;
    if ((window.scrollY / window.innerHeight) * 100 > 30) {
      this.nav.style.transform = "translateY(-100%)";
      this.fa.classList.remove("fa-times");
      this.fa.classList.add("fa-bars");
    } else if (this.opacityLevel < "30") {
      this.nav.style.transform = "translateY(-130%)";
    }
    this.headerWrapperBlur(0);
  }
  //setting opacity on header
  hideHeader() {
    if (
      this.wrapper.offsetTop + window.scrollY > this.wrapper.offsetTop * 2 ===
      false
    ) {
      this.opacityLevel = Math.round(
        ((this.wrapper.offsetTop - window.innerHeight + window.scrollY) /
          window.innerHeight) *
          100
      );
      this.opacityLevel >= 100 ? (this.opacityLevel = 100) : this.opacityLevel;
      this.header.style.opacity = `${100 - this.opacityLevel}%`;
      this.wrapper.style.opacity = `${this.opacityLevel}%`;
    }
    //Burger position relative to page scroll
    this.hideBurgerIfScroll();
  }
  //burger icon switch
  switchBurgerIcon() {
    if (this.fa.classList.contains("fa-bars")) {
      this.nav.style.transform = "translateY(0%)";
      this.fa.classList.remove("fa-bars");
      this.fa.classList.add("fa-times");
      this.headerWrapperBlur(3);
    } else {
      this.nav.style.transform = "translateY(-100%)";
      this.fa.classList.remove("fa-times");
      this.fa.classList.add("fa-bars");
      this.headerWrapperBlur(0);
    }
    this.fa.style.transform = "translate(-50%, -50%) scaleY(0.9)";
  }
  //animated icon scaling
  toggleMenu() {
    this.fa.style.transform = "translate(-50%, -50%) scaleY(0.0)";
    setTimeout(this.switchBurgerIcon.bind(this), 350);
  }
  //method to scroll
  menuScroll(section) {
    let scrollPos = section.offsetTop + window.innerHeight;
    window.scrollTo(0, scrollPos);
  }
  //moves the page to the appropriate section
  menu(e) {
    if (e.target.innerText === "Header") {
      window.scrollTo(0, 0);
    } else if (e.target.innerText === "Introduction") {
      this.menuScroll(this.introduction);
    } else if (e.target.innerText === "Interface") {
      this.menuScroll(this.interface);
    } else if (e.target.innerText === "About") {
      this.menuScroll(this.footer);
    } else if (e.target.classList.contains("fa-share-alt")) {
      const title = window.document.title;
      const href = window.document.location.href;
      if (navigator.share) {
        navigator
          .share({
            title: `${title}`,
            url: `${href}`,
          })
          .then(() => {
            console.log("Share completed");
          })
          .catch(console.error);
      }
    }
  }
  //slide out menu with scroll on desktops
  menuForDesktops() {
    //Limit event occurance (commented in order of problems while resize):
    // if ((window.scrollY / window.innerHeight * 100) > 50) return;
    if (window.innerWidth >= 1024) {
      if ((window.scrollY / window.innerHeight) * 100 > 30) {
        this.nav.style.transform = "translateY(0%)";
      } else if ((window.scrollY / window.innerHeight) * 100 <= 30) {
        this.nav.style.transform = "translateY(-100%)";
      }
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new SetUrl();
  new Menu();
});
