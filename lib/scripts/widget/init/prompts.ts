import type { Prompts } from "node-plop";
import type { ListQuestion } from "inquirer";

type PackageManager = "npm" | "yarn";

type Answers = {
  packageName: string;
  author: string;
  widgetName: string;
  packageDescription?: string;
  packageManager: PackageManager;
};

const notEmptyValidator = (input: string) => !!input;

const prompts = [
  {
    message: "Enter the name of the package: ",
    type: "input",
    name: "packageName",
    validate: notEmptyValidator,
  },
  {
    message: "Enter a description for the package: ",
    type: "input",
    name: "packageDescription",
    default: "",
  },
  {
    message: "Enter the name of the package author: ",
    type: "input",
    name: "author",
    validate: notEmptyValidator,
  },
  {
    message: "Select the package manager: ",
    type: "list",
    name: "packageManager",
    default: "yarn",
    choices: [
      {
        name: "npm",
        value: "npm",
      },
      {
        name: "yarn",
        value: "yarn",
      },
    ],
  } as ListQuestion,
] satisfies Prompts;

export { prompts };
export type { Answers, PackageManager };
