import { SavingsPerMonthChart } from "./SavingsPerMonthChart";
import { SavingsSpendingsEventsChart } from "./SavingsSpendingsEventsChart";
import { SavingsVsSpendingsChart } from "./SavingsVsSpendingsChart";

export const SavingsStep: React.FC = () => (
  <div>
    <SavingsVsSpendingsChart />
    <SavingsPerMonthChart />
    <SavingsSpendingsEventsChart />
  </div>
);
