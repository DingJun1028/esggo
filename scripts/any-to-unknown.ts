import { Project } from "ts-morph";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: path.resolve(process.cwd(), "tsconfig.json"),
  skipAddingFilesFromTsConfig: false,
});

project.addSourceFilesAtPaths(["src/**/*.ts", "src/**/*.tsx", "components/**/*.ts", "components/**/*.tsx", "lib/**/*.ts", "hooks/**/*.ts"]);

project.getSourceFiles().forEach(source => {
  source.forEachDescendant(node => {
    const type = node.getType?.();
    if (type?.isAny?.() && node.getText() === "any") {
      node.replaceWithText("unknown // TODO: refine type");
    }
  });
});

project.saveSync();

console.log("✅ any → unknown migration completed. Review // TODO comments.");
