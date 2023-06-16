// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface'
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
				icon: 'create_new_folder'
			},
			{
				type: 'dropdown',
				label: 'Space',
				icon: 'library_books',
				isManager: false,
				children: [
				
				]
			}
		]	
	},


	// Leave
	{
		type: 'subheading',
		label: 'Leave ',
		children: [
			{
				type: 'dropdown',
				label: 'Leave Management',
				icon: 'event_available',
				isManager: false,
				children: [
					{
						type: 'link',
						label: 'My Leave Status',
						route: '/leave/my-status',
						icon: 'update',
						isManager: false,
						isReplacementDay: false,
					},
					{
						type: 'link',
						label: 'Leave Request',
						route: '/leave/leave-request-list',
						icon: 'update',
						isManager: false,
						isReplacementDay: false,
					},
					{
						type: 'link',
						label: 'Replacement Day Request',
						route: '/leave/rd-request-list',
						icon: 'update',
						isManager: false,
						isReplacementDay: true,
					},
				]
			},
			{
				type: 'dropdown',
				label: 'Employee Management',
				icon: 'groups',
				isManager: true,
				children: [  
					{
						type: 'link',
						label: 'Employee Leave Status',
						route: '/employee-mngmt/employee-leave-status',
						icon: 'update',
						isManager: true,
						isReplacementDay: false,
					},
					{
						type: 'link',
						label: 'Employee List',
						route: '/employee-mngmt/employee-list',
						icon: 'update',
						isManager: true,
						isReplacementDay: false,
					},
					{
						type: 'link',
						label: 'Employee Leave Request',
						route: '/approval-mngmt/leave-request',
						icon: 'update',
						isManager: true,
						isReplacementDay: false,
					},
					{
						type: 'link',
						label: 'RD Confirming Request',
						route: '/employee-mngmt/employee-rd-request',
						icon: 'update',
						isManager: true,
						isReplacementDay: true,
					},
					{
						type: 'link',
						label: 'Employee Register Request',
						route: '/employee-mngmt/register-request',
						icon: 'update',
						isManager: true,
						isReplacementDay: false,
					},
				]
			}
		]
	},
];
