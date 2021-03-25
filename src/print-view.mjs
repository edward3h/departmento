import $ from "./jquery-module.mjs";
import store from "./store.mjs";

const UNCHECKED = "❏";
const CHECKED = "☑";

const SHOW_HIDE_FIELDS = {
  astartes: {
    display: "Adeptus Astartes",
    rowFilter: ":contains('Adeptus Astartes')",
  },
  necrons: {
    display: "Necrons",
    rowFilter: ":contains('Necrons')",
  },
  btv: {
    display: "BtV",
    hideFilter: '.agenda:contains("(BtV)")',
  },
};

const _extract = () => {
  const pointsPerPLS = $("dt")
    .filter(":contains('Points per PL')")
    .next()
    .text();
  const pointsPerPL = parseInt(pointsPerPLS, 10);
  if (!isNaN(pointsPerPL)) {
    store.save("pointsPerPL", pointsPerPL);
  }

  const opponents = [];
  $("dt")
    .filter(":contains('Opponent')")
    .each(function () {
      if (this.textContent === "Opponent") {
        const name = $(this).next().text();
        opponents.push(name.trim());
      }
    });
  store.save("opponents", opponents);
};

const _hideDetails = () => {
  $("div.form-check")
    .not(":contains('Battle Sheet')")
    .children("input:checked")
    .each((i, x) => x.click());
};

const _agendaSpans = () => {
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
};

const _showHideFields = () => {
  const controls = $("#departmento_controls");
  Object.entries(SHOW_HIDE_FIELDS).forEach(([id, settings]) => {
    let display = settings.display || id;
    controls.append(`<div class="form-check form-check-inline">
    <input type="checkbox" id="${id}" class="form-check-input" checked><label class="form-check-label" for="${id}">${display}</label>
    </div>`);
    if (settings.rowFilter) {
      $("div.col-3").filter(settings.rowFilter).next().addBack().addClass(id);
    }
    let hideFilter = settings.hideFilter || `.${id}`;
    $(`#${id}`).on("click", function (evt) {
      if (this.checked) {
        store.save(id, true);
        $(hideFilter).show();
      } else {
        store.save(id, false);
        $(hideFilter).hide();
      }
    });

    let v = store.load(id);
    if (v === false) {
      $(`#${id}`).click();
    }
  });
};

const _printView = () => {
  _extract();
  _hideDetails();
  _agendaSpans();

  $("div.btn-group").removeClass("mt-5 my-5")
    .after(`<div id="departmento_controls" class="btn-group departmento d-print-none">
      </div>`);

  _showHideFields();
};

export default _printView;
