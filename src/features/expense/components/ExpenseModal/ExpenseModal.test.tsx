import userEvent from "@testing-library/user-event";
import { Decimal } from "decimal.js";
import { useEffect } from "react";
import { queryClient } from "~/features/shared/queryClient";
import { mockTrpc } from "~/utils/tests/mockData/mockAllData";
import { nextId } from "~/utils/tests/nextId";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "~/utils/tests/reactTestingLibrary";
import { getToday } from "~/utils/today";
import type { ExpenseFromApi } from "../../api/types";
import ExpenseModal from "./ExpenseModal";
import {
  ExpenseModalContextProvider,
  useExpenseModalContext,
} from "./expenseModalContext";

// #region: mock data
const mockAllData = () => {
  vi.mock("~/utils/api", () => ({
    trpc: mockTrpc,
  }));
};

const sampleExpense: ExpenseFromApi = {
  id: 999,
  name: "Sample expense",
  cost: new Decimal(42.5),
  date: getToday().toDate(),
  actualDate: null,
  categoryId: 5, // Транспорт
  subcategoryId: 6, // Такси
  sourceId: 1, // Vivid
  subscriptionId: null,
  savingSpendingCategoryId: null,
  peHash: null,
  userId: "1",
  components: [],
};
// #endregion

// #region: helper functions
// Wrapper component that opens the modal using useEffect
const ModalWrapper: React.FC = () => {
  const { open } = useExpenseModalContext();
  const onSubmit = vi.fn();

  const today = getToday();
  const startDate = today.startOf("month");
  const endDate = today.endOf("month");

  useEffect(() => {
    // Open the modal with no expense (create new)
    open(null);
  }, [open]);

  return (
    <ExpenseModal startDate={startDate} endDate={endDate} onSubmit={onSubmit} />
  );
};

const renderExpenseModal = () => {
  const result = render(
    <ExpenseModalContextProvider>
      <ModalWrapper />
    </ExpenseModalContextProvider>
  );

  return result;
};

const fillExpenseForm = async (
  modal: HTMLElement,
  expenseData: {
    name: string;
    cost: string;
    category: string;
    subcategory?: string;
    source?: string;
  }
) => {
  // Fill name
  const nameInput = within(modal).getByRole("textbox", { name: /Коментарий/i });
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, expenseData.name);

  // Fill cost
  const costInput = within(modal).getByRole("textbox", { name: /сумма/i });
  await userEvent.clear(costInput);
  await userEvent.type(costInput, expenseData.cost);

  // Select category
  const categorySelect = within(modal).getByRole("combobox", {
    name: /категория/i,
  });
  await userEvent.click(categorySelect);
  const categoryOption = await screen.findByText(expenseData.category);
  await userEvent.click(categoryOption);

  // Select subcategory if provided
  if (expenseData.subcategory) {
    // Wait for subcategory field to appear
    await waitFor(() => {
      const subcategorySelect = within(modal).queryByRole("combobox", {
        name: /подкатегория/i,
      });
      expect(subcategorySelect).toBeInTheDocument();
    });

    const subcategorySelect = within(modal).getByRole("combobox", {
      name: /подкатегория/i,
    });
    await userEvent.click(subcategorySelect);
    const subcategoryOption = await screen.findByText(expenseData.subcategory);
    await userEvent.click(subcategoryOption);
  }

  // Select source if provided
  if (expenseData.source) {
    const sourceSelect = within(modal).getByRole("combobox", {
      name: /источник/i,
    });
    await userEvent.click(sourceSelect);
    const sourceOption = await screen.findByText(expenseData.source);
    await userEvent.click(sourceOption);
  }
};

const submitExpenseForm = async (modal: HTMLElement) => {
  const submitButton = within(modal).getByRole("button", { name: /добавить/i });
  await userEvent.click(submitButton);
};

const verifySelectValue = (
  modal: HTMLElement,
  selectName: string | RegExp,
  value: string
) => {
  const select = within(modal).getByRole("combobox", {
    name: selectName,
  });
  assert(
    select.parentElement?.parentElement,
    "Select parent element not found"
  );
  const selectText = within(select.parentElement?.parentElement).getByText(
    value
  );
  expect(selectText).toBeInTheDocument();
};
// #endregion

describe("ExpenseModal", () => {
  beforeEach(() => {
    mockAllData();

    // Clear any existing data in the query client to ensure clean state
    queryClient.clear();

    // Initialize the expense query data with an empty array
    queryClient.setQueryData(["expense", "getAll"], []);
  });

  afterEach(() => {
    cleanup();
    vitest.clearAllMocks();
    queryClient.clear();
  });

  it("should fill form with previous expense data when 'Insert previous' button is clicked", async () => {
    // Render the modal
    renderExpenseModal();
    const modal = await screen.findByRole("dialog");

    // Fill the first expense form
    await fillExpenseForm(modal, {
      name: "First expense",
      cost: "42.5",
      category: "Транспорт",
      subcategory: "Такси",
      source: "Vivid",
    });

    // Create the first expense object
    const firstExpense: ExpenseFromApi = {
      ...sampleExpense,
      name: "First expense",
      id: nextId(),
      cost: new Decimal(42.5),
      categoryId: 5,
      subcategoryId: 6,
      sourceId: 1,
    };

    // Mock the expense creation API response right before submitting
    mockTrpc.expense.create.mutate.mockResolvedValue(firstExpense);

    // Submit the form (with "add more" checked by default)
    await submitExpenseForm(modal);

    // Directly update the query cache with our new expense data
    // This is crucial for the expenseById hook that determines lastExpense
    queryClient.setQueryData(["expense", "getAll"], [firstExpense]);

    // Force a refetch to ensure the data is updated in all components
    await queryClient.invalidateQueries({ queryKey: ["expense", "getAll"] });

    // Wait for the "Insert previous" button to appear
    await waitFor(() => {
      const insertButton = within(modal).queryByRole("button", {
        name: /подставить предыдущий/i,
      });
      expect(insertButton).toBeInTheDocument();
    });

    // Verify form is reset after submission
    const nameInput = within(modal).getByRole("textbox", {
      name: /Коментарий/i,
    });
    const costInput = within(modal).getByRole("textbox", { name: /сумма/i });

    expect(nameInput.getAttribute("value")).toBe("");
    expect(costInput.getAttribute("value")).toBe("");

    // Click the "Insert previous" button
    const insertPreviousButton = within(modal).getByRole("button", {
      name: /подставить предыдущий/i,
    });
    await userEvent.click(insertPreviousButton);

    // Form should now be filled with previous expense data
    await waitFor(() => {
      expect(nameInput.getAttribute("value")).toBe("First expense");
    });
    expect(costInput.getAttribute("value")).toBe("-42.5");

    // Check if category is filled correctly
    verifySelectValue(modal, /^категория/i, "Транспорт");

    // Check if subcategory is filled correctly
    verifySelectValue(modal, /подкатегория/i, "Такси");

    // Check if source is filled correctly
    verifySelectValue(modal, /источник/i, "Vivid");
  });

  it("should submit the form with previous expense data after clicking 'Insert previous'", async () => {
    // Render the modal
    renderExpenseModal();
    const modal = await screen.findByRole("dialog");

    // Fill the first expense form
    await fillExpenseForm(modal, {
      name: "First expense",
      cost: "42.5",
      category: "Транспорт",
      subcategory: "Такси",
      source: "Vivid",
    });

    // Create the first expense object
    const firstExpense = {
      ...sampleExpense,
      name: "First expense",
      id: nextId(),
    };

    // Mock the first expense creation API response right before submitting
    mockTrpc.expense.create.mutate.mockResolvedValue(firstExpense);

    // Submit the form (with "add more" checked by default)
    await submitExpenseForm(modal);

    // Directly update the query cache with our new expense data
    queryClient.setQueryData(["expense", "getAll"], [firstExpense]);

    // Force a refetch to ensure the data is updated in all components
    await queryClient.invalidateQueries({ queryKey: ["expense", "getAll"] });

    // Wait for the "Insert previous" button to appear
    await waitFor(() => {
      const insertButton = within(modal).queryByRole("button", {
        name: /подставить предыдущий/i,
      });
      expect(insertButton).toBeInTheDocument();
    });

    // Click the "Insert previous" button
    const insertPreviousButton = within(modal).getByRole("button", {
      name: /подставить предыдущий/i,
    });
    await userEvent.click(insertPreviousButton);

    // Wait for the form to be filled with previous expense data
    await waitFor(() => {
      const nameInput = within(modal).getByRole("textbox", {
        name: /Коментарий/i,
      });
      expect(nameInput.getAttribute("value")).toBe("First expense");
    });

    // Mock the second expense creation API response right before submitting again
    const secondExpense = {
      ...firstExpense,
      id: nextId(), // New ID for the second expense
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(secondExpense);

    // Submit the form again
    await submitExpenseForm(modal);

    // Verify the API was called with correct data
    await waitFor(() => {
      expect(mockTrpc.expense.create.mutate).toHaveBeenCalledWith(
        expect.objectContaining({
          cost: new Decimal(42.5),
          name: "First expense",
          category: { connect: { id: 5 } }, // ID 5 is "Транспорт" category
          subcategory: { connect: { id: 6 } }, // ID 6 is "Такси" subcategory
          source: { connect: { id: 1 } }, // ID 1 is "Vivid" source
        })
      );
    });
  });
});
