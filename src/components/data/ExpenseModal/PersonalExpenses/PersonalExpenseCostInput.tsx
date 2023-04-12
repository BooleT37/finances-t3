/*
 */

import { InputNumber, Space, Typography, type InputNumberProps } from "antd";
import React from "react";

const { Link } = Typography;

interface Props extends InputNumberProps<string> {
  onTransferAllClick(): void;
}

// eslint-disable-next-line mobx/missing-observer
export const PersonalExpenseCostInput: React.FC<Props> = (props) => (
  <Space>
    <InputNumber addonAfter="€" style={{ width: 130 }} {...props} />
    <Link
      onClick={() => {
        props.onTransferAllClick();
      }}
    >
      Перенести все
    </Link>
  </Space>
);
