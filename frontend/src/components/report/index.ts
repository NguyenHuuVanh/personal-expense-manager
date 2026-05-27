// Filter Components - Export barrel file
// Hướng dẫn tích hợp vào dự án CRM

// 1. Copy các file sau vào dự án:
//    - src/components/report/report-filters.tsx
//    - src/components/ui/date-picker-inline.tsx
//    - src/components/ui/combobox-multi-select.tsx
//    - src/components/advanced-filter/* (tất cả files)
//    - src/types/filter-report.ts
//    - src/types/advanced-filter.ts
//    - src/hooks/use-advanced-filter.ts

// 2. Cài đặt dependencies nếu chưa có:
//    npm install @ark-ui/react date-fns lucide-react

// 3. Import và sử dụng:
export { ReportFilters } from '@/components/report/report-filters';

// Email Marketing Report Filters:
export { ReportFilters as EmailReportFilters } from '@/components/report/email-report-filters';

// Advanced Filter Components:
export {
  AdvancedFilterButton,
  AdvancedFilterPanel,
  FilterActiveTags,
  FilterRuleRow,
  FilterLogicToggle,
  FilterPresetManager,
  FieldSelect,
  OperatorSelect,
  ValueInput,
} from '@/components/advanced-filter';

// Types:
export type { FilterReportProps, TagItem } from '@/types/filter-report';
export type {
  FilterOperator,
  FilterFieldConfig,
  FilterModuleConfig,
  FilterRule,
  FilterGroup,
  FilterPreset,
} from '@/types/advanced-filter';

// Hooks:
export { useAdvancedFilter } from '@/hooks/use-advanced-filter';
