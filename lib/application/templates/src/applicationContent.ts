export const APPLICATION_CONTENT_TEMPLATE = `\
import { FC } from "react";
import type { IApplicationProps } from "@infomaximum/application-types";

export interface IContentProps extends IApplicationProps {}

const Content: FC<IContentProps> = () => {
  return <div>Application example</div>;
};

export default Content;
`;
