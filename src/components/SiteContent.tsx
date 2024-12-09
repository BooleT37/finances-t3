import { Layout } from "antd";
import styled from "styled-components";

const { Content } = Layout;

const SiteContent = styled(Content)`
  margin: var(--site-content-vertical-margin) 16px;
  padding: var(--site-content-padding);
  background: white;
  position: relative;
`;

export default SiteContent;
