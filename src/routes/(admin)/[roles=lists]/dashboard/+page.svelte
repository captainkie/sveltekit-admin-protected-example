<script lang="ts">
	import _ from 'lodash';
	import Alert from '@components/base/Alert';
	import Lucide from '@components/base/Lucide';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
</script>

<div class="relative">
	<div class="grid grid-cols-12 gap-6">
		<div class="z-20 col-span-12 xl:col-span-9 2xl:col-span-9">
			<div class="mt-6 -mb-6 intro-y">
				<Alert
					variant="primary"
					dismissible
					class="flex items-center mb-6 box dark:border-darkmode-600"
					let:dismiss
				>
					<span> Welcome to dashboard </span>
					<Alert.DismissButton class="text-white" on:click={dismiss}>
						<Lucide icon="X" class="w-4 h-4" />
					</Alert.DismissButton>
				</Alert>
			</div>
		</div>
	</div>
</div>
