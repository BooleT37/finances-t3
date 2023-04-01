import { Typography } from "antd";
import { observer } from "mobx-react";
import styled from "styled-components";
import { CurrentSpendings } from "~/components/savingSpending/CurrentSpendings";
import SavingSpendingsScreen from "~/components/savingSpending/SavingSpendingScreen";
import { SavingSpendingScreenDataFetcher } from "~/components/savingSpending/SavingSpendingScreenDataFetcher";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";

const { Title } = Typography;

const ContentStyled = styled(SiteContent)`
  background: transparent;
`;

const SavingSpendingsPage: React.FC = observer(function SavingSpendingsPage() {
  return (
    <SavingSpendingScreenDataFetcher>
      <WhiteHeader>
        <Title>Траты из сбережений</Title>
        <CurrentSpendings />
      </WhiteHeader>
      <ContentStyled>
        <SavingSpendingsScreen />
      </ContentStyled>
    </SavingSpendingScreenDataFetcher>
  );
});

export default SavingSpendingsPage;
