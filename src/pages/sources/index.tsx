import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import { protectedPageProps } from "~/utils/protectedPageProps";
import SourcesScreen from "./components/SourcesScreen";

export const getServerSideProps = protectedPageProps;

const SourcesPage: React.FC = () => (
  <SiteLayout>
    <SiteHeader title="Источники" />
    <SiteContent>
      <SourcesScreen />
    </SiteContent>
  </SiteLayout>
);

export default SourcesPage;
