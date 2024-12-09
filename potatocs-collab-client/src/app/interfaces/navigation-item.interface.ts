// kje: 판별 유니언 (Discriminated Unions)
// https://typescript-kr.github.io/pages/Advanced%20Types.html#%EB%AC%B8%EC%9E%90%EC%97%B4-%EB%A6%AC%ED%84%B0%EB%9F%B4-%ED%83%80%EC%9E%85-string-literal-types
// https://medium.com/@ahsan.ayaz/understanding-discriminated-unions-in-typescript-1ccc0e053cf5
export type NavigationItem = NavigationLink | NavigationDropdown | NavigationSubheading | NavigationCreateSpace;

/**
 * Subheading: no link
 */
export interface NavigationSubheading {
    // kje
    // https://stackoverflow.com/questions/26855423/how-to-require-a-specific-string-in-typescript-interface
    // https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-8.html#string-literal-types
    type: "subheading";
    label: string;
    children: Array<NavigationLink | NavigationDropdown | NavigationCreateSpace>;
    isManager?: boolean;
}

/**
 * Drop Down item (no link)
 */
export interface NavigationDropdown {
    type: "dropdown";
    label: string;
    icon?: string;
    children: Array<NavigationLink | NavigationDropdown>;
    isManager?: boolean;
}

/**
 *  일반 Link item (no child)
 */
export interface NavigationLink {
    type: "link";
    route: string; // 원본은 function이 들어올 수 있어서  |any 추가됨 -> 여기서는 삭제
    fragment?: string;
    label: string;
    icon?: string;
    routerLinkActive?: { exact: boolean };
    isManager?: boolean;

    isReplacementDay?: boolean;

    isSuperManager?: boolean;
    faceAuthentication?: boolean
}

/**
 *  일반 Click item (no child)
 */
export interface NavigationCreateSpace {
    type: "click";
    // route: string; // 원본은 function이 들어올 수 있어서  |any 추가됨 -> 여기서는 삭제
    // fragment?: string;
    label: string;
    icon?: string;
    // routerLinkActive?: { exact: boolean };
    isManager?: boolean;
}

export interface SidenavViewPolicy {
    isManager?: boolean;
}
