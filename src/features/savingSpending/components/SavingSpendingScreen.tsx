import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Tooltip } from "antd";
import { useState } from "react";
import Masonry from "react-masonry-css";
import styled from "styled-components";
import { useDeleteSavingSpending } from "~/features/savingSpending/api/savingSpendingApi";
import { useSavingSpendings } from "~/features/savingSpending/facets/allSavingSpendings";
import SavingSpendingCard from "./SavingSpendingCard";
import SavingSpendingModal from "./SavingSpendingModal";

const CardWrapper = styled.div`
  width: 100%;
`;

const AddEventCard = styled(Card)`
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledMasonry = styled(Masonry)`
  display: flex;
  width: 100%;
  margin-left: -16px; /* Compensate for the gap */

  .masonry-grid_column {
    padding-left: 16px; /* Gap size */
    background-clip: padding-box;
  }

  /* Style your items */
  .masonry-grid_column > div {
    margin-bottom: 16px;
  }
`;

const SavingSpendingsScreen: React.FC = () => {
  const { data: spendings = [] } = useSavingSpendings();
  const removeSpending = useDeleteSavingSpending();

  const [modalOpen, setModalOpen] = useState(false);
  const [editedSpendingId, setEditedSpendingId] = useState<number>(-1);

  // Define breakpoints for responsive columns
  const breakpointColumnsObj = {
    default: 3,
    1024: 3,
    768: 2,
    640: 1,
  };

  return (
    <>
      <StyledMasonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {spendings
          .slice()
          .sort((s1, s2) =>
            s1.name < s2.name ? -1 : s1.name > s2.name ? 1 : 0
          )
          .map((s) => (
            <CardWrapper key={s.id}>
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
            </CardWrapper>
          ))}
        <CardWrapper>
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
        </CardWrapper>
      </StyledMasonry>
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
