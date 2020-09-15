Generated Static Site
+++
@import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@300;700&display=swap');

body {
  background-color: #34495e;
  color: white;
  font-family: 'Kumbh Sans', sans-serif;
  padding: 10vh 10vw 10vh 10vw;
  font-size: 1.5em;
  transition: 2s ease-in-out background-color;
}

code {
  background-color: black;
  padding: 0px 2px 0px 2px;
  color: #f1c40f;
}

+++
var colors = ['#34495e', '#16a085', '#d35400', '#c0392b', '#f39c12'];
setInterval(function(){
  var color = colors[Math.floor(Math.random() * colors.length)];
  document.getElementsByTagName('body')[0].style = 'background-color:' + color;
}, 5000);

+++
# Hello World

Welcome to your generated static site.

### How is it done?

- Write title, css, scripts and markdown in `src/main.md` file
- Use node script and `showdown` to convert `.md` into **html** template
- Write generated template into `dist/index.html` path using node script
- Serve `dist` folder as static content through express app
