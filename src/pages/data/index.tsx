import styled from "styled-components";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import DataScreen from "~/features/expense/components/DataScreen";
import { protectedPageProps } from "~/utils/protectedPageProps";

const ContentWrapper = styled("div")`
  position: relative;
  max-width: 850px;
`;

export const getServerSideProps = protectedPageProps;

const DataPage = () => (
  <SiteLayout>
    <SiteHeader title="Данные" />
    <SiteContent>
      <ContentWrapper>
        <DataScreen />
      </ContentWrapper>
    </SiteContent>
  </SiteLayout>
);

export default DataPage;
