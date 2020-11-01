const { writeFileSync, readdirSync, lstatSync, readFileSync } = require("fs");
const path = require('path');
const lessonData = require("./lessons.json");

const PROJECT_TREE_PATH = "https://github.com/introspective-code/fullstack-js-lessons/tree/master";
const PROJECT_PATH = "./";
const HTML_PATH = "./index.html";
const README_PATH = "./README.md";
const FAVICON = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/open-book_1f4d6.png";

const getMarkup = ({ pathContent }) =>
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
      <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap" rel="stylesheet">
      <link rel="icon" type="image/png" sizes="16x16" href="${FAVICON}">
      <link rel="stylesheet"
            href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/tomorrow-night-bright.min.css">
      <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/highlight.min.js"></script>
      <style>
        ${styles}
      </style>
    </head>
    <body>
      ${getBody({ pathContent })}
      <script>
        ${getScript({ pathContent })}
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
    width: 100%;
  }

  @media only screen and (min-width: 1300px) {
    .column {
      width: 60%;
    }
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
    cursor: pointer;
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

  .file-preview-content {

  }

  .lesson-file-previews {
    display: flex;
  }

  .file-preview-path {
    font-size: 0.75rem;
    border: 1px solid #3c6382;
    color: #3c6382;
    margin: 0.5rem 0.5rem 0 0;
    padding: 0.25rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .file-preview-path:hover {
    border: 1px solid #78e08f;
    color: #78e08f;
  }

  #modal {
    position: absolute;
    visibility: hidden;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    background-color: #000000e8;
    width: 80vw;
    height: 80vh;
    border-radius: 0.5rem;
    padding: 2rem;
    z-index: 1;
  }

  .hljs {
    background-color: transparent;
  }

  #modal-filename {
    margin-bottom: 1rem;
  }

  .modal-container {
    overflow-y: scroll;
    max-height: 85%;
  }

  pre {
    font-size: 1rem;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #0a3d62;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #3c6382;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #3c6382;
  }

  code {
    font-family: 'Roboto Mono', monospace;
  }

  .project-name {
    color: #f6b93b;
  }

  .project-filename {
    color: #38ada9;
    font-weight: bolder;
  }

  .modal-close {
    text-align: right;
    cursor: pointer;
    transition: 200ms ease-in-out color;
  }

  .modal-close:hover {
    color: #eb2f06;
  }

  .modal-close:active {
    opacity: 0.5;
  }
`;

const getBody = ({ pathContent }) => {
  const lessons = getLessonsWithPathContent({ lessonData, pathContent })
    .map(
      ({ name, path, topics, content }) => `
    <div class="lesson" data-topics="${topics.join(",")}">
      <div class="lesson-name" onclick="window.location.href='${PROJECT_TREE_PATH}${path}'">${name}</div>
      <div class="lesson-topics">${topics.join(", ").trim()}</div>
      <div class="lesson-file-previews">${getContent({ content })}</div>
    </div>
  `
    )
    .join("\n");

  const allTopics = lessonData.map(({ topics }) => topics)
    .flat()
    .filter((x, i, a) => a.indexOf(x) === i)
    .map(topic => `<div class="topic" data-topic="${topic}" onclick="handleTopicSelection('${topic}')">${topic}</div>`)
    .join("\n");

  return `
    <div id="modal">
      <div onclick="closeModal();" class="modal-close">Close</div>
      <div id="modal-filename"></div>
      <div class="modal-container">
        <pre><code id="modal-content"></code></pre>
      </div>
    </div>
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

const getScript = ({ pathContent }) => `
  var modalOpen = false;
  var selectedTopics = [];
  var lessons = document.getElementsByClassName("lesson");
  var topics = document.getElementsByClassName("topic");
  var allContent = Object.values(${JSON.stringify(pathContent)}).flat();
  allContent = allContent.reduce(function(obj, item){
    obj[item.pathToProcess] = { project: item.project, content: window.atob(item.content), extension: item.extension };
    return obj;
  }, {});

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

  function openModal(path) {
    var modal = document.getElementById('modal');
    var modalContent = document.getElementById('modal-content');
    var modalFilename = document.getElementById('modal-filename');
    modal.style.visibility = 'visible';
    modalContent.innerHTML = allContent[path].content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    modalContent.className = "language-" + allContent[path].extension;
    hljs.highlightBlock(modalContent);
    modalFilename.innerHTML = '<span class="project-name">' + allContent[path].project + '</span> / <span class="project-filename">' + path.split('/').slice(2).join('/') + '</span>';
    setTimeout(function(){
      modalOpen = true
    }, 200);
  }

  function closeModal() {
    modalOpen = false;
    modal.style.visibility = 'hidden';
  }

  window.addEventListener('click', function(e){
    if (!document.getElementById('modal').contains(e.target) && modalOpen === true) {
      document.getElementById('modal').style.visibility = 'hidden';
      modalOpen = false;
    }
  });
`;

const getReadme = () =>`# Full-Stack JavaScript Lessons

A collection of full-stack JavaScript projects for learning modern js fundamentals.

### Table Of Contents

${lessonData.map(({ name, path }) => `- [${name}](${path})`).join("\n")}

### License

MIT
`;

const getContent = ({ content }) => {
  return content.map(({ pathToProcess, content }) => {
    return `
      <div onclick="openModal('${pathToProcess}')" class="file-preview-path">${pathToProcess
      .split("/")
      .slice(2)
      .join("/")}</div>
    `;
  }).join('\n');
}

function getLessonsWithPathContent({ lessonData, pathContent }) {
  return lessonData.map(lesson => {
    return {
      ...lesson,
      content: pathContent[lesson.path.replace('/', '')]
    }
  });
}

function getPathContent(dir) {
  let paths = [];

  readdirSync(dir).forEach((file) => {
    let fullPath = path.join(dir, file);
    if (
      lstatSync(fullPath).isDirectory() &&
      !fullPath.includes('node_modules') &&
      !fullPath.includes('.git')
    ) {
      paths.push(fullPath);
      paths = [...paths, getPathContent(fullPath)].flat();
    } else if (
      fullPath.includes('lesson-') &&
      !fullPath.includes('node_modules') &&
      !fullPath.includes('.DS_Store') &&
      !fullPath.includes('README.md') &&
      !fullPath.includes('-lock.json') &&
      !fullPath.includes('dist')
    ) {
      paths.push(fullPath);
    }
  });

  return paths;
}

function processPaths(paths) {
  const output = {};

  const filteredPaths = paths.filter(pathToProcess => {
    return pathToProcess.includes('.');
  });

  filteredPaths.forEach(pathToProcess => {
    const key = pathToProcess.split('/')[0];

    if (!output[key]) {
      output[key] = [
        {
          project: pathToProcess.split('/')[0]
            ? pathToProcess.split('/')[0]
            : pathToProcess,
          pathToProcess: `/${pathToProcess}`,
          content: Buffer.from(readFileSync(pathToProcess, 'utf-8')).toString('base64'),
          extension: path.extname(pathToProcess).replace(".", "")
        }
      ];
    } else {
      output[key] = [
        ...output[key],
        {
          project: pathToProcess.split("/")[0]
            ? pathToProcess.split("/")[0]
            : pathToProcess,
          pathToProcess: `/${pathToProcess}`,
          content: Buffer.from(readFileSync(pathToProcess, "utf-8")).toString(
            "base64"
          ),
          extension: path.extname(pathToProcess).replace(".", ""),
        },
      ];
    }
  });

  return output;
}

function main() {
  writeFileSync(README_PATH, getReadme());
  writeFileSync(HTML_PATH, getMarkup({
    pathContent: processPaths(getPathContent(PROJECT_PATH))
  }));
}

main();