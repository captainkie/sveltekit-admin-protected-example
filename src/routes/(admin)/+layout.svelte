<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import SideMenu from '@layouts/SideMenu/SideMenu.svelte';
</script>

<svelte:head>
	<title>{$page.data.title || $_('common.title')}</title>
</svelte:head>

<SideMenu>
	<slot />
</SideMenu>
