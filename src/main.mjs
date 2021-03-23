import $ from "./jquery-module.mjs";

const LOADED = "departmento_loaded";
const UNCHECKED = "❏";
const CHECKED = "☑";
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

const _container = () => {
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
  container.innerHTML = "+ D e p a r t m e n t o";

  const navbar = document.querySelector(".navbar");
  const navbarDiv = document.querySelector(".navbar div");

  navbar.insertBefore(container, navbarDiv);
};

const _printView = () => {
  _container();

  $("div.form-check")
    .not(":contains('Battle Sheet')")
    .children("input:checked")
    .each((i, x) => x.click());

  $("div.btn-group").removeClass("mt-5 my-5")
    .after(`<div class="btn-group departmento d-print-none">
    <div class="form-check form-check-inline">
    <input type="checkbox" id="astartes" class="form-check-input" checked><label class="form-check-label" for="astartes">Adeptus Astartes</label>
    </div>
    <div class="form-check form-check-inline">
    <input type="checkbox" id="necrons" class="form-check-input" checked><label class="form-check-label" for="necrons">Necrons</label>
    </div>    
    <div class="form-check form-check-inline">
    <input type="checkbox" id="btv" class="form-check-input" checked><label class="form-check-label" for="btv">BtV</label>
    </div>
    </div>`);

  $("div.row div.col-9").replaceWith((a, b) => {
    let inner = b.replace(
      new RegExp(`${UNCHECKED}[^,]*,?`, "g"),
      `<span class="agenda unchecked">$&</span>`
    );
    return `<div class="col-9">${inner}</div>`;
  });
  $("span.agenda").on("click", function (evt) {
    let el = $(this);
    if (el.hasClass("unchecked")) {
      el.parent().children().removeClass("checked").addClass("unchecked");
      el.parent()
        .children()
        .text((i, t) => t.replace(CHECKED, UNCHECKED));
      el.removeClass("unchecked").addClass("checked");
      el.text(el.text().replace(UNCHECKED, CHECKED));
    } else {
      el.removeClass("checked").addClass("unchecked");
      el.text(el.text().replace(CHECKED, UNCHECKED));
    }
  });

  $("div.col-3")
    .filter(":contains('Adeptus Astartes')")
    .next()
    .addBack()
    .addClass("astartes");
  $("div.col-3")
    .filter(":contains('Necrons')")
    .next()
    .addBack()
    .addClass("necrons");

  $("#astartes").on("click", function (evt) {
    if (this.checked) {
      $(".astartes").show();
    } else {
      $(".astartes").hide();
    }
  });
  $("#necrons").on("click", function (evt) {
    if (this.checked) {
      $(".necrons").show();
    } else {
      $(".necrons").hide();
    }
  });
  $("#btv").on("click", function (evt) {
    if (this.checked) {
      $('.agenda:contains("(BtV)")').show();
    } else {
      $('.agenda:contains("(BtV)")').hide();
    }
  });
};

const _apply = () => {
  const path = window.location.pathname;
  if (path.startsWith("/forces/print")) {
    _printView();
  } else {
    _container();
  }
};

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
