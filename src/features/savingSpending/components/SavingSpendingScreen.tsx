import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Modal, Row, Tooltip } from "antd";
import { useState } from "react";
import styled from "styled-components";
import { useDeleteSavingSpending } from "~/features/savingSpending/api/savingSpendingApi";
import { useSavingSpendings } from "~/features/savingSpending/facets/allSavingSpendings";
import SavingSpendingCard from "./SavingSpendingCard";
import SavingSpendingModal from "./SavingSpendingModal";

const ColStyled = styled(Col)`
  margin-bottom: 16px;
`;

const AddEventCard = styled(Card)`
  text-align: center;
`;

const SavingSpendingsScreen: React.FC = () => {
  const { data: spendings = [] } = useSavingSpendings();
  const removeSpending = useDeleteSavingSpending();

  const [modalOpen, setModalOpen] = useState(false);
  const [editedSpendingId, setEditedSpendingId] = useState<number>(-1);
  return (
    <>
      <Row gutter={16}>
        {spendings
          .slice()
          .sort((s1, s2) =>
            s1.name < s2.name ? -1 : s1.name > s2.name ? 1 : 0
          )
          .map((s) => (
            <ColStyled key={s.id} span={8}>
              <SavingSpendingCard
                spending={s}
                onEditClick={() => {
                  setEditedSpendingId(s.id);
                  setModalOpen(true);
                }}
                onDeleteClick={() => {
                  Modal.confirm({
                    title: "Вы уверены, что хотите удалить это событие?",
                    icon: <ExclamationCircleOutlined />,
                    onOk: async () => removeSpending.mutate(s.id),
                  });
                }}
              />
            </ColStyled>
          ))}
        <ColStyled span={8}>
          <AddEventCard>
            <Tooltip title="Добавить расход">
              <Button
                type="link"
                icon={<PlusOutlined style={{ fontSize: 40 }} />}
                onClick={() => {
                  setEditedSpendingId(-1);
                  setModalOpen(true);
                }}
              />
            </Tooltip>
          </AddEventCard>
        </ColStyled>
      </Row>
      <SavingSpendingModal
        editedSpendingId={editedSpendingId}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
      />
    </>
  );
};

export default SavingSpendingsScreen;
