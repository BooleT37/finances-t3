import type { Prisma } from "@prisma/client";
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
const ModalWrapper: React.FC<{ expenseId?: number }> = ({ expenseId }) => {
  const { open } = useExpenseModalContext();
  const onSubmit = vi.fn();

  const today = getToday();
  const startDate = today.startOf("month");
  const endDate = today.endOf("month");

  useEffect(() => {
    // Open the modal with expenseId for editing or null for creating new
    open(expenseId ?? null);
  }, [open, expenseId]);

  return (
    <ExpenseModal startDate={startDate} endDate={endDate} onSubmit={onSubmit} />
  );
};

const renderExpenseModal = (expenseId?: number) => {
  const result = render(
    <ExpenseModalContextProvider>
      <ModalWrapper expenseId={expenseId} />
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
  expect(select).toBeInTheDocument();
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

  it("should populate form fields when opened in edit mode", async () => {
    // Use an existing mock expense from mockExpenses.ts (ID 2 - Такси)
    const expenseId = 2; // ID for the "Такси" expense in mockExpenses.ts

    // Create a spy for the update mutation
    // mockTrpc.expense.update.mutate.mockResolvedValue(
    //   mockExpenses.find((e) => e.id === expenseId)
    // );

    // Render the modal in edit mode by passing the expense ID
    // Утечка памяти, когда модальное окно открывается на реактирование, пофикить
    renderExpenseModal(expenseId);

    // Wait for the modal to appear
    const modal = await screen.findByRole("dialog");
    // Check if the modal title indicates edit mode
    expect(screen.getByText("Редактирование траты")).toBeInTheDocument();

    await waitFor(
      () => {
        // Check name field
        const nameInput = within(modal).getByRole("textbox", {
          name: /Коментарий/i,
        });
        expect(nameInput.getAttribute("value")).toBe("Такси");
      },
      { timeout: 1000 }
    );
    // Check cost field
    const costInput = within(modal).getByRole("textbox", { name: /сумма/i });
    expect(costInput.getAttribute("value")).toBe("-15.3");

    // Check category field
    verifySelectValue(modal, "Категория", "Транспорт");

    // Check subcategory field
    verifySelectValue(modal, "Подкатегория", "Такси");

    // Now let's test submitting the edited form
    // Update the expense name
    const nameInput = within(modal).getByRole("textbox", {
      name: "Коментарий",
    });
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Updated такси expense");

    // Find and click the submit button (which should say "Save" or equivalent in Russian for edit mode)
    const submitButton = within(modal).getByRole("button", {
      name: /сохранить|добавить/i,
    });

    mockTrpc.expense.update.mutate.mockResolvedValue({
      actualDate: null,
      categoryId: 5,
      components: [],
      cost: new Decimal(15.3),
      date: new Date(),
      id: expenseId,
      name: "Updated такси expense",
      peHash: null,
      sourceId: 1,
      subcategoryId: 6,
      subscriptionId: null,
      userId: "1",
      savingSpendingCategoryId: null,
    } satisfies ExpenseFromApi);

    await userEvent.click(submitButton);

    // Verify the update API was called with correct data
    await waitFor(
      () => {
        expect(mockTrpc.expense.update.mutate).toHaveBeenCalledWith({
          id: expenseId,
          data: expect.objectContaining({
            cost: new Decimal(15.3),
            name: "Updated такси expense",
            category: { connect: { id: 5 } }, // Транспорт
            subcategory: { connect: { id: 6 } }, // Такси
          }) as Prisma.ExpenseUpdateWithoutUserInput,
        });
      },
      { timeout: 1000 }
    );
  });
});
