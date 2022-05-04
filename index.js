class SetUrl {
  constructor() {
    this.choseRover = document.querySelector('.interface__chose-rover');
    this.dateType = document.querySelector('.interface__date-type');
    this.dateFormat = document.querySelector('.interface__date-format');
    this.solFormat = document.querySelector('.interface__sol-format');
    this.dateValues = this.dateFormat.querySelector('input[type="date"]');
    this.solValue = this.solFormat.querySelector('input[type="number"]');
    this.rover;
    this.choseRover.addEventListener('click', this.setValues.bind(this));
    this.dateType.addEventListener('click', this.setDateOrSol.bind(this));
    this.dateValues.addEventListener('change', this.generateUrlByDateType
      .bind(this));
    this.solFormat.addEventListener('submit', this.generateUrlByDateType.bind(this));

  }
  //Metoda do użycia w setValues(e):
  valuesForRovers(rover, minDate, maxDate, maxSol) {
    this.dateValues.setAttribute('min', minDate);
    this.dateValues.setAttribute('max', maxDate);
    this.solValue.setAttribute('max', maxSol);
    this.rover = rover;
    this.dateType.style.display = 'grid';
    this.solValue.value = 'none';
    this.dateValues.value = 'none';
  };
  //metoda do nadawania buttonowi klasy pointed
  searchBtnToSetPointed(e, section) {
    const btns = section.querySelectorAll('button');
    btns.forEach(btn => {
      btn.classList.contains('pointed');
      btn.classList.remove('pointed');
    });
    e.target.classList.add('pointed');
  }
  //metoda do scrollownia do nastepnej sekcji:
  smoothScroll(nextSection) {
    let scrollPos = (nextSection.offsetTop + nextSection.clientHeight + window.innerHeight);
    window.scrollTo(0, scrollPos);
  }
  //Wygenerowanie wartości inputów na podstawie łazika:
  setValues(e) {
    if (e.target.textContent === 'curiosity') {
      this.valuesForRovers(e.target.textContent, '2012-08-06', '2022-04-09', '3434');
    } else if (e.target.textContent === 'opportunity') {
      this.valuesForRovers(e.target.textContent, '2004-01-25', '2018-06-11', '5111');
    } else if (e.target.textContent === 'spirit') {
      this.valuesForRovers(e.target.textContent, '2004-01-04', '2010-03-21', '2208');
    } else {
      return
    };
    this.searchBtnToSetPointed(e, this.choseRover);
    this.smoothScroll(this.dateType);
  }

  //Wyświetlenie tabeli z sol lub date:
  setDateOrSol(e) {
    if (e.target.textContent === 'earth date') {
      this.solFormat.style.display = 'none';
      this.dateFormat.style.display = 'grid';
    } else if (e.target.textContent === 'sol') {
      this.dateFormat.style.display = 'none';
      this.solFormat.style.display = 'grid';
    } else {
      return
    };
    this.searchBtnToSetPointed(e, this.dateType);
    if (this.solFormat.style.display === 'none') {
      this.smoothScroll(this.dateFormat);
    } else if (this.dateFormat.style.display === 'none') {
      this.smoothScroll(this.solFormat);
    }

  }

  //Generowanie url na podstawie sol lub date:
  generateUrlByDateType(e, url) {
    if (e.target.name === 'date') {
      url =
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover}/photos?earth_date=${e.target.value}&api_key=dlMqkVNwg4kVXWabBfXGrkndVVfCGm6lagFF8gbj`;
    } else {
      e.preventDefault();
      url =
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${this.rover}/photos?sol=${this.solValue.value}&api_key=dlMqkVNwg4kVXWabBfXGrkndVVfCGm6lagFF8gbj`;
    }
    this.downloadPics(url);
  }
  downloadPics(urlPhotos) {
    fetch(urlPhotos)
      .then(response => response.json())
      .then(res => this.showImages(res))
      .catch(error => alert('Niepowodzenie podczas pobierania API : ' + error));
  }
  showImages(data) {
    const gallery = document.querySelector('.gallery');
    let value = 0;
    let lastSec;
    let nr = data.photos.length;

    console.log(data);
    //Nazwy kamer. Na razie do console:
    // for (let i = 0; i < nr; i++) {
    //   console.log(data.photos[i].max_sol);
    //   console.log(data.photos[i].max_date);
    // }
    //Dodaj foto do div (div jest w section) po max 40 zdjęć:
    gallery.textContent = '';
    for (let i = 0; i < nr; i++) {
      if (value % 40 == 0) {
        let section = document.createElement('section');
        section.innerHTML = "<button>show/hide images</button>";
        gallery.appendChild(section);
        let div = document.createElement('div');
        i < 40 ? div.style.height = "auto" : div.style.height = "0";
        section.appendChild(div);
        lastSec = gallery.querySelector('section:nth-last-child(1)');
        lastSec.classList.add(`photos_from_${value+1}`)
      }
      value++;
      let img = document.createElement('img');
      img.setAttribute('src', data.photos[i].img_src);
      img.setAttribute('data-camera', data.photos[i].camera.full_name);
      img.setAttribute('data-earth_date', data.photos[i].earth_date);
      img.setAttribute('data-sol', data.photos[i].sol);
      //sol
      lastSec.querySelector('div').appendChild(img);
    }
    const imagesSlots = gallery.querySelectorAll('section');
    imagesSlots.forEach(slot => slot.addEventListener('click', this.hidingShowingImg));

    imagesSlots.forEach(slot => slot.querySelector('div').addEventListener('click', this.choseImg));

    this.smoothScroll(gallery);

    //POKAŻ SOL/DZIEŃ ZIEMSKI
    // console.log(data.photos[0].sol);
    // console.log(data.photos[0].earth_date);
  }
  hidingShowingImg(e) {
    if (e.target.localName === 'button') {
      let div = e.target.parentElement.querySelector('div');
      if (div.style.height === '0px') {
        div.style.height = 'auto';
      } else if (div.style.height !== 0) {
        div.style.height = 0;
      }
    }
  }

  choseImg(e) {
    e.target.style.transform = 'scale(0.95)';
    e.target.addEventListener('transitionend', () => {
      e.target.style.transform = 'scale(1)';
    })
    const pictureOnScreen = document.createElement('div');
    pictureOnScreen.classList.add('preview');
    const left = document.createElement('div');
    left.classList.add('left-arrow');
    left.innerHTML = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
    const close = document.createElement('div');
    close.classList.add('close');
    close.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
    const right = document.createElement('div');
    right.classList.add('right-arrow');
    right.innerHTML = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
    const photo = document.createElement('img');
    photo.setAttribute('src', `${e.target.getAttribute('src')}`);
    let viewingPhoto = e.target;
    let nextSib = viewingPhoto.nextSibling;
    let prevSib = viewingPhoto.previousSibling;
    let nextLink;

    console.log(prevSib.currentSrc, nextSib.currentSrc);
    pictureOnScreen.append(photo, left, close, right);

    const src = document.querySelector('script');
    document.body.insertBefore(pictureOnScreen, src);

    console.log(e.target);
    console.log(e.target.getAttribute('data-camera'));
    console.log(e.target.getAttribute('data-earth_date'));
    console.log(e.target.getAttribute('data-sol'));

    right.addEventListener('click', () => {
      nextLink = nextSib.currentSrc;
      viewingPhoto = viewingPhoto.nextSibling;
      photo.setAttribute('src', `${nextLink}`);
      nextSib = viewingPhoto.nextSibling;
      prevSib = viewingPhoto.previousSibling;
    });
    left.addEventListener('click', () => {
      nextLink = prevSib.currentSrc;
      viewingPhoto = viewingPhoto.previousSibling;
      photo.setAttribute('src', `${nextLink}`);
      nextSib = viewingPhoto.nextSibling;
      prevSib = viewingPhoto.previousSibling;
    });
    close.addEventListener('click', () => {
      document.body.removeChild(pictureOnScreen);
    })
  }
}

class Gallery {
  constructor() {
    this.header = document.querySelector('.welcome');
    this.wrapper = document.querySelector('.wrapper');
    this.opacityLevel;
    this.introduction = document.querySelector('.introduction');
    this.interface = document.querySelector('.interface');
    this.footer = document.querySelector('.about');
    this.burger = document.querySelector('.menu__burger');
    this.fa = this.burger.querySelector('.fa');
    this.nav = document.querySelector('.menu');
    this.navLinks = this.nav.querySelectorAll('ul li a');
    this.navLinks.forEach(link => link.addEventListener('click', this.menu.bind(this)));
    this.burger.addEventListener('click', this.toggleMenu.bind(this));
    window.addEventListener('scroll', this.hideHeader.bind(this));
  }
  headerWrapperBlur(value) {
    this.header.style.filter = `blur(${value}px)`;
    this.wrapper.style.filter = `blur(${value}px)`;
  }
  hideBurgerIfScroll() {
    if (this.opacityLevel > '40' && this.fa.classList.contains('fa-bars')) return;
    if (this.opacityLevel >= '30') {
      this.nav.style.transform = 'translateY(-100%)';
      this.fa.classList.remove('fa-times');
      this.fa.classList.add('fa-bars');
    } else if (this.opacityLevel < '30') {
      this.nav.style.transform = 'translateY(-130%)';
    }
    this.headerWrapperBlur(0);
  }
  hideHeader() {
    if ((this.wrapper.offsetTop + window.scrollY) > this.wrapper.offsetTop * 2 === false) {
      this.opacityLevel = Math.round(((this.wrapper.offsetTop - window.innerHeight) + window.scrollY) / window.innerHeight * 100);
      this.opacityLevel >= 100 ? this.opacityLevel = 100 : this.opacityLevel;
      this.header.style.opacity = `${100 - this.opacityLevel}%`;
      this.wrapper.style.opacity = `${this.opacityLevel}%`;
      console.log(((this.wrapper.offsetTop + window.scrollY) > this.wrapper.offsetTop * 2) === true);
    }
    //Pozycja burgera względem przewinięcia strony
    this.hideBurgerIfScroll();
  }
  switchBurgerIcon() {
    if (this.fa.classList.contains('fa-bars')) {
      this.nav.style.transform = 'translateY(0%)';
      this.fa.classList.remove('fa-bars');
      this.fa.classList.add('fa-times');
      this.headerWrapperBlur(3);
    } else {
      this.nav.style.transform = 'translateY(-100%)';
      this.fa.classList.remove('fa-times');
      this.fa.classList.add('fa-bars');
      this.headerWrapperBlur(0);
    }
    this.fa.style.transform = 'translate(-50%, -50%) scaleY(0.9)';
  }
  toggleMenu() {
    this.fa.style.transform = 'translate(-50%, -50%) scaleY(0.0)';
    setTimeout(this.switchBurgerIcon.bind(this), 350);
  }
  menuScroll(section) {
    let scrollPos = (section.offsetTop + window.innerHeight);
    window.scrollTo(0, scrollPos);
  }
  menu(e) {
    if (e.target.innerText === 'Header') {
      window.scrollTo(0, 0);
    } else if (e.target.innerText === 'Introduction') {
      this.menuScroll(this.introduction);
    } else if (e.target.innerText === 'Interface') {
      this.menuScroll(this.interface);
    } else if (e.target.innerText === 'About') {
      this.menuScroll(this.footer);
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new SetUrl();
  new Gallery();
});