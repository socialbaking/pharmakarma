import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import {replaceBetween, VARIABLES_REPLACE_AFTER_TEST_COMMENT} from "./replace-between.js";
import gitCommitInfo from "git-commit-info";
import ago from "s-ago";

const PATH = "./src/karma/data"
const CLIENT_INTERFACE_GENERATED_PATH = "./src/karma/client/interface.readonly.ts"
const CLIENT_INTERFACE_PATH = "./src/karma/client/client.interface.ts"

const PACKAGE_GENERATED_PATH = "./src/karma/package.readonly.ts"

const IGNORE_TYPES = [
    "access-token",
    "background",
    "metrics"
];

const paths = await readdir(PATH)

const types = (
    await Promise.all(
        paths
            .filter(name => !IGNORE_TYPES.includes(name))
            .map(
                async (name) => {
                    const path = join(PATH, name);
                    const pathStat = await stat(path).catch(() => undefined);
                    if (!pathStat) return "";
                    if (!pathStat.isDirectory()) return "";

                    const typesPath = join(path, "types.ts");
                    const typesStat = await stat(typesPath).catch(() => undefined);
                    if (!typesStat) return "";
                    if (!typesStat.isFile()) return "";

                    const typesFile = await readFile(typesPath, "utf-8");

                    // Assume all imports are to other types that will be contained in this file
                    // If not the build will fail :)
                    return typesFile
                        .replace(/(import|export).+from.+/mg, "")
                }
            )
    )
)
    .filter(Boolean)
    .map(value => value.trim())
    .join("\n\n")

// console.log(types);


await writeFile(
    CLIENT_INTERFACE_GENERATED_PATH,
    types,
    "utf-8"
);

let client = await readFile(CLIENT_INTERFACE_PATH, "utf-8");

client = client
    .replace(/^\/\/.+/mg, "")
    .replace(/^import\s*.+/mg, "")

const interfaceContents = [client, types].map(value => value.trim()).join("\n\n");

await replaceBetween("README.md", "typescript client", `\`\`\`typescript\n${interfaceContents}\n\`\`\``)

{

    const {
        info,
        date,
        secondsBetweenCommitAndBuild,
        minutesBetweenCommitAndBuild,
        timeBetweenCommitAndBuild
    } = await import("./git-info.js");

    const packageReadonlyContents = `
// File generated by scripts/pre-build.js

export const commit = "${info.commit}";
export const commitShort = "${info.shortCommit}";
export const commitAuthor = "${info.author}";
export const commitEmail = "${info.email}";
export const commitMessage = "${info.message}";
export const commitAt = "${date.toISOString()}";
export const secondsBetweenCommitAndBuild = ${Math.round(secondsBetweenCommitAndBuild * 100) / 100};
export const minutesBetweenCommitAndBuild = ${Math.round(minutesBetweenCommitAndBuild * 100) / 100};
export const timeBetweenCommitAndBuild = "${timeBetweenCommitAndBuild}";
${VARIABLES_REPLACE_AFTER_TEST_COMMENT}
export const secondsBetweenCommitAndTestCompletion = "";
export const minutesBetweenCommitAndTestCompletion = "";
export const timeBetweenCommitAndTestCompletion = "";
    `.trim();

    await writeFile(PACKAGE_GENERATED_PATH, packageReadonlyContents, "utf-8");
}