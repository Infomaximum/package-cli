export type TemplateSource =
  | {
      type: "inline";
    }
  | {
      type: "dir";
      dirPath: string;
    }
  | {
      type: "npm";
      spec: string;
      templateDir?: string;
    };

export type TemplatePackConfig = {
  templateDir?: string;
  ignoreNames?: string[];
  pathRewrites?: Array<{
    from: string;
    to: string;
  }>;
  replacements?: Array<{
    from: string;
    to: string;
    includeExtensions?: string[];
  }>;
  jsonEdits?: Array<{
    file: string;
    set: Record<string, string>;
  }>;
};

export type ResolvedTemplatePack = {
  rootDir: string;
  templateDir: string;
  config: TemplatePackConfig;
};

