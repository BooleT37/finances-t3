import type { ApiSource } from "~/features/source/api/types";

export const mockSources: ApiSource[] = [
  {
    id: 1,
    name: "Vivid",
    parser: "VIVID",
    userId: "1",
  },
  {
    id: 2,
    name: "Commerzbank",
    parser: null,
    userId: "1",
  },
  {
    id: 3,
    name: "Наличные",
    parser: null,
    userId: "1",
  },
];
