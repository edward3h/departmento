import * as yaml from "https://esm.run/js-yaml";

let _data;

async function getData() {
  if (!_data) {
    let response = await fetch(new URL("data.yml", import.meta.url));
    let text = await response.text();
    _data = yaml.load(text);
    console.log(_data);
  }
  return _data;
}

export default getData;
