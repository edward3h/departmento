(function () {
  const administratum = window.location.hostname == "www.administratum.net";
  if (!administratum) {
    return;
  }
  const trigger = window.departmento;
  if (trigger) {
    trigger();
  } else {
    const scriptTag = document.createElement("script");
    scriptTag.type = "module";
    scriptTag.src = "__site__url__/assets/js/main.mjs";
    document.body.appendChild(scriptTag);
  }
})();
