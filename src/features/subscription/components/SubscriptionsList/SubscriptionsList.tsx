import { Space, Switch, Tooltip } from "antd";
import React from "react";
import { DATE_FORMAT } from "~/utils/constants";

import { useDeleteSubscription } from "~/features/subscription/api/subscriptionsApi";
import { useGetSubscriptionsByCategory } from "~/features/subscription/facets/subscriptionsByCategory";
import SubscriptionItem from "./SubscriptionItem";
import { SubscriptionCategoryName } from "./SubscriptionsList.styled";

interface Props {
  onEditClick(subscriptionId: number): void;
}

const SubscriptionsList: React.FC<Props> = ({ onEditClick }) => {
  const subscriptions = useGetSubscriptionsByCategory();
  const deleteSubscription = useDeleteSubscription();
  return (
    <div>
      {Object.keys(subscriptions)
        .sort()
        .map((categoryName) => (
          <div key={categoryName}>
            <SubscriptionCategoryName level={3}>
              {categoryName}
            </SubscriptionCategoryName>
            {subscriptions[categoryName]?.map((subscription) => (
              <div key={subscription.id}>
                <Space>
                  <Tooltip
                    placement="bottom"
                    title={subscription.active ? "Активная" : "Отключенная"}
                  >
                    <Switch
                      checked={subscription.active}
                      onChange={(checked) =>
                        void subscription.setActive(checked)
                      }
                    />
                  </Tooltip>
                  <SubscriptionItem
                    id={subscription.id}
                    name={subscription.name}
                    costString={subscription.costString}
                    nextDate={subscription.nextDate.format(DATE_FORMAT)}
                    active={subscription.active}
                    onEdit={(subscriptionId) => {
                      onEditClick(subscriptionId);
                    }}
                    onDelete={(subscriptionId) => {
                      deleteSubscription.mutate(subscriptionId);
                    }}
                  />
                </Space>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

export default SubscriptionsList;
