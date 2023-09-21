import { writable } from 'svelte/store';
import type { Icon } from '@components/base/Lucide/Lucide.svelte';

export interface Menu {
	icon: Icon;
	title: string;
	pathname?: string;
	subMenu?: Menu[];
	ignore?: boolean;
}

export interface SideMenuState {
	menu: Array<Menu | 'divider'>;
}

export const sideMenuStore = writable<SideMenuState>({
	menu: [
		{
			icon: 'Home',
			title: 'Dashboard',
			pathname: '/admin/dashboard'
		},
		'divider',
		{
			icon: 'UsersIcon',
			title: 'Users Manage',
			subMenu: [
				{
					icon: 'UserPlusIcon',
					pathname: '/admin/users',
					title: 'Users'
				},
				{
					icon: 'UnlockIcon',
					pathname: '/admin/users/roles',
					title: 'Roles'
				}
			]
		}
	]
});
