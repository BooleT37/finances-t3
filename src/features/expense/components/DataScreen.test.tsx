import userEvent from "@testing-library/user-event";
import type { Dayjs } from "dayjs";
import { Decimal } from "decimal.js";
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
import { wait } from "~/utils/tests/wait";
import { getToday } from "~/utils/today";
import type { ExpenseFromApi } from "../api/types";
import DataScreen from "./DataScreen";
import { expenseNameCellClassName } from "./DataTable/DataTable";

// #region: mock data

const mockAllData = () => {
  vi.mock("~/utils/api", () => ({
    trpc: mockTrpc,
  }));
};

const emptyExpense: ExpenseFromApi = {
  id: nextId(),
  name: "",
  cost: new Decimal(0),
  date: getToday().toDate(),
  actualDate: null,
  categoryId: 4, // Продукты
  subcategoryId: null,
  sourceId: null,
  subscriptionId: null,
  savingSpendingCategoryId: null,
  peHash: null,
  userId: "1",
  components: [],
};

// #endregion

// #region: helper functions

async function openExpenseModal() {
  const addButton = await screen.findByRole("button", { name: /добавить/i });
  await userEvent.click(addButton);
  const modal = screen.getByRole("dialog");
  return modal;
}

async function setDate(modal: HTMLElement, date: Dayjs) {
  const input = within(modal).getByRole("textbox", { name: /дата/i });
  await userEvent.clear(input);
  await userEvent.type(input, date.format("DD.MM.YYYY"));
}

async function setActualDate(modal: HTMLElement, date: Dayjs) {
  const showActualDateButton = within(modal).getByRole("button", {
    name: /Реальная дата отличается/i,
  });
  await userEvent.click(showActualDateButton);

  const input = within(modal).getByRole("textbox", { name: /Реальная дата/i });
  await userEvent.type(input, date.format("DD.MM.YYYY"));
}

async function setCategory(modal: HTMLElement, category: string) {
  const select = within(modal).getByRole("combobox", { name: /категория/i });
  await userEvent.click(select);
  const option = await screen.findByText(category);
  await userEvent.click(option);
}

async function setSubcategory(modal: HTMLElement, subcategory: string) {
  const select = within(modal).getByRole("combobox", { name: /подкатегория/i });
  await userEvent.click(select);
  const option = await screen.findByText(subcategory);
  await userEvent.click(option);
}

async function setName(modal: HTMLElement, name: string) {
  const input = within(modal).getByRole("textbox", { name: /Коментарий/i });
  await userEvent.type(input, name);
}

async function setCost(modal: HTMLElement, cost: string) {
  const input = within(modal).getByRole("textbox", { name: /сумма/i });
  await userEvent.type(input, cost);
}

async function submitExpenseForm(modal: HTMLElement) {
  const saveButton = within(modal).getByRole("button", { name: /добавить/i });
  await userEvent.click(saveButton);
}

async function toggleUpcomingSubscriptions() {
  const checkbox = await screen.findByRole("checkbox", {
    name: /Предстоящие подписки/i,
  });
  await userEvent.click(checkbox);
}

async function selectSubscription(
  modal: HTMLElement,
  subscriptionName: string
) {
  const select = within(modal).getByRole("combobox", { name: /подписка/i });
  await userEvent.click(select);
  const option = await screen.findByText(subscriptionName);
  await userEvent.click(option);
}

interface VerifyExpenseInTableOptions {
  name: string;
  categoryId: number;
  subcategoryId?: number | null;
  cost: number;
}

async function verifyExpenseInTable({
  name,
  categoryId,
  subcategoryId = null,
  cost,
}: VerifyExpenseInTableOptions) {
  const table = await screen.findByRole("table");
  const formattedCost =
    cost < 0 ? `-€${Math.abs(cost).toFixed(2)}` : `€${cost.toFixed(2)}`;

  // new RegExp(`^${name}`) - sometimes the expense name has a suffix, but never a prefix
  const nameCell = await within(table).findByText(new RegExp(`^${name}`));
  const expenseRow = nameCell.closest<HTMLDivElement>(
    `.${expenseNameCellClassName}`
  );
  assert(expenseRow, `Expense row not found for expense ${name}`);

  expect(expenseRow).toHaveAttribute("data-category-id", String(categoryId));
  if (subcategoryId === null) {
    expect(expenseRow).not.toHaveAttribute("data-subcategory-id");
  } else {
    expect(expenseRow).toHaveAttribute(
      "data-subcategory-id",
      String(subcategoryId)
    );
  }

  const expenseCell = await within(
    expenseRow.closest("tr") ?? expenseRow
  ).findByText(formattedCost);
  expect(expenseCell).toBeInTheDocument();
}

async function openComponentsModal(modal: HTMLElement): Promise<HTMLElement> {
  const componentsButton = within(modal).getByRole("button", {
    name: /править составляющие/i,
  });
  await userEvent.click(componentsButton);
  const componentsForm = await screen.findByRole("form", {
    name: /составляющие расхода/i,
  });
  expect(componentsForm).toBeInTheDocument();
  const dialog = componentsForm.closest<HTMLElement>("div[role='dialog']");
  assert(dialog, "Components form is not inside a dialog");
  return dialog;
}

async function addComponent(
  componentsModal: HTMLElement,
  {
    name,
    cost,
    category,
    subcategory,
  }: {
    name: string;
    cost: string;
    category: string;
    subcategory?: string;
  }
) {
  const addButton = within(componentsModal).getByRole("button", {
    name: /добавить составляющую/i,
  });
  await userEvent.click(addButton);

  const rows = within(componentsModal).getAllByRole("textbox", {
    name: /на что/i,
  });
  const lastRow = rows[rows.length - 1]!;
  await userEvent.type(lastRow, name);

  const costInputs = within(componentsModal).getAllByRole("spinbutton", {
    name: /сколько/i,
  });
  const lastCostInput = costInputs[costInputs.length - 1]!;
  await userEvent.type(lastCostInput, cost);

  const categorySelects = within(componentsModal).getAllByRole("combobox");
  const lastCategorySelect = categorySelects[categorySelects.length - 1]!;
  await userEvent.click(lastCategorySelect);
  const popup = screen.getByRole("tree");
  // const categoryOption = await within(popup).findByText(category);
  const treeItem = within(popup).getByRole("treeitem", {
    name: new RegExp(category),
  });

  if (subcategory) {
    if (treeItem.getAttribute("aria-expanded") !== "true") {
      const expandButton = within(treeItem).getByRole("img", {
        name: /caret-down/i,
      }).parentElement;
      assert(expandButton, "Expand button is not found");
      await userEvent.click(expandButton);
    }
    const subcategoryTreeItem = within(popup).getByRole("treeitem", {
      name: new RegExp(subcategory),
    });
    await userEvent.click(subcategoryTreeItem);
  } else {
    const categoryOption = await within(treeItem).findByText(category);
    await userEvent.click(categoryOption);
  }
}

async function saveComponentsModal(modal: HTMLElement) {
  const saveButton = within(modal).getByRole("button", {
    name: /сохранить/i,
  });
  await userEvent.click(saveButton);
}

async function setIncomeType(modal: HTMLElement, isIncome: boolean) {
  const radioButton = within(modal).getByRole("radio", {
    name: isIncome ? /доход/i : /расход/i,
  });
  await userEvent.click(radioButton);
}

// #endregion

describe("DataScreen", () => {
  beforeEach(() => {
    mockAllData();
  });

  afterEach(() => {
    cleanup();
    vitest.clearAllMocks();
    queryClient.clear();
  });

  it("should add a new expense with minimum required fields", async () => {
    render(<DataScreen />);

    const modal = await openExpenseModal();

    // Select date (today is pre-selected)
    const dateInput = within(modal).getByRole("textbox", { name: /дата/i });
    expect(dateInput).toBeInTheDocument();

    await setCategory(modal, "Продукты");
    await setName(modal, "Basic expense");
    await setCost(modal, "50");

    // Mock the expense creation API response right before triggering the mutation
    const mockExpense = {
      ...emptyExpense,
      name: "Basic expense",
      cost: new Decimal(50),
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockExpense);

    await submitExpenseForm(modal);

    // Verify the API was called with correct data
    expect(mockTrpc.expense.create.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        cost: new Decimal(50),
        name: "Basic expense",
        category: { connect: { id: 4 } }, // ID 4 is "Продукты" category
      })
    );

    await verifyExpenseInTable({
      name: "Basic expense",
      categoryId: 4,
      cost: -50,
    });
  });

  it("should add a new income with positive cost", async () => {
    render(<DataScreen />);

    const modal = await openExpenseModal();

    // Switch to income mode
    await setIncomeType(modal, true);

    // Select date (today is pre-selected)
    const dateInput = within(modal).getByRole("textbox", { name: /дата/i });
    expect(dateInput).toBeInTheDocument();

    await setCategory(modal, "Зарплата");
    await setSubcategory(modal, "Основная");
    await setName(modal, "Monthly salary");
    await setCost(modal, "3000");

    // Mock the expense creation API response
    const mockExpense = {
      ...emptyExpense,
      name: "Monthly salary",
      cost: new Decimal(3000),
      categoryId: 3, // Зарплата category
      subcategoryId: 1, // Основная subcategory
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockExpense);

    await submitExpenseForm(modal);

    // Verify the API was called with correct data
    expect(mockTrpc.expense.create.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        cost: new Decimal(3000),
        name: "Monthly salary",
        category: { connect: { id: 3 } }, // ID 3 is "Зарплата" category
        subcategory: { connect: { id: 1 } }, // ID 1 is "Основная" subcategory
      })
    );

    // Verify income appears in the table with positive cost (no minus sign)
    await verifyExpenseInTable({
      name: "Monthly salary",
      categoryId: 3, // Зарплата category
      subcategoryId: 1, // Основная subcategory
      cost: 3000, // Positive number for income
    });
  });

  it("should add an expense with date in current month and actual date in previous month", async () => {
    const today = getToday();
    const currentMonthDate = today.date(15);
    const previousMonthDate = today.subtract(1, "month").date(25);

    render(<DataScreen />);

    const modal = await openExpenseModal();

    await setDate(modal, currentMonthDate);
    await setActualDate(modal, previousMonthDate);
    await setCategory(modal, "Продукты");
    await setName(modal, "Test expense");
    await setCost(modal, "75");

    // Mock the expense creation API response right before triggering the mutation
    const mockExpense = {
      ...emptyExpense,
      name: "Test expense",
      cost: new Decimal(75),
      date: currentMonthDate.toDate(),
      actualDate: previousMonthDate.toDate(),
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockExpense);

    await submitExpenseForm(modal);

    // Verify the API was called with correct data
    expect(mockTrpc.expense.create.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        cost: new Decimal(75),
        date: currentMonthDate.toDate(),
        actualDate: previousMonthDate.toDate(),
        name: "Test expense",
        category: { connect: { id: 4 } }, // ID 4 is "Продукты" category
      })
    );

    await verifyExpenseInTable({
      name: "Test expense",
      categoryId: 4,
      cost: -75,
    });
  });

  it("should not display expense with date in previous month", async () => {
    const today = getToday();
    const lastMonthDate = today.subtract(1, "month").date(15);
    const twoMonthsAgoDate = today.subtract(2, "month").date(25);

    render(<DataScreen />);

    const modal = await openExpenseModal();

    await setDate(modal, lastMonthDate);
    await setActualDate(modal, twoMonthsAgoDate);
    await setCategory(modal, "Продукты");
    await setName(modal, "Past expense");
    await setCost(modal, "100");

    const mockExpense = {
      ...emptyExpense,
      name: "Past expense",
      cost: new Decimal(100),
      date: lastMonthDate.toDate(),
      actualDate: twoMonthsAgoDate.toDate(),
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockExpense);

    await submitExpenseForm(modal);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(mockTrpc.expense.create.mutate).toHaveBeenCalled();
    });

    // Give the UI some time to potentially update
    await wait(100);

    const expenseCell = screen.queryByRole("cell", { name: "-€100.00" });
    expect(expenseCell).not.toBeInTheDocument();

    const nameCell = screen.queryByText("Past expense");
    expect(nameCell).not.toBeInTheDocument();
  });

  it("should handle subscription expenses correctly", async () => {
    const today = getToday();
    const subscriptionDate = today.date(15);

    render(<DataScreen />);

    // Toggle upcoming subscriptions on
    await toggleUpcomingSubscriptions();

    await verifyExpenseInTable({
      name: "Netflix",
      categoryId: 6,
      cost: -15.99,
    });

    // Toggle upcoming subscriptions off
    await toggleUpcomingSubscriptions();

    // Verify the subscription is no longer in the table
    await waitFor(() => {
      expect(screen.queryByText("Netflix")).not.toBeInTheDocument();
    });

    // Open the expense modal and select the subscription's category
    const modal = await openExpenseModal();
    await setDate(modal, subscriptionDate);
    await setCategory(modal, "Развлечения");

    // Verify subscription select appears and select the subscription
    const subscriptionSelect = within(modal).getByRole("combobox", {
      name: /подписка/i,
    });
    expect(subscriptionSelect).toBeInTheDocument();
    await selectSubscription(modal, "Netflix");

    // Verify fields are auto-filled
    const costInput = within(modal).getByRole("textbox", { name: /сумма/i });
    expect(costInput).toHaveValue("-15.99");
    const nameInput = within(modal).getByRole("textbox", {
      name: /Коментарий/i,
    });
    expect(nameInput).toHaveValue("Netflix");

    // Mock the expense creation API response right before submitting
    const mockSubscriptionExpense = {
      ...emptyExpense,
      name: "Netflix",
      cost: new Decimal(15.99), // Exact cost from mock data
      date: subscriptionDate.toDate(),
      categoryId: 6, // Развлечения category
      sourceId: 1, // Vivid
      subscriptionId: 1,
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockSubscriptionExpense);

    await submitExpenseForm(modal);

    // Verify the API was called with correct data
    expect(mockTrpc.expense.create.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        cost: new Decimal(15.99),
        name: "Netflix",
        date: subscriptionDate.toDate(),
        category: { connect: { id: 6 } }, // Развлечения category
        subscription: { connect: { id: 1 } },
        source: { connect: { id: 1 } },
      })
    );

    await verifyExpenseInTable({
      name: "Netflix",
      categoryId: 6,
      cost: -15.99,
    });
  });

  it("should handle expense with components in different categories", async () => {
    render(<DataScreen />);

    const modal = await openExpenseModal();

    // Create main expense
    await setCategory(modal, "Продукты");
    await setName(modal, "Закупка продуктов");
    await setCost(modal, "100");

    // Add components
    const componentsModal = await openComponentsModal(modal);

    // First component: same category (Продукты) but different subcategory (Рынок)
    await addComponent(componentsModal, {
      name: "Овощи",
      cost: "30",
      category: "Продукты",
      subcategory: "Рынок",
    });

    // Second component: different category (Транспорт)
    await addComponent(componentsModal, {
      name: "Доставка",
      cost: "20",
      category: "Транспорт",
      subcategory: "Такси",
    });

    await saveComponentsModal(componentsModal);

    const mockExpenseId = nextId();
    // Mock the expense creation API response
    const mockExpense: ExpenseFromApi = {
      ...emptyExpense,
      id: mockExpenseId,
      name: "Закупка продуктов",
      cost: new Decimal(100),
      categoryId: 4, // Продукты
      components: [
        {
          id: nextId(),
          name: "Овощи",
          cost: new Decimal(30),
          categoryId: 4, // Продукты
          subcategoryId: 4, // Рынок
          expenseId: mockExpenseId,
        },
        {
          id: nextId(),
          name: "Доставка",
          cost: new Decimal(20),
          categoryId: 5, // Транспорт
          subcategoryId: 6, // Такси
          expenseId: mockExpenseId,
        },
      ],
    };
    mockTrpc.expense.create.mutate.mockResolvedValue(mockExpense);

    await submitExpenseForm(modal);

    // Verify main expense appears in the table
    await verifyExpenseInTable({
      name: "Закупка продуктов",
      categoryId: 4, // Продукты
      cost: -50,
    });

    // Verify first component appears in the table
    await verifyExpenseInTable({
      name: "Овощи",
      categoryId: 4, // Продукты
      subcategoryId: 4, // Рынок
      cost: -30,
    });

    // Verify second component appears in the table
    await verifyExpenseInTable({
      name: "Доставка",
      categoryId: 5, // Транспорт
      subcategoryId: 6, // Такси
      cost: -20,
    });
  });
}, 20000);
