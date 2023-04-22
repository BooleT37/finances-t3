import { SavingsPerMonthChart } from "./SavingsPerMonthChart";
import { SavingsSpendingsEventsChart } from "./SavingsSpendingsEventsChart";
import { SavingsVsSpendingsChart } from "./SavingsVsSpendingsChart";

// eslint-disable-next-line mobx/missing-observer
export const SavingsStep: React.FC = () => (
  <div>
    <SavingsVsSpendingsChart />
    <SavingsPerMonthChart />
    <SavingsSpendingsEventsChart />
  </div>
);
