import { trigger, state, style, transition, animate } from '@angular/animations';

// true false -> 'open', 'closed'로 변경함.
// HTML에서 true false로 사용해도 자동으로 string으로 변환되어 정상동작은 함.
export const dropdownAnimation = trigger('dropdown', [
  state('closed', style({
    height: 0,
    opacity: 0
  })),
  state('open', style({
    // style wildcard: https://angular.kr/guide/transition-and-triggers
    height: '*',  // --> height와 opacity는 따로 설정하지 않아도 정상 동작함...
    opacity: 1    // --> css에 해당 항목이 없어서 default 값으로 설정되서 그런 듯?
  })),
  transition('closed <=> open', animate('300ms ease')) // animate는 하나만 있는 경우는 [] 생략 가능. animate ('duration delay easing')
  // 원본 transition('false <=> true', animate('300ms cubic-bezier(.35, 0, .25, 1)'))
]);
