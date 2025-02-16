import { vi } from "vitest";
import { mockCategories } from "./mockCategories";
import { mockExpenses } from "./mockExpenses";
import { mockForecasts } from "./mockForecasts";
import { mockSavingSpendings } from "./mockSavingSpendings";
import { mockSources } from "./mockSources";
import { mockSubscriptions } from "./mockSubscriptions";
import { mockUserSettings } from "./mockUserSettings";

export const mockTrpc = {
  expense: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockExpenses),
    },
    create: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("expense.create.mutate needs to be mocked explicitly");
      }),
    },
    createMany: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "expense.createMany.mutate needs to be mocked explicitly"
        );
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("expense.update.mutate needs to be mocked explicitly");
      }),
    },
    delete: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("expense.delete.mutate needs to be mocked explicitly");
      }),
    },
    deleteComponent: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "expense.deleteComponent.mutate needs to be mocked explicitly"
        );
      }),
    },
  },
  forecast: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockForecasts),
    },
    upsert: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("forecast.upsert.mutate needs to be mocked explicitly");
      }),
    },
  },
  savingSpending: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockSavingSpendings),
    },
    create: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "savingSpending.create.mutate needs to be mocked explicitly"
        );
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "savingSpending.update.mutate needs to be mocked explicitly"
        );
      }),
    },
    delete: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "savingSpending.delete.mutate needs to be mocked explicitly"
        );
      }),
    },
    toggle: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "savingSpending.toggle.mutate needs to be mocked explicitly"
        );
      }),
    },
  },
  categories: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockCategories),
    },
    create: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "categories.create.mutate needs to be mocked explicitly"
        );
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "categories.update.mutate needs to be mocked explicitly"
        );
      }),
    },
    delete: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "categories.delete.mutate needs to be mocked explicitly"
        );
      }),
    },
  },
  sources: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockSources),
    },
    create: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sources.create.mutate needs to be mocked explicitly");
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sources.update.mutate needs to be mocked explicitly");
      }),
    },
    delete: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sources.delete.mutate needs to be mocked explicitly");
      }),
    },
  },
  sub: {
    getAll: {
      query: vi.fn().mockResolvedValue(mockSubscriptions),
    },
    toggle: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sub.toggle.mutate needs to be mocked explicitly");
      }),
    },
    create: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sub.create.mutate needs to be mocked explicitly");
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sub.update.mutate needs to be mocked explicitly");
      }),
    },
    delete: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error("sub.delete.mutate needs to be mocked explicitly");
      }),
    },
  },
  userSettings: {
    get: {
      query: vi.fn().mockResolvedValue(mockUserSettings),
    },
    createIfNotExist: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "userSettings.createIfNotExist.mutate needs to be mocked explicitly"
        );
      }),
    },
    update: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "userSettings.update.mutate needs to be mocked explicitly"
        );
      }),
    },
  },
  user: {
    initialUserSetupIfNeeded: {
      mutate: vi.fn().mockImplementation(() => {
        throw new Error(
          "user.initialUserSetupIfNeeded.mutate needs to be mocked explicitly"
        );
      }),
    },
  },
};
