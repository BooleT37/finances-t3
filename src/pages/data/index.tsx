import { Typography } from "antd";
import { observer } from "mobx-react";
import styled from "styled-components";
import DataScreen from "~/components/data/DataScreen";
import { DataScreenDataFetcher } from "~/components/data/DataScreenDataFetcher";
import SiteContent from "~/components/SiteContent";
import WhiteHeader from "~/components/WhiteHeader";

const { Title } = Typography;

const ContentWrapper = styled("div")`
  position: relative;
  max-width: 850px;
`;

const DataPage = observer(function DataPage() {
  return (
    <DataScreenDataFetcher>
      <WhiteHeader className="site-layout-background">
        <Title>Данные</Title>
      </WhiteHeader>
      <SiteContent className="site-layout-background">
        <ContentWrapper>
          <DataScreen />
        </ContentWrapper>
      </SiteContent>
    </DataScreenDataFetcher>
  );
});

export default DataPage;
