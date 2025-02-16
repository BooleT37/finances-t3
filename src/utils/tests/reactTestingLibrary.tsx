// NB! This file should only be used for tests
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type RenderOptions,
  type RenderResult,
  render,
} from "@testing-library/react";
import { ConfigProvider } from "antd";
import locale from "antd/lib/locale/ru_RU";
import { SessionProvider } from "next-auth/react";
import type React from "react";
import type { ReactElement } from "react";
import { queryClient } from "~/features/shared/queryClient";

// Add this mock session near the top of the file, after imports
const mockSession = {
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: "test-user-id",
    email: "test@example.com",
    name: "Test User",
  },
};

export interface TestContextProviderProps {
  queryClient?: QueryClient;
  children?: React.ReactNode;
}
const AllProviders: React.FC<TestContextProviderProps> = ({
  children,
  queryClient: _queryClient,
}) => (
  <SessionProvider session={mockSession}>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </QueryClientProvider>
  </SessionProvider>
);

const customRender = (
  ui: ReactElement,
  { queryClient }: TestContextProviderProps = {},
  options?: RenderOptions
): RenderResult =>
  render(<AllProviders queryClient={queryClient}>{ui}</AllProviders>, options);

export * from "@testing-library/react";
export { customRender as render };
