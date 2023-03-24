import { InputNumber, type InputNumberProps } from "antd";
import React from "react";

// eslint-disable-next-line mobx/missing-observer
export const CostInput: React.FC<InputNumberProps<string>> = (props) => (
  <InputNumber addonAfter="€" style={{ width: 130 }} {...props} />
);
