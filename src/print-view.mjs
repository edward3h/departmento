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
  deselected: {
    display: "Unselected Units",
    hideFilter: "tbody tr:not(.selected)",
  },
};

let _battleSize;

const _updateAgendaCols = (battleSize) => {
  let count = 1;
  if (battleSize) {
    count = battleSize.agendas || 1;
  }
  const selectedAgendas = $(".agenda.checked")
    .map((i, el) => el.textContent.replace(CHECKED, "").replace(",", "").trim())
    .get();
  for (let i = 0; i < 4; i++) {
    let name =
      selectedAgendas.length > i ? selectedAgendas[i] : `Agenda ${i + 1}`;
    $("thead td.agenda" + i).text(name);
    if (i < count) {
      $("td.agenda" + i).show();
    } else {
      $("td.agenda" + i).hide();
    }
  }
};

const _extract = () => {
  const powerSystem = $("dt").filter(':contains("Power System")').next().text();
  const usePoints = powerSystem.trim() == "Points";
  store.save("usePoints", usePoints);
  if (usePoints) {
    const pointsPerPLS = $("dt")
      .filter(":contains('Points per PL')")
      .next()
      .text();
    const pointsPerPL = parseInt(pointsPerPLS, 10);
    if (!isNaN(pointsPerPL)) {
      store.save("pointsPerPL", pointsPerPL);
    }
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

  const units = {};
  $("dl.row dt")
    .filter(":contains('Datasheet Source')")
    .each(function () {
      const source = $(this).next().text().trim();
      const role = $(this).nextAll(":contains('Role')").next().text().trim();
      const name = $(this)
        .parents("div.row")
        .prev("div.row")
        .find("h3")
        .text()
        .trim();
      units[name] = { name, role, source };
    });
  store.save("units", units);
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
    _updateAgendaCols(_battleSize);
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

const _pointsField = () => {
  const usePoints = store.load("usePoints");
  let points =
    store.load("points") ||
    (usePoints
      ? _battleSize.power * store.load("pointsPerPL")
      : _battleSize.power);
  $("div.row div.col")
    .filter(":contains('Power Level')")
    .html(
      `<label for="points">${
        usePoints ? "Points" : "Power"
      }</label><input type="number" id="points" value="${points}">`
    );
  $("#points").on("change", (evt) => store.save("points", evt.target.value));
  $("#departmento_root").on("departmento_size", (evt) =>
    $("#points")
      .val(
        usePoints
          ? evt.value.power * store.load("pointsPerPL")
          : evt.value.power
      )
      .trigger("change")
  );
};

const _battleSizeSelector = (data) => {
  let selectedSize = store.load("battle_size") || 1;
  _battleSize = data.battle_size[selectedSize];
  let options = data.battle_size
    .map(
      (v, i) =>
        `<option value="${i}" ${i == selectedSize ? "selected" : ""}>${
          v.name
        }</option>`
    )
    .join();
  $("div.row div.col")
    .filter(":contains('Location')")
    .html(
      `<label for="battle_size">Battle Size</label><select id="battle_size">${options}</select>`
    );
  $("#battle_size").on("change", (evt) => {
    let sizeIndex = evt.target.value;
    store.save("battle_size", sizeIndex);
    _battleSize = data.battle_size[sizeIndex];
    $("#departmento_root").trigger({
      type: "departmento_size",
      value: data.battle_size[sizeIndex],
    });
  });
};

const _rosterColumnMods = () => {
  $("table").first().find("td span:nth-child(2)").remove();
  $("table").first().find("td:nth-child(8)").remove();
  $("table")
    .first()
    .find("thead td:nth-child(6)")
    .replaceWith(
      `<td class="agenda0"></td><td class="agenda1"></td><td class="agenda2"></td><td class="agenda3"></td>`
    );
  $("table")
    .first()
    .find("tbody td:nth-child(6)")
    .replaceWith(
      `<td class="agenda0">❏❏❏</td><td class="agenda1">❏❏❏</td><td class="agenda2">❏❏❏</td><td class="agenda3">❏❏❏</td>`
    );
  _updateAgendaCols(_battleSize);
  $("#departmento_root").on("departmento_size", (evt) =>
    _updateAgendaCols(evt.value)
  );
};

const _sum = (acc, cur) => acc + cur;
const _recomputePoints = () => {
  const total = $("tbody tr.selected td:nth-child(3)")
    .map(function () {
      return parseInt(this.textContent, 10);
    })
    .get()
    .reduce(_sum, 0);
  $("#pointsSelected").text(total);
};

const _armySelection = () => {
  $("#departmento_root").after(`<div class="departmento d-print-none">
  <dl class="row">
  <dt class="col-sm-4">Army Selection</dt>
  <dd class="col-sm-8" id="pointsSelected"></dd>
  </dl>`);
  $("tbody td:first-child")
    .filter(":contains('❏')")
    .next()
    .addBack()
    .addClass("armySelector");
  $("td.armySelector").on("click", (evt) => {
    const row = $(evt.target).parent();
    if (row.hasClass("selected")) {
      row.removeClass("selected");
      row.next().removeClass("selected");
      row.find("td:first-child").text(UNCHECKED);
    } else {
      row.addClass("selected");
      row.next().addClass("selected");
      row.find("td:first-child").text(CHECKED);
    }
    _recomputePoints();
  });
};

const _printView = (data) => {
  _extract();
  _hideDetails();
  _agendaSpans();

  $("div.btn-group").removeClass("mt-5 my-5")
    .after(`<div id="departmento_controls" class="btn-group departmento d-print-none">
      </div>`);

  _showHideFields();
  _battleSizeSelector(data);
  _pointsField();
  _rosterColumnMods();
  _armySelection();
};

export default _printView;
