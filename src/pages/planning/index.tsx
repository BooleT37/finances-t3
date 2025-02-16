import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import PlanningScreen from "~/features/forecast/components/PlanningScreen";
import { protectedPageProps } from "~/utils/protectedPageProps";

export const getServerSideProps = protectedPageProps;

const PlanningPage: React.FC = () => (
  <SiteLayout>
    <SiteHeader title="Планирование" />
    <SiteContent>
      <PlanningScreen />
    </SiteContent>
  </SiteLayout>
);

export default PlanningPage;
