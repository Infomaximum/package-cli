import path from "node:path";
import { run } from "plop";

export const runInit = (initPath: string) => {
  const createPath = path.resolve(process.cwd(), initPath);
  console.warn(createPath);

  run(
    {
      cwd: createPath,
    } as any,
    1,
    true
  );
};
