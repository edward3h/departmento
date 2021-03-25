import * as yaml from "https://esm.run/js-yaml";

const data = fetch("./data.yml").then((response) => yaml.load(response.text()));

export default await data;
