import $ from "./jquery-module.mjs";
import printView from "./print-view.mjs";
import getData from "./get-data.mjs";

const LOADED = "departmento_loaded";
const MUTATION_TIMEOUT = 500;

const _applyOnce = () => {
  if ($(`#${LOADED}`).length) {
    return;
  }

  $("head").append(`<style>
    .departmento {
        background-color: black;
        color: #CCC;
    }
    .agenda {
        cursor: pointer;
    }
    .agenda.checked {
        font-weight: bold;
        color: black;
    }
    .agenda.unchecked {
        color: #777;
    }
    </style>`);

  let loaded = document.createElement("div");
  loaded.id = LOADED;
  loaded.style.display = "none";
  document.body.appendChild(loaded);
};

const _container = (data) => {
  let container = document.querySelector("#departmento_root");

  if (container) {
    return;
  }

  container = document.createElement("div");
  container.id = "departmento_root";
  container.style.textAlign = "center";
  container.style.fontSize = "1.25rem";
  container.style.padding = "0.3125rem";
  container.style.backgroundColor = "black";
  container.style.color = "#BBB";
  container.innerHTML = `+ D e p a r t m e n t o <sub>Build: ${data.version}</sub>`;

  const navbar = document.querySelector(".navbar");
  const navbarDiv = document.querySelector(".navbar div");

  navbar.insertBefore(container, navbarDiv);
};

async function _apply() {
  let data = await getData();
  console.log("data: ", data);
  _container(data);
  const path = window.location.pathname;
  if (path.startsWith("/forces/print")) {
    printView(data);
  }
}

(function () {
  _applyOnce();

  let timeoutID;
  const observer = new MutationObserver((mutations, o) => {
    window.clearTimeout(timeoutID); // safe, fails silently https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout#notes
    timeoutID = window.setTimeout(_apply, MUTATION_TIMEOUT);
  });
  const app = document.querySelector("app");
  observer.observe(app, { childList: true });

  window.departmento = _apply;
  timeoutID = window.setTimeout(_apply, 0);
})();
