import {readFile} from "node:fs/promises";
import {dirname, join} from "node:path";

const { pathname } = new URL(import.meta.url);
const directory = dirname(pathname);

const packageJSON = await readFile(join(directory, "../../package.json"), "utf-8")
const packageInfo = JSON.parse(packageJSON);

export const name: string = packageInfo.name;
export const version: string = packageInfo.version;
export const packageIdentifier = `${name}@${version}`;
export const homepage: string = packageInfo.homepage;
