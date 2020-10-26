const { writeFileSync, write, writeFile } = require('fs');
const lessonData = require("./lessons.json");

const PROJECT_TREE_PATH = "https://github.com/introspective-code/fullstack-js-lessons/tree/master";
const HTML_PATH = "./index.html";
const README_PATH = "./README.md";
const FAVICON = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/open-book_1f4d6.png";

const getMarkup = () =>
  `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Fullstack JavaScript Lessons | Introspective Code</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta property="og:url" content="https://introspective-code.github.io/" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Fullstack JavaScript Lessons" />
      <meta
        property="og:description"
        content="A collection of full-stack JavaScript projects for learning modern js fundamentals."
      />
      <meta
        property="og:image"
        content="https://introspective-code.github.io/fullstack-js-lessons/opengraph-image.png"
      />
      <meta
        name="description"
        content="A collection of full-stack JavaScript projects for learning modern js fundamentals."
      />
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;700&display=swap" rel="stylesheet">
      <link rel="icon" type="image/png" sizes="16x16" href="${FAVICON}">
      <style>
        ${styles}
      </style>
    </head>
    <body>
      ${getBody()}
      <script>
        ${getScript()}
      </script>
    </body>
  </html>
`.trim();

const styles = `
  body {
    background-color: #0a3d62;
    color: #82ccdd;
    font-family: 'Quicksand', sans-serif;
    font-size: 1em;
    padding: 2rem;
  }

  .title {
    font-size: 3em;
    margin-bottom: 1rem;
  }

  .highlight {
    color: #38ada9;
    text-decoration: underline;
  }

  .bold {
    font-weight: 800;
  }

  .thin {
    font-weight: 100;
  }

  .row {
    display: flex;
    justify-content: center;
  }

  .column {
    padding: 2vw;
  }

  .lessons {
    display: flex;
    flex-wrap: wrap;
  }

  .lesson {
    margin: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #82ccdd;
    border-radius: 0.5rem;
    cursor: pointer;
    color: #82ccdd;
    font-size: 1.15rem;
    transition: 200ms ease-in-out all;
  }

  .lesson:hover {
    border: 1px solid #f6b93b;
    color: #f6b93b;
  }

  .lesson-name {
    font-weight: 800;
  }

  .lesson-topics {
    font-size: 1rem;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    color: #f6b93b;
    padding: 0.5rem;
    cursor: pointer;
  }

  .topic {
    padding: 0.25rem;
    text-decoration: underline;
  }

  .header {
    font-size: 1.4rem;
    font-weight: 100;
    color: #3c6382;
  }

  .footer {
    text-align: center;
    color: #3c6382;
    font-size: 1rem;
  }

  a {
    color: inherit;
  }

  .topic-selected, .lesson-selected {
    color: #e55039;
  }

  .lesson-selected {
    border-color: #e55039;
  }

  .topic-unselected {
    color: #3c6382;
  }

  .lesson-unselected {
    opacity: 0.25;
  }

  .desc {
    margin-bottom: 1rem;
  }
`;

const getBody = () => {
  const lessons = lessonData.map(
    ({ name, path, topics }) => `
    <div class="lesson" data-topics="${topics.join(",")}" onclick="window.location.href='${PROJECT_TREE_PATH}${path}'">
      <div class="lesson-name">${name}</div>
      <div class="lesson-topics">${topics.join(", ").trim()}</div>
    </div>
  `
  ).join("\n");

  const allTopics = lessonData.map(({ topics }) => topics)
    .flat()
    .filter((x, i, a) => a.indexOf(x) === i)
    .map(topic => `<div class="topic" data-topic="${topic}" onclick="handleTopicSelection('${topic}')">${topic}</div>`)
    .join("\n");

  return `
    <div class="row">
      <div class="column">
        <div class="title thin">Fullstack <span class="highlight">JavaScript Lessons</span></div>
        <div class="desc">A collection of full-stack JavaScript projects for learning modern js fundamentals.</div>
        <div class="header">Topics:</div>
        <div class="topics">
        ${allTopics}
        </div>
        <div class="header">Example Projects:</div>
        <div class="lessons">
          ${lessons}
        </div>
      </div>
    </div>
    <div class="footer">
      Made in Toronto with ❤️ &nbspfrom <a href="https://github.com/introspective-code">Introspective Code.</a>
    </div>
  `;
};

const getScript = () => `
  var RESET_TOPIC_COLOR = 'white';
  var SELECTED_TOPIC_COLOR = 'red';

  var selectedTopics = [];
  var lessons = document.getElementsByClassName("lesson");
  var topics = document.getElementsByClassName("topic");

  function handleTopicSelection(topic) {
    if (selectedTopics.indexOf(topic) < 0) {
      selectedTopics.push(topic);
    } else {
      selectedTopics = selectedTopics.filter(function(item){ return item !== topic });
    }

    for (var i = 0; i < topics.length; i++) {
      topics[i].classList.remove('topic-selected');
      topics[i].classList.remove('topic-unselected');
    }
    for (var i = 0; i < lessons.length; i++) {
      lessons[i].classList.remove('lesson-selected');
      lessons[i].classList.remove('lesson-unselected');
    }

    if (selectedTopics.length > 0) {
      selectedTopics.forEach(function(selectedTopic){
        for (var i = 0; i < topics.length; i++) {
          if (topics[i].dataset.topic === selectedTopic) {
            topics[i].classList.add('topic-selected');
          }
        }
        for (var i = 0; i < lessons.length; i++) {
          if (lessons[i].dataset.topics.includes(selectedTopic)) {
            lessons[i].classList.add('lesson-selected');
          }
        }
      });

      for (var i = 0; i < topics.length; i++) {
        if (!topics[i].classList.contains('topic-selected')) {
          topics[i].classList.add('topic-unselected');
        }
      }
      for (var i = 0; i < lessons.length; i++) {
        if (!lessons[i].classList.contains('lesson-selected')) {
          lessons[i].classList.add('lesson-unselected');
        }
      }
    }

  }

  function isMatchingTopicForLessons(dataString, selectedTopics) {
    var output = true;
    for (var i = 0; i < selectedTopics.length; i++) {
      if (!dataString.includes(selectedTopics[i])) {
        output = false;
        break;
      }
    }
    return output;
  }

  function isMatchingTopicForTopics(dataString, selectedTopics) {
    var output = false;
    for (var i = 0; i < selectedTopics.length; i++) {
      if (selectedTopics[i] === dataString) {
        output = true;
        break;
      }
    }
    return output;
  }
`;

const getReadme = () =>`# Full-Stack JavaScript Lessons

A collection of full-stack JavaScript projects for learning modern js fundamentals.

### Table Of Contents

${lessonData.map(({ name, path }) => `- [${name}](${path})`).join("\n")}

### License

MIT
`;

function main() {
  writeFileSync(README_PATH, getReadme());
  writeFileSync(HTML_PATH, getMarkup());
}

main();