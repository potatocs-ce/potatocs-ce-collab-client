// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface';
export const sidenavRouteInfo: NavigationItem[] = [
    // dashboard
    {
        type: 'link',
        label: 'Dashboard',
        route: '/main',
        icon: 'dashboard',
        isManager: false,
        isReplacementDay: false,
    },

    // project
    {
        type: 'subheading',
        label: 'project',
        children: [
            {
                type: 'click',
                label: 'Create space',
                icon: 'create_new_folder',
            },
            {
                type: 'dropdown',
                label: 'Space',
                icon: 'library_books',
                isManager: false,
                children: [],
            },
        ],
    },
];
