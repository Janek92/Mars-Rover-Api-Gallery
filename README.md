# Mars Rover Api Gallery

![tutorial thumbnail](./images/screen.jpg)

Small website that uses NASA api with pictures of three mars rovers. I made it as my first project. The subject was selected according to my personal hobbies.

https://www.marsredplanetgallery.com/

## Technologies

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![SCSS](https://img.shields.io/badge/Scss-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

## How it works

Every single selection of specific rover is fetching information about day of landing and maximum day of expedition and assign it into inputs so the values are always proper to selected rover.

## Usage

To manage the project just clone the repository:

```
git clone https://github.com/Janek92/Mars-Rover-Api-Gallery.git
```

Take your api key in https://api.nasa.gov/ and assign it in `index.js` to `this.apiKey`.

You don't have to install it because it is not created as npm project but it uses sass files so in order to change styles you need Live Sass Compiler. If you are using VSC press `ctrl+P` and type

```

ext install glenn2223.live-sass

```

or download it via extension installer. In your settings.json type the following block of code:

```

"liveSassCompile.settings.formats": [
{
"format": "expanded",
"extensionName": ".css",
"savePath": "~/../css/"
}
],

```
