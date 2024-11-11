import { Tooltip } from "antd";
import Link from "next/link";
import type React from "react";

const tooltipText = (
  <>
    <p>
      Для этого источника не выбран парсер расходов. Чтобы назначить парсер
      расходов, перейдите на{" "}
      <Link href="/sources" style={{ textDecoration: "underline" }}>
        страницу источников
      </Link>
      .
    </p>
  </>
);

// eslint-disable-next-line mobx/missing-observer
export const NoParserTooltip: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Tooltip title={tooltipText}>{children}</Tooltip>;
