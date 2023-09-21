import { goto } from '$app/navigation';
import type { Menu } from '$lib/stores/side-menu';
import { page } from '$app/stores';
export interface FormattedMenu extends Menu {
	active?: boolean;
	activeDropdown?: boolean;
	subMenu?: FormattedMenu[];
}

const findActiveMenu = (subMenu: Menu[], pathname: string): boolean => {
	let match = false;
	subMenu.forEach((item) => {
		if (item.pathname?.replace('/admin/', '').startsWith(pathname)) {
			match = true;
		} else if (!match && item.subMenu) {
			match = findActiveMenu(item.subMenu, pathname);
		}
	});

	return match;
};

const nestedMenu = (menu: Array<Menu | 'divider'>, pathname: string) => {
	const formattedMenu: Array<FormattedMenu | 'divider'> = [];
	menu.forEach((item) => {
		if (typeof item !== 'string') {
			const subMenu: Array<FormattedMenu> = [];
			if (item.subMenu) {
				item.subMenu.map((menu) => typeof menu !== 'string' && subMenu.push(menu));
			}

			const currentPath = pathname.replace('/admin/', '').split('/');
			const menuItem: FormattedMenu = {
				icon: item.icon,
				title: item.title,
				pathname: item.pathname,
				subMenu: subMenu.length > 0 ? subMenu : undefined,
				active:
					item.pathname === `/admin/${currentPath}` ||
					(item.subMenu && findActiveMenu(item.subMenu, currentPath[0])),
				activeDropdown: item.subMenu && findActiveMenu(item.subMenu, currentPath[0])
			};

			formattedMenu.push(menuItem);
		} else {
			formattedMenu.push(item);
		}
	});

	return formattedMenu;
};

const linkTo = (menu: FormattedMenu) => {
	if (menu.subMenu) {
		menu.activeDropdown = !menu.activeDropdown;
	} else {
		if (menu.pathname !== undefined) {
			goto(menu.pathname);
		}
	}
};

export { nestedMenu, linkTo, findActiveMenu };
