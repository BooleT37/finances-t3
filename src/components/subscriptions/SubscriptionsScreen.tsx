import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

import SubscriptionModal from "./SubscriptionModal";
import SubscriptionsList from "./SubscriptionsList";

// eslint-disable-next-line mobx/missing-observer
const SubscriptionsScreen: React.FC = function SubscriptionsScreen() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = React.useState<
    number | null
  >(null);

  const openModal = (subscriptionId: number | null) => {
    setEditingSubscriptionId(subscriptionId);
    setModalOpen(true);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          openModal(null);
        }}
      >
        Добавить
      </Button>
      <SubscriptionsList
        onEditClick={(subscriptionId) => {
          openModal(subscriptionId);
        }}
      />
      <SubscriptionModal
        subscriptionId={editingSubscriptionId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default SubscriptionsScreen;
