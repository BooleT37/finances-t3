import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Row, Tooltip } from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import styled from "styled-components";
import savingSpendingStore from "~/stores/savingSpendingStore";
import {
  DATE_FORMAT,
  DATE_SERVER_FORMAT,
  PE_SUM_DEFAULT,
  PE_SUM_LS_KEY,
  SAVINGS_DATE_LS_KEY,
  SAVINGS_LS_KEY,
} from "~/utils/constants";
import { CostInput } from "../CostInput";

const Wrapper = styled.div`
  width: 540px;
`;

const Info = styled.div`
  color: #777;
`;

const today = dayjs();

// eslint-disable-next-line mobx/missing-observer
const SettingsScreen: React.FC = () => {
  const [peSum, setPeSum] = React.useState(() => {
    const peSumInLs = localStorage.getItem(PE_SUM_LS_KEY);
    return peSumInLs ? peSumInLs : PE_SUM_DEFAULT.toString();
  });
  const [savings, setSavings] = React.useState(() => {
    const lsValue = localStorage.getItem(SAVINGS_LS_KEY);
    if (!lsValue) {
      return "0";
    }
    return lsValue;
  });
  const [savingsDate, setSavingsDate] = React.useState(() => {
    const lsValue = localStorage.getItem(SAVINGS_DATE_LS_KEY);
    if (!lsValue) {
      return null;
    }
    return dayjs(lsValue);
  });

  const handleSavingsChange = (value: string | null) => {
    if (value === null) {
      return;
    }
    setSavings(value);
    setSavingsDate(today);
  };

  useEffect(() => {
    localStorage.setItem(PE_SUM_LS_KEY, peSum);
  }, [peSum]);

  useEffect(() => {
    localStorage.setItem(SAVINGS_LS_KEY, String(savings));
    savingSpendingStore.setInitialSavings(parseFloat(savings));
  }, [savings]);

  useEffect(() => {
    if (savingsDate) {
      localStorage.setItem(
        SAVINGS_DATE_LS_KEY,
        savingsDate.format(DATE_SERVER_FORMAT)
      );
      savingSpendingStore.setInitialSavingsDate(savingsDate);
    }
  }, [savingsDate]);

  return (
    <Wrapper>
      <Row align="middle" style={{ padding: "8px 0" }}>
        <Col span={9}>Персональные расходы/мес</Col>
        <Col>
          <CostInput
            value={peSum}
            onChange={(e) => {
              if (e !== null) {
                setPeSum(e);
              }
            }}
          />
        </Col>
      </Row>
      <Row align="middle" style={{ padding: "8px 0" }}>
        <Col span={9}>Сбережения</Col>
        <Col span={6}>
          <CostInput value={savings} onChange={handleSavingsChange} />
        </Col>
        <Col>
          {savingsDate && (
            <Info>
              <Tooltip
                title={`Текущая сумма сбережений отображается на странице "Траты из сбережений".
                  Она рассчитывается на основе расходов с категориями "В сбережения" и "Из сбережений", сделанных после начальной даты`}
              >
                <InfoCircleOutlined />
              </Tooltip>
              &nbsp;Изменено&nbsp;
              {savingsDate.format(DATE_FORMAT)}
            </Info>
          )}
        </Col>
      </Row>
    </Wrapper>
  );
};

export default SettingsScreen;
