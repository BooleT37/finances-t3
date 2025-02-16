import { QuestionCircleFilled } from "@ant-design/icons";
import { Space, Tooltip } from "antd";
import type React from "react";

const tooltipText = (
  <>
    <p>
      <b>Что такое парсер расходов?</b>
    </p>
    <p>
      На странице данных вы можете импортировать свои расходы из банковских
      выписок. Для этого вам нужно сопоставить источник этих расходов с парсером
      из списка. Если для вашего банка нет парсера, напишите мне на
      <a href="mailto:aide.service.37@gmail.com">aide.service.37@gmail.com</a>,
      чтобы я добавил его.
    </p>
  </>
);

export const ParserHeader: React.FC = () => (
  <Space>
    <span>Парсер расходов</span>
    <Tooltip title={tooltipText}>
      <QuestionCircleFilled />
    </Tooltip>
  </Space>
);
