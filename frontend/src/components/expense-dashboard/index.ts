// Expense Dashboard Components - Export barrel file

// ============================================================
// LAYOUT - Layout components
// ============================================================
export { DashboardLayout, useDashboard } from "./layout/dashboard-layout";
export { Sidebar } from "./layout/sidebar";
export { TopBar } from "./layout/topbar";

// ============================================================
// CHARTS - Chart components
// ============================================================
export { IncomeExpenseBarChart } from "./charts/income-expense-bar-chart";
export { CategoryDonutChart } from "./charts/category-donut-chart";
export { TrendChart } from "./charts/trend-chart";
export { DailyExpenseChart, ComparisonChart, Heatmap } from "./charts/comparison-heatmap";

// ============================================================
// SECTIONS - Section components
// ============================================================
export { BalanceCard, QuickLinks } from "./sections/balance-card";
export { BudgetTracker } from "./sections/budget-tracker";
export { KPICard } from "./sections/kpi-card";
export { RecentTransactions } from "./sections/recent-transactions";
export { TransactionsTable } from "./sections/transactions-table";

// ============================================================
// PANELS - Panel components
// ============================================================
export { RightPanel } from "./panels/right-panel";

// ============================================================
// PAGE COMPONENTS - High-level page components
// ============================================================
export { MainContent } from "./main-content";
export { PersonalExpenseDashboard } from "./personal-expense-dashboard";

// ============================================================
// BACKWARDS COMPATIBILITY - Old exports (deprecated)
// ============================================================
// These exports maintain backwards compatibility for existing imports
// They re-export from the new locations
export { IncomeExpenseBarChart as OldIncomeExpenseBarChart } from "./charts/income-expense-bar-chart";
