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
    //Nazwy kamer. Na razie do console:
    for (let i = 0; i < nr; i++) {
      console.log(data.photos[i].camera.full_name);
    }
    //Dodaj foto do div (div jest w section) po max 40 zdjęć:
    gallery.textContent = '';
    for (let i = 0; i < nr; i++) {
      if (value % 40 == 0) {
        let section = document.createElement('section');
        section.innerHTML = "<h4>show/hide images</h4>";
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
      lastSec.querySelector('div').appendChild(img);
    }
    const imagesSlots = gallery.querySelectorAll('section');
    imagesSlots.forEach(slot => slot.addEventListener('click', this.hidingShowingImg));

    this.smoothScroll(gallery);

    //POKAŻ SOL/DZIEŃ ZIEMSKI
    // console.log(data.photos[0].sol);
    // console.log(data.photos[0].earth_date);
  }
  hidingShowingImg(e) {
    if (e.target.localName === 'h4') {
      let div = e.target.parentElement.querySelector('div');
      if (div.style.height === '0px') {
        div.style.height = 'auto';
      } else if (div.style.height !== 0) {
        div.style.height = 0;
      }
    }
  }

}

document.addEventListener('DOMContentLoaded', () => {
  new SetUrl();
  const header = document.querySelector('.welcome');
  const wrapper = document.querySelector('.wrapper');
  let opacityLevel;
  const burger = document.querySelector('.menu__burger');
  const fa = burger.querySelector('.fa');
  const nav = document.querySelector('.menu');


  //Obrazek tła headera ładowany w zależności od width
  const reportWindowSize = () => {
    if (window.innerWidth <= 1280) {
      header.style.backgroundImage = "url('./images/mars1_1280.jpg')";
    } else {
      header.style.backgroundImage = "url('./images/mars1_1920.jpg')";
    }
  }

  //Znikający header i pojawiający się wrapper
  const hideHeader = () => {
    opacityLevel = Math.round(((wrapper.offsetTop - window.innerHeight) + window.scrollY) / window.innerHeight * 100);
    opacityLevel >= 100 ? opacityLevel = 100 : opacityLevel;
    header.style.opacity = `${100 - opacityLevel}%`;
    wrapper.style.opacity = `${opacityLevel}%`;
  }
  const switchBurgerIcon = () => {
    if (fa.classList.contains('fa-bars')) {
      // nav.style.transform = 'translate(0, 0)';
      fa.classList.remove('fa-bars');
      fa.classList.add('fa-times');
    } else {
      // nav.style.transform = 'translate(0, -100%)';
      fa.classList.remove('fa-times');
      fa.classList.add('fa-bars');
    }
    fa.style.transform = 'translate(-50%, -50%) scaleY(0.9)';
  }
  const toggleMenu = () => {
    // nav.style.transform = 'translateY(0px)';
    fa.style.transform = 'translate(-50%, -50%) scaleY(0.0)';
    // fa.classList.contains('fa-bars') ? nav.style.transform = 'translateY(0%)' : nav.style.transform = 'translateY(-100%)';
    setTimeout(switchBurgerIcon, 350);
  }

  reportWindowSize();
  burger.addEventListener('click', toggleMenu);
  window.addEventListener('resize', reportWindowSize);
  window.addEventListener('scroll', hideHeader);
});