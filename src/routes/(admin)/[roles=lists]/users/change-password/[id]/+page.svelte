<script lang="ts">
	import _ from 'lodash';
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import avatar from '$lib/images/settings/profile.png';
	import Button from '@components/base/Button';
	import { FormInput, FormLabel } from '@components/base/Form';
	import Lucide from '@components/base/Lucide';
	import { Menu } from '@components/base/Headless';
	import PasswordStrength from '@components/common/PasswordStrength';
	import LoadingIcon from '@components/base/LoadingIcon';
	import Alert from '@components/base/Alert';
	import type { PageData } from './$types';

	export let data: PageData;

	let user: any = $page.data.userProfile;

	const { form, message, errors, enhance, delayed, timeout } = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		resetForm: true,
		defaultValidator: 'clear'
	});
</script>

<div>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">Change Password</h2>
	</div>
	<div class="grid grid-cols-12 gap-6">
		<!-- BEGIN: Profile Menu -->
		<div class="flex flex-col-reverse col-span-12 lg:col-span-4 2xl:col-span-3 lg:block">
			<div class="mt-5 intro-y box">
				<div class="relative flex items-center p-5">
					<div class="w-12 h-12 image-fit">
						<img alt="profile" class="rounded-full" src={avatar} />
					</div>
					<div class="ml-4 mr-auto">
						<div class="text-base font-medium">
							{`${data.items.name} ${data.items.surname}`}
						</div>
						<div class="text-slate-500">{`${data.items.username} | ${data.items.role}`}</div>
					</div>
					<Menu>
						<Menu.Button as="a" class="block w-5 h-5">
							<Lucide icon="MoreHorizontal" class="w-5 h-5 text-slate-500" />
						</Menu.Button>
					</Menu>
				</div>
				<div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
					<a
						class="flex items-center mt-5"
						href="#top"
						on:click={() => {
							goto(`/admin/users/edit/${data.items._id}`);
						}}
					>
						<Lucide icon="Box" class="w-4 h-4 mr-2" /> Account Settings
					</a>
					<a
						class="flex items-center mt-5"
						href="#top"
						on:click={() => {
							goto(`/admin/users/change-password/${data.items._id}`);
						}}
					>
						<Lucide icon="Lock" class="w-4 h-4 mr-2" /> Change Password
					</a>
				</div>

				<!-- DEBUG -->
				<!-- <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
					<SuperDebug data={$form} />
				</div> -->
			</div>
		</div>
		<!-- END: Profile Menu -->
		<div class="col-span-12 lg:col-span-8 2xl:col-span-9">
			<!-- BEGIN: Change Password -->
			<form method="POST" use:enhance>
				<div class="intro-y box lg:mt-5">
					<div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
						<h2 class="mr-auto text-base font-medium">Change Password</h2>
					</div>
					<div class="p-5">
						<div>
							<FormLabel htmlFor="change-password-form-1">Old Password</FormLabel>
							<FormInput
								id="change-password-form-1 {$errors.old_password ? `border-danger` : ``}"
								type="password"
								placeholder="Input old password"
								bind:value={$form.old_password}
							/>
							{#if $errors.old_password}
								<div class="mt-2 text-danger">
									{@html $errors.old_password.toString()}
								</div>
							{/if}
						</div>
						<div class="mt-3">
							<FormLabel htmlFor="change-password-form-2">New Password</FormLabel>
							<FormInput
								id="change-password-form-2 {$errors.password ? `border-danger` : ``}"
								type="password"
								placeholder="Input password"
								bind:value={$form.password}
							/>
							{#if $errors.password}
								<div class="mt-2 text-danger">
									{@html $errors.password.toString()}
								</div>
							{/if}
							<PasswordStrength password={$form.password} />
						</div>
						<div class="mt-3">
							<FormLabel htmlFor="change-password-form-3">Confirm New Password</FormLabel>
							<FormInput
								id="change-password-form-3 {$errors.confirm ? `border-danger` : ``}"
								type="password"
								placeholder="Input password confirmation"
								bind:value={$form.confirm}
							/>
							{#if $errors.confirm}
								<div class="mt-2 text-danger">
									{@html $errors.confirm.toString()}
								</div>
							{/if}
						</div>
						{#if $delayed}
							<div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
								<div
									class="flex items-center justify-center col-span-6 sm:col-span-3 xl:col-span-2"
								>
									<LoadingIcon icon="puff" class="w-8 h-8" />
									<LoadingIcon icon="puff" class="w-8 h-8" />
									<LoadingIcon icon="puff" class="w-8 h-8" />
								</div>
							</div>
						{:else}
							<Button variant="primary" type="submit" class="mt-4">Change Password</Button>
						{/if}

						{#if $message}
							<div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
								<Alert variant="pending" class="flex items-center mb-2">
									<Lucide icon="AlertTriangle" class="w-6 h-6 mr-2" />
									{$message}
								</Alert>
							</div>
						{/if}
					</div>
				</div>
			</form>
			<!-- END: Change Password -->
		</div>
	</div>
</div>
