import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { useCurrentSpendings } from "~/features/savingSpending/facets/currentSpendings";
import { costToString } from "~/utils/costUtils";

const Wrapper = styled.div`
  position: absolute;
  right: 20px;
  top: 0;
  font-size: 18px;
  font-weight: 500;
`;

export const CurrentSpendings: React.FC = () => {
  const currentSpendings = useCurrentSpendings();
  if (currentSpendings === null) {
    return null;
  }
  return (
    <Wrapper>
      Текущие сбережения: {costToString(currentSpendings)}
      &nbsp;
      <Tooltip title="Редактировать">
        <Link href="/settings">
          <EditOutlined />
        </Link>
      </Tooltip>
    </Wrapper>
  );
};
