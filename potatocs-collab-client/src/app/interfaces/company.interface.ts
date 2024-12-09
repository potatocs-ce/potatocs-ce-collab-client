export interface Company {
  _id: string;
  companyCode: string; // asdqwe
  companyName: string; // KR
  leaveStandards: leaveStandards[];
  leaveStandardsLength: number;
  isRollover: boolean; // 휴가 이월을 할껀지 말껀지,
  rolloverMaxMonth: number; // 이월된 휴가가 언제까지 사용할껀지 ex) 남은 휴가 3달 더 보관가능
  rolloverMaxLeaveDays: number; // 휴가 이월이 며칠까지 될건지 ex) 남은 휴가 최대 5일 보관가능
  isReplacementDay: boolean; // 대체 휴가를 할껀지 말껀지
  rdValidityTerm: number; // 대체 휴가 유효기간. 대체휴가가 생겼을 시 며칠안에 쓸껀지 기록
  annualPolicy: string; // 'byYear' 은 1월 1일 기준으로 휴가가 생김. 'byContract' 입사일 기준으로 휴가가 생김
  isAdvanceLeave: boolean; // 마이너스 연차
  companyHoliday: CompanyHoliday[];
}

export const InitialCompany: Company = {
  _id: '',
  companyCode: '',
  companyName: '',
  leaveStandards: [],
  leaveStandardsLength: 0,
  isRollover: false,
  rolloverMaxMonth: 0,
  rolloverMaxLeaveDays: 0, // 휴가 이월이 며칠까지 될건지 ex) 남은 휴가 최대 5일 보관가능
  isReplacementDay: false, // 대체 휴가를 할껀지 말껀지
  rdValidityTerm: 0, // 대체 휴가 유효기간. 대체휴가가 생겼을 시 며칠안에 쓸껀지 기록
  annualPolicy: 'byContract', // 'byYear' 은 1월 1일 기준으로 휴가가 생김. 'byContract' 입사일 기준으로 휴가가 생김
  isAdvanceLeave: false, // 마이너스 연차
  companyHoliday: [],
};

/**
 * 연차정책 1년차엔 휴가가 몇개 병가는 몇개 등등...
 */
interface leaveStandards {
  year: number; // 1년차 , 2년차 , 3년차...
  annualLeave: number; // "YYYY-MM-DD"
  sickLeave: number;
}

/**
 * 회사 공휴일 ex) 창립기념일
 */
interface CompanyHoliday {
  companyHolidayName: string;
  companyHolidayDate: string; // "YYYY-MM-DD"
}
