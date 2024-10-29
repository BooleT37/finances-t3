import { Space } from "antd";
import { CategoryIconComp } from "./CategoryIconComp";

interface Props {
  name: string;
  icon?: string | null;
}

// eslint-disable-next-line mobx/missing-observer
export const NameWithOptionalIcon: React.FC<Props> = ({ name, icon }) => {
  if (icon) {
    return (
      <Space>
        <CategoryIconComp value={icon} />
        {name}
      </Space>
    );
  }
  return <>{name}</>;
};
