export const GET_CHANGELOG_MD = (language: "ru" | "en"): string => {
  switch (language) {
    case "en":
      return "<!-- Description of changes  -->";
    case "ru":
      return "<!-- Описание изменений -->";
    default:
      return "";
  }
};

export const GET_DOC_MD = (language: "ru" | "en"): string => {
  switch (language) {
    case "en":
      return "<!-- Package documentation -->";
    case "ru":
      return "<!-- Документация по пакету -->";
    default:
      return "";
  }
};
