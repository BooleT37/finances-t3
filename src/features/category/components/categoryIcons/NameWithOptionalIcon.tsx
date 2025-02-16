import { Space } from "antd";
import { CategoryIconComp } from "./CategoryIconComp";

interface Props {
  name: string;
  icon?: string | null;
  testId?: string;
}

export const NameWithOptionalIcon: React.FC<Props> = ({
  name,
  icon,
  testId,
}) => {
  if (icon) {
    return (
      <Space data-testid={testId}>
        <CategoryIconComp value={icon} />
        {name}
      </Space>
    );
  }
  return <span data-testid={testId}>{name}</span>;
};
