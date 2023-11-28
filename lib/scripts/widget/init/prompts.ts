import type { Prompts } from "node-plop";

type Answers = {
  packageName: string;
  author: string;
  widgetName: string;
  packageDescription?: string;
};

const notEmptyValidator = (input: string) => !!input;

const prompts = [
  {
    message: "Введите название пакета: ",
    type: "input",
    name: "packageName",
    validate: notEmptyValidator,
  },
  {
    message: "Введите описание пакета: ",
    type: "input",
    name: "packageDescription",
    default: "",
  },
  {
    message: "Имя автора пакета: ",
    type: "input",
    name: "author",
    validate: notEmptyValidator,
  },
] satisfies Prompts;

export { prompts };
export type { Answers };
