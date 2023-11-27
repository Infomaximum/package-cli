import type { Prompts } from "node-plop";

export type Answers = {
  packageName: string;
  author: string;
  widgetName: string;
  packageDescription?: string;
};

const notEmptyValidator = (input: string) => !!input;

export const prompts = [
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
  {
    message: "Название виджета: ",
    type: "input",
    name: "widgetName",
    validate: notEmptyValidator,
  },
] satisfies Prompts;
