import React from "react";

interface Props {
  children: React.ReactNode;
}

const WrapperDiv: React.FC<Props> = (props: Props) => {
  return <div className="page-layout">{props.children}</div>;
};

export default WrapperDiv;
