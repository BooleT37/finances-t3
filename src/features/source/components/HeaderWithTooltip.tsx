import { InfoCircleOutlined } from "@ant-design/icons";
import { Space, Tooltip } from "antd";

interface Props {
  headerName: string;
  tooltipText: string;
}

export const HeaderWithTooltip: React.FC<Props> = ({
  headerName,
  tooltipText,
}) => {
  return (
    <Space>
      {headerName}
      <Tooltip title={tooltipText} overlayInnerStyle={{ width: "400px" }}>
        <InfoCircleOutlined />
      </Tooltip>
    </Space>
  );
};
