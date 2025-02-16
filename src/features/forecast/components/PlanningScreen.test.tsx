import userEvent from "@testing-library/user-event";
import type { inferRouterInputs } from "@trpc/server";
import { Decimal } from "decimal.js";
import { queryClient } from "~/features/shared/queryClient";
import type { AppRouter } from "~/server/api/root";
import { mockTrpc } from "~/utils/tests/mockData/mockAllData";
import { nextId } from "~/utils/tests/nextId";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "~/utils/tests/reactTestingLibrary";
import type { ApiForecast } from "../api/types";
import { REST_SUBCATEGORY_ID } from "../facets/forecastConstants";
import PlanningScreen from "./PlanningScreen";
import { buildSubcategoryTestId } from "./PlanningTable/buildSubcategoryTestId";

const mockAllData = () => {
  vi.mock("~/utils/api", () => ({
    trpc: mockTrpc,
  }));
};

const mockUpsertForecast = () => {
  type inputType = inferRouterInputs<AppRouter>["forecast"]["upsert"];
  mockTrpc.forecast.upsert.mutate.mockImplementation((input: inputType) =>
    Promise.resolve({
      ...input,
      id: nextId(),
      userId: "1",
      comment: input.comment ?? "",
      sum: input.sum ?? new Decimal(0),
    } satisfies ApiForecast)
  );
};

async function getCategoryForecastCell(categoryName: string) {
  const categoryCellText = await screen.findByText(categoryName);
  const categoryCell = categoryCellText.closest("td");
  assert(categoryCell, "Category cell not found");
  const categoryRow = categoryCell.closest("tr");
  assert(categoryRow, "Category row not found");
  const forecastCell =
    categoryRow.querySelector<HTMLElement>('td[data-index="3"]');
  assert(forecastCell, "Forecast cell not found");
  return forecastCell;
}

async function expandCategoryRow(categoryName: string) {
  const categoryCellText = await screen.findByText(categoryName);
  const categoryCell = categoryCellText.closest("td");
  assert(categoryCell, "Category cell not found");
  const categoryExpandButton = within(categoryCell).getByRole("button", {
    name: "Раскрыть",
  });
  await userEvent.click(categoryExpandButton);
}

async function getSubcategoryForecastCell({
  subcategoryName,
  subcategoryId,
}: {
  subcategoryName: string;
  subcategoryId: number;
}) {
  const subcategoryCell = await screen.findByTestId(
    buildSubcategoryTestId(subcategoryId)
  );
  expect(subcategoryCell).toHaveTextContent(subcategoryName);

  const subcategoryRow = subcategoryCell.closest("tr");
  const forecastCell =
    subcategoryRow?.querySelector<HTMLElement>('td[data-index="3"]');
  assert(forecastCell, "Subcategory forecast cell not found");
  return forecastCell;
}

describe("PlanningScreen", () => {
  beforeEach(() => {
    mockAllData();
  });
  afterEach(() => {
    cleanup();
    vitest.clearAllMocks();
    queryClient.clear();
  });
  it("Empty forecasts should have 0 value", async () => {
    render(<PlanningScreen />);
    const forecastCell = await getCategoryForecastCell("Развлечения");
    expect(forecastCell).toHaveTextContent("€0.00");
    await userEvent.dblClick(forecastCell);
    const input = await within(forecastCell).findByRole("spinbutton");
    expect(input).toHaveDisplayValue("0");
  });

  it("Zero value forecasts should have correct value when edited", async () => {
    render(<PlanningScreen />);
    await expandCategoryRow("Продукты");
    const forecastCell = await getSubcategoryForecastCell({
      subcategoryName: "Рынок",
      subcategoryId: 4,
    });
    expect(forecastCell).toHaveTextContent("€0.00");
    await userEvent.dblClick(forecastCell);
    const input = await within(forecastCell).findByRole("spinbutton");
    expect(input).toHaveDisplayValue("0");
  });

  it("Non-zero value forecasts should have correct value when edited", async () => {
    render(<PlanningScreen />);
    await expandCategoryRow("Продукты");
    const forecastCell = await getSubcategoryForecastCell({
      subcategoryName: "Супермаркет",
      subcategoryId: 3,
    });
    expect(forecastCell).toHaveTextContent("-€50.00");
    await userEvent.dblClick(forecastCell);
    const input = await within(forecastCell).findByRole("spinbutton");
    expect(input).toHaveDisplayValue("-50");
  });

  it("'Other' subcategory should appear when adding forecast to a subcategory", async () => {
    render(<PlanningScreen />);

    const entertainmentCell = await getCategoryForecastCell("Развлечения");
    expect(entertainmentCell).toHaveTextContent("€0.00");

    await expandCategoryRow("Развлечения");
    const moviesSubcategoryCell = await getSubcategoryForecastCell({
      subcategoryName: "Кино",
      subcategoryId: 7,
    });
    expect(moviesSubcategoryCell).toHaveTextContent("€0.00");

    mockUpsertForecast();

    await userEvent.dblClick(moviesSubcategoryCell);
    const input = await within(moviesSubcategoryCell).findByRole("spinbutton");
    await userEvent.type(input, "100");
    await userEvent.tab();
    await waitFor(async () => {
      const moviesSubcategoryCell = await getSubcategoryForecastCell({
        subcategoryName: "Кино",
        subcategoryId: 7,
      });
      expect(moviesSubcategoryCell).toHaveTextContent("-€100.00");
    });

    const otherSubcategoryCell = await getSubcategoryForecastCell({
      subcategoryName: "Другое",
      subcategoryId: REST_SUBCATEGORY_ID,
    });
    expect(otherSubcategoryCell).toHaveTextContent("€0.00");
  });

  it("Rest subcategory should show category-subcategory difference when category has non-zero forecast", async () => {
    mockUpsertForecast();
    render(<PlanningScreen />);

    // Category should show initial forecast of 80€
    const hobbiesCell = await getCategoryForecastCell("Хобби");
    expect(hobbiesCell).toHaveTextContent("-€80.00");

    await expandCategoryRow("Хобби");

    // Add first subcategory forecast
    const sportsCell = await getSubcategoryForecastCell({
      subcategoryName: "Спорт",
      subcategoryId: 9,
    });
    expect(sportsCell).toHaveTextContent("€0.00");
    await userEvent.dblClick(sportsCell);
    const subcategoryInput = await within(sportsCell).findByRole("spinbutton");
    await userEvent.type(subcategoryInput, "30");
    await userEvent.tab();

    // Verify Rest subcategory shows the remaining 50€ (80€ - 30€)
    const restSubcategoryCell = await getSubcategoryForecastCell({
      subcategoryName: "Другое",
      subcategoryId: REST_SUBCATEGORY_ID,
    });
    expect(restSubcategoryCell).toHaveTextContent("-€50.00");
  });

  it("Category total should increase while Rest stays same when adding another subcategory forecast", async () => {
    mockUpsertForecast();
    render(<PlanningScreen />);

    // Category should show initial forecast of 100€
    const productsCell = await getCategoryForecastCell("Продукты");
    expect(productsCell).toHaveTextContent("-€100.00");

    await expandCategoryRow("Продукты");

    // Verify initial state: Supermarket 50€ and Rest 50€ (100€ - 50€)
    const supermarketCell = await getSubcategoryForecastCell({
      subcategoryName: "Супермаркет",
      subcategoryId: 3,
    });
    expect(supermarketCell).toHaveTextContent("-€50.00");

    const restSubcategoryCellBefore = await getSubcategoryForecastCell({
      subcategoryName: "Другое",
      subcategoryId: REST_SUBCATEGORY_ID,
    });
    expect(restSubcategoryCellBefore).toHaveTextContent("-€50.00");

    // Add forecast for Market subcategory
    const marketCell = await getSubcategoryForecastCell({
      subcategoryName: "Рынок",
      subcategoryId: 4,
    });
    await userEvent.dblClick(marketCell);
    const subcategoryInput = await within(marketCell).findByRole("spinbutton");
    await userEvent.type(subcategoryInput, "20");
    await userEvent.tab();

    // Verify category total increased by 20€ (new subcategory value)
    const productsCellAfter = await getCategoryForecastCell("Продукты");
    expect(productsCellAfter).toHaveTextContent("-€120.00");

    // Verify Rest subcategory stays at 50€
    const restSubcategoryCellAfter = await getSubcategoryForecastCell({
      subcategoryName: "Другое",
      subcategoryId: REST_SUBCATEGORY_ID,
    });
    expect(restSubcategoryCellAfter).toHaveTextContent("-€50.00");
  });

  it("Should lock category forecast editing when subcategories exist", async () => {
    render(<PlanningScreen />);

    // First add some subcategory forecasts
    await expandCategoryRow("Продукты");
    const subcategoryCell = await getSubcategoryForecastCell({
      subcategoryName: "Супермаркет",
      subcategoryId: 3,
    });

    mockUpsertForecast();
    // Try to edit category forecast
    await userEvent.dblClick(subcategoryCell);
    const input = await within(subcategoryCell).findByRole("spinbutton");
    await userEvent.type(input, "50");
    await userEvent.tab();

    // Verify category cell is now read-only
    const categoryCell = await getCategoryForecastCell("Продукты");
    await userEvent.dblClick(categoryCell);
    expect(categoryCell).not.toHaveRole("spinbutton");
  });

  it("Should update forecast with subscriptions total when clicking the badge", async () => {
    mockUpsertForecast();
    render(<PlanningScreen />);

    // Check Entertainment category with Netflix and Spotify subscriptions
    const entertainmentCell = await getCategoryForecastCell("Развлечения");
    expect(entertainmentCell).toHaveTextContent("€0.00");

    const subscriptionsBadge = within(entertainmentCell).getByRole("img", {
      name: "money-collect",
    });
    await userEvent.click(subscriptionsBadge);

    // Verify forecast was updated with total subscriptions (Netflix 15.99€ + Spotify 9.99€ = 25.98€)
    await waitFor(async () => {
      const entertainmentCellAfter = await getCategoryForecastCell(
        "Развлечения"
      );
      expect(entertainmentCellAfter).toHaveTextContent("-€25.98");
    });
  });
});
