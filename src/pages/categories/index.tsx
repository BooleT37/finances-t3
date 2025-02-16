import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import CategoriesScreen from "~/features/category/components/CategoriesScreen";
import { protectedPageProps } from "~/utils/protectedPageProps";

export const getServerSideProps = protectedPageProps;

const CategoriesPage: React.FC = () => (
  <SiteLayout>
    <SiteHeader title="Категории" />
    <SiteContent>
      <CategoriesScreen />
    </SiteContent>
  </SiteLayout>
);

export default CategoriesPage;
