const PREFIX = "/departmento/";
let currentForce;

const _key = (key) => {
  if (!currentForce) {
    const path = window.location.pathname;
    if (
      path.startsWith("/forces/print/") ||
      path.startsWith("/forces/details/")
    ) {
      currentForce = path.split("/")[3];
    }
  }
  if (!currentForce) {
    console.warn(`Don't know how to get force ID from ${window.location.href}`);
    return PREFIX + key;
  }
  return `${PREFIX}${currentForce}/${key}`;
};

const save = (key, value) => {
  localStorage.setItem(_key(key), JSON.stringify(value));
};

const load = (key) => {
  return JSON.parse(localStorage.getItem(_key(key)));
};

const setForce = (forceKey) => {
  currentForce = forceKey;
};

export default { save, load, setForce };
