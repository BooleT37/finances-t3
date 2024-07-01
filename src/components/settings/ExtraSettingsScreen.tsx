import {
  CheckOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Col, Row, Space, Tooltip } from "antd";
import Decimal from "decimal.js";
import { debounce } from "lodash";
import { observer } from "mobx-react";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { dataStores } from "~/stores/dataStores";
import { DATE_FORMAT } from "~/utils/constants";
import { CostInput } from "../CostInput";

const Wrapper = styled.div`
  width: 600px;
`;

const Info = styled.div`
  color: #777;
`;

const ExtraSettingsScreen: React.FC = observer(function ExtraSettingsScreen() {
  const {
    pePerMonth: savedPeSum,
    savings: savedSavings,
    setPePerMonth: setSavedPeSum,
    setSavings: setSavedSavings,
    removeSavings,
  } = dataStores.userSettingsStore;
  const [peSum, setPeSum] = React.useState(savedPeSum);
  const [savings, setSavings] = React.useState(
    savedSavings?.sum ?? new Decimal(0)
  );

  const setSavedPeSumIfChanged = useCallback(
    (newPeSum: Decimal) => {
      if (savedPeSum === null || !newPeSum.equals(savedPeSum)) {
        void setSavedPeSum(newPeSum);
      }
    },
    [savedPeSum, setSavedPeSum]
  );

  const debouncedSetSavedPeSum = useMemo(
    () => debounce(setSavedPeSumIfChanged, 1000),
    [setSavedPeSumIfChanged]
  );

  const handlePeSumChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        return;
      }
      const decimalValue = new Decimal(value);
      setPeSum(decimalValue);
      debouncedSetSavedPeSum(decimalValue);
    },
    [debouncedSetSavedPeSum]
  );

  const setSavedSavingsIfChanged = useCallback(
    (newSavings: Decimal) => {
      if (savedSavings === undefined || !newSavings.equals(savedSavings.sum)) {
        void setSavedSavings(newSavings);
      }
    },
    [savedSavings, setSavedSavings]
  );

  const debouncedSetSavedSavings = useMemo(
    () => debounce(setSavedSavingsIfChanged),
    [setSavedSavingsIfChanged]
  );

  const handleSavingsChange = useCallback(
    (value: string | null) => {
      if (value === null) {
        return;
      }
      const decimalValue = new Decimal(value);
      setSavings(decimalValue);
      debouncedSetSavedSavings(decimalValue);
    },
    [debouncedSetSavedSavings]
  );

  const handleAddSavings = useCallback(() => {
    setSavings(new Decimal(0));
    void setSavedSavings(new Decimal(0));
  }, [setSavedSavings]);

  const handleRemoveSavings = useCallback(() => {
    setSavings(new Decimal(0));
    void removeSavings();
  }, [removeSavings]);

  const peSumIcon = useMemo(
    () => (peSum === savedPeSum ? <CheckOutlined /> : <LoadingOutlined />),
    [peSum, savedPeSum]
  );

  const savingsIcon = useMemo(
    () =>
      savings === savedSavings?.sum ? <CheckOutlined /> : <LoadingOutlined />,
    [savedSavings?.sum, savings]
  );

  return (
    <Wrapper>
      <Row align="middle" style={{ padding: "8px 0" }}>
        <Col span={9}>Персональные расходы/мес</Col>
        <Col>
          <CostInput
            value={String(peSum)}
            onChange={handlePeSumChange}
            addonAfter={peSumIcon}
          />
        </Col>
      </Row>
      <Row align="middle" style={{ padding: "8px 0" }}>
        <Col span={9}>Сбережения</Col>
        <Col span={6}>
          {savedSavings ? (
            <CostInput
              value={String(savings)}
              onChange={handleSavingsChange}
              addonAfter={savingsIcon}
            />
          ) : (
            <Button type="link" onClick={handleAddSavings}>
              Добавить
            </Button>
          )}
        </Col>
        <Col>
          {savedSavings?.date && (
            <Info>
              <Space>
                <Tooltip
                  title={`Текущая сумма сбережений отображается на странице "Траты из сбережений".
                  Она рассчитывается на основе расходов с категориями "В сбережения" и "Из сбережений", сделанных после начальной даты`}
                >
                  <InfoCircleOutlined />
                </Tooltip>
                &nbsp;Изменено&nbsp;
                {savedSavings.date.format(DATE_FORMAT)}
                <Button
                  type="text"
                  onClick={handleRemoveSavings}
                  icon={<DeleteOutlined />}
                />
              </Space>
            </Info>
          )}
        </Col>
      </Row>
    </Wrapper>
  );
});

export default ExtraSettingsScreen;
