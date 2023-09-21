<script lang="ts">
	import { page } from '$app/stores';
	import { _ } from 'svelte-i18n';
	import errorIllustration from '$lib/images/error-illustration.svg';
	import Button from '@components/base/Button';
	import { goto } from '$app/navigation';
</script>

<div>
	<div class="py-2">
		<div class="container">
			<div
				class="flex flex-col items-center justify-center h-screen text-center error-page lg:flex-row lg:text-left"
			>
				<div class="-intro-x lg:mr-20">
					<img alt="ydm thailand" class="w-[450px] h-48 lg:h-auto" src={errorIllustration} />
				</div>
				<div class="mt-10 text-white lg:mt-0">
					<div class="font-medium intro-x text-8xl">
						{@html $page.status} : {@html $page.error?.message ?? ''}
					</div>
					<div class="mt-5 text-xl font-medium intro-x lg:text-3xl">
						Oops. This page has gone missing or you don't have permission to access this page.
					</div>
					<div class="mt-3 text-lg intro-x">Contact admin for more detail.</div>
					<Button
						on:click={() => goto('/')}
						class="px-4 py-3 mt-10 text-white border-white intro-x dark:border-darkmode-400 dark:text-slate-200"
					>
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>
