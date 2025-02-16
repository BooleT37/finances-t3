import styled from "styled-components";
import SiteContent from "~/components/SiteContent";
import { SiteHeader } from "~/components/SiteHeader";
import SiteLayout from "~/components/SiteLayout";
import { CurrentSpendings } from "~/features/savingSpending/components/CurrentSpendings";
import SavingSpendingsScreen from "~/features/savingSpending/components/SavingSpendingScreen";
import { protectedPageProps } from "~/utils/protectedPageProps";

const ContentStyled = styled(SiteContent)`
  background: transparent;
`;

export const getServerSideProps = protectedPageProps;

const SavingSpendingsPage: React.FC = () => (
  <SiteLayout>
    <SiteHeader title="Накопления и траты" />
    <CurrentSpendings />
    <ContentStyled>
      <SavingSpendingsScreen />
    </ContentStyled>
  </SiteLayout>
);

export default SavingSpendingsPage;
