import { Space, Switch, Tooltip } from "antd";
import { observer } from "mobx-react";
import React from "react";
import subscriptionStore from "~/stores/subscriptionStore";
import { DATE_FORMAT } from "~/utils/constants";

import SubscriptionItem from "./SubscriptionItem";
import { SubscriptionCategoryName } from "./SubscriptionsList.styled";

interface Props {
  onEditClick(subscriptionId: number): void;
}

const SubscriptionsList: React.FC<Props> = observer(function SubscriptionsList({
  onEditClick,
}) {
  const subscriptions = subscriptionStore.byCategory;
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
                      subscriptionStore.delete(subscriptionId);
                    }}
                  />
                </Space>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
});

export default SubscriptionsList;
