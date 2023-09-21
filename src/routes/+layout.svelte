<script lang="ts">
	import '../app.css';
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>{$page.data.title || $_('common.title')}</title>
</svelte:head>

<slot />
