<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
	import clsx from 'clsx';
	import { onMount } from 'svelte';
	import DarkModeSwitcher from '@components/common/DarkModeSwitcher';

	let windowWidth;
	onMount(() => {
		window.addEventListener('resize', () => {
			windowWidth = window.innerWidth;
		});
	});
</script>

<svelte:head>
	<title>{$page.data.title || $_('common.title')}</title>
</svelte:head>

<div class="-mx-3 bg-black/[0.15] py-5 px-3 dark:bg-transparent sm:-mx-8 sm:px-8 md:py-0">
	<DarkModeSwitcher />

	<!-- BEGIN: Content -->
	<div
		class={clsx([
			'rounded-[30px] md:rounded-[35px/50px_0px_0px_0px] min-w-0 min-h-screen max-w-full md:max-w-none bg-slate-100 flex-1 pb-10 px-4 md:px-6 relative md:ml-4 dark:bg-darkmode-700',
			"before:content-[''] before:w-full before:h-px before:block",
			"after:content-[''] after:z-[-1] after:rounded-[40px_0px_0px_0px] after:w-full after:inset-y-0 after:absolute after:left-0 after:bg-white/10 after:mt-8 after:-ml-4 after:dark:bg-darkmode-400/50"
		])}
	>
		<slot />
	</div>
	<!-- END: Content -->
</div>
