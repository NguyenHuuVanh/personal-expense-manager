// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Filter Report Types — Config-driven filter system
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export enum TimePeriodEnum {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  THIS_WEEK = 'THIS_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  THIS_QUARTER = 'THIS_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_MONTH = 'LAST_MONTH',
  LAST_QUARTER = 'LAST_QUARTER',
  LAST_YEAR = 'LAST_YEAR',
  SAME_PERIOD_LAST_YEAR = 'SAME_PERIOD_LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

export const TIME_PERIOD_LABELS: Record<TimePeriodEnum, string> = {
  [TimePeriodEnum.TODAY]: 'Hôm nay',
  [TimePeriodEnum.YESTERDAY]: 'Hôm qua',
  [TimePeriodEnum.THIS_WEEK]: 'Tuần này',
  [TimePeriodEnum.THIS_MONTH]: 'Tháng này',
  [TimePeriodEnum.THIS_QUARTER]: 'Quý này',
  [TimePeriodEnum.THIS_YEAR]: 'Năm nay',
  [TimePeriodEnum.LAST_MONTH]: 'Tháng trước',
  [TimePeriodEnum.LAST_QUARTER]: 'Quý trước',
  [TimePeriodEnum.LAST_YEAR]: 'Năm trước',
  [TimePeriodEnum.SAME_PERIOD_LAST_YEAR]: 'Cùng kỳ năm trước',
  [TimePeriodEnum.CUSTOM]: 'Chọn thời gian',
};

export type TagItem = {
  value: string;
  label: string;
  color?: string;
};

export type FilterReportState = {
  timePeriod: TimePeriodEnum | null;
  startDate: Date | null;
  endDate: Date | null;
  departmentId: string | null;
  teamId: string | null;
  memberId: string | null;
  tags: TagItem[];
  customTags: string[];
};

export type FilterReportCallbacks = {
  onTimePeriodChange?: (value: TimePeriodEnum | null) => void;
  onStartDateChange?: (value: Date | undefined) => void;
  onEndDateChange?: (value: Date | undefined) => void;
  onDepartmentChange?: (value: string | null) => void;
  onTeamChange?: (value: string | null) => void;
  onMemberChange?: (value: string | null) => void;
  onTagsChange?: (tags: TagItem[]) => void;
  onCustomTagsChange?: (tags: string[]) => void;
};

export type FilterReportProps = FilterReportState &
  FilterReportCallbacks & {
    showTimePeriod?: boolean;
    showDepartment?: boolean;
    showTeam?: boolean;
    showMember?: boolean;
    showTags?: boolean;
    showCustomTags?: boolean;
    departmentOptions?: readonly IOptionSelect[];
    teamOptions?: readonly IOptionSelect[];
    memberOptions?: readonly IOptionSelect[];
    tagOptions?: readonly IOptionSelect[];
    showSelectAllTeam?: boolean;
    onReset?: () => void;
    className?: string;
    classNameFilters?: string;
  };

export interface IOptionSelect {
  value: string;
  label: string;
  disabled?: boolean;
  [key: string]: any;
}
