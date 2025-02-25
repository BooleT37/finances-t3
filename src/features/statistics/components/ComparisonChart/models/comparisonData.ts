export interface ComparisonDataCategory {
  category: string;
  period1: number;
  period2: number;
  isIncome: boolean;
}

type ComparisonData = ComparisonDataCategory[];

export default ComparisonData;
