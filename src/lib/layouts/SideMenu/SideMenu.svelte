<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { slide } from 'svelte/transition';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { sideMenuStore } from '$lib/stores/side-menu';
	import { type FormattedMenu, linkTo, nestedMenu, findActiveMenu } from './side-menu';
	import logoUrl from '$lib/images/ydm-logo.svg';
	import TopBar from '@components/common/TopBar';
	import DarkModeSwitcher from '@components/common/DarkModeSwitcher';
	import MobileMenu from '@components/common/MobileMenu';
	import Tippy from '@components/base/Tippy';
	import Lucide from '@components/base/Lucide/Lucide.svelte';

	let windowWidth: number = 0;
	if (browser) {
		windowWidth = window.innerWidth;
	}

	let formattedMenu: Array<FormattedMenu | 'divider'> = [];
	const sideMenu = () => nestedMenu($sideMenuStore.menu, $page.url.pathname);

	$: {
		if ($sideMenuStore || $page.url.pathname) {
			formattedMenu = sideMenu();
		}
	}

	const handleReloadSideMenu = () => {
		// console.log('handleReloadSideMenu');
		// console.log(formattedMenu);
	};

	onMount(() => {
		if (browser) {
			window.addEventListener('resize', () => {
				windowWidth = window.innerWidth;
			});
		}
	});
</script>

<div class="-mx-3 bg-black/[0.15] py-5 px-3 dark:bg-transparent sm:-mx-8 sm:px-8 md:py-0">
	<DarkModeSwitcher />

	<MobileMenu />
</div>
