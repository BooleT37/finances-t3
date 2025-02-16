import { Layout, Typography } from "antd";
import styled from "styled-components";

const { Header } = Layout;
const { Title } = Typography;

const HeaderStyled = styled(Header)`
  background: white;
  padding-top: 12px;
  height: var(--site-header-height);
`;

export const SiteHeader: React.FC<{
  title: string;
}> = ({ title }) => (
  <HeaderStyled>
    <Title style={{ margin: 0 }}>{title}</Title>
  </HeaderStyled>
);
