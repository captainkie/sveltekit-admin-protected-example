<script lang="ts">
	import { _ } from 'svelte-i18n';
	import clsx from 'clsx';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import logoUrl from '$lib/images/ydm-logo.svg';
	import illustrationUrl from '$lib/images/illustration.svg';
	import DarkModeSwitcher from '@components/common/DarkModeSwitcher';
	import { FormInput, FormCheck } from '@components/base/Form';
	import Button from '@components/base/Button';
	import Alert from '@components/base/Alert';
	import Lucide from '@components/base/Lucide';
	import LoadingIcon from '@components/base/LoadingIcon';
	import PasswordStrength from '@components/common/PasswordStrength';
	import { goto } from '$app/navigation';

	export let data: PageData;

	const { form, message, errors, enhance, delayed, timeout } = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		resetForm: true,
		defaultValidator: 'clear'
	});
</script>

<div>
	<div
		class={clsx([
			'-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
			"before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
			"after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700"
		])}
	>
		<DarkModeSwitcher />
		<div class="container relative z-10 sm:px-10">
			<div class="block grid-cols-2 gap-4 xl:grid">
				<div class="flex-col hidden min-h-screen xl:flex">
					<a href="#top" class="flex items-center pt-5 -intro-x">
						<img alt="ydm thailand" class="" src={logoUrl} />
						<span class="ml-3 text-lg text-white"> {$_('pages.login.brand')} </span>
					</a>
					<div class="my-auto">
						<img alt="ydm thailand" class="w-1/2 -mt-16 -intro-x" src={illustrationUrl} />
						<div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
							{@html $_('pages.login.title')}
						</div>
						<div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
							{@html $_('pages.login.excerpt')}
						</div>
					</div>
				</div>

				<div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
					<div
						class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto"
					>
						<h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Sign Up</h2>
						<div class="mt-2 text-center intro-x text-slate-400 dark:text-slate-400 xl:hidden">
							A few more clicks to sign in to your account. Manage all your e-commerce accounts in
							one place
						</div>
						<form method="POST" use:enhance>
							<!-- DEBUG -->
							<!-- <SuperDebug data={$form} /> -->

							<div class="mt-8 intro-x">
								<FormInput
									type="text"
									class="block px-4 py-3 intro-x min-w-full xl:min-w-[350px] {$errors.username
										? `border-danger`
										: ``}"
									placeholder="Username"
									bind:value={$form.username}
								/>
								{#if $errors.username}
									<div class="mt-2 text-danger">
										{@html $errors.username.toString()}
									</div>
								{/if}
								<FormInput
									type="text"
									class="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] {$errors.name
										? `border-danger`
										: ``}"
									placeholder="First Name"
									bind:value={$form.name}
								/>
								{#if $errors.name}
									<div class="mt-2 text-danger">
										{@html $errors.name.toString()}
									</div>
								{/if}
								<FormInput
									type="text"
									class="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] {$errors.surname
										? `border-danger`
										: ``}"
									placeholder="Last Name"
									bind:value={$form.surname}
								/>
								{#if $errors.surname}
									<div class="mt-2 text-danger">
										{@html $errors.surname.toString()}
									</div>
								{/if}
								<FormInput
									type="email"
									class="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] {$errors.email
										? `border-danger`
										: ``}"
									placeholder="Email"
									bind:value={$form.email}
								/>
								{#if $errors.email}
									<div class="mt-2 text-danger">
										{@html $errors.email.toString()}
									</div>
								{/if}
								<FormInput
									type="password"
									class="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] {$errors.password
										? `border-danger`
										: ``}"
									placeholder="Password"
									bind:value={$form.password}
								/>
								{#if $errors.password}
									<div class="mt-2 text-danger">
										{@html $errors.password.toString()}
									</div>
								{/if}

								<PasswordStrength password={$form.password} />

								<FormInput
									type="password"
									class="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] {$errors.confirm
										? `border-danger`
										: ``}"
									placeholder="Password Confirmation"
									bind:value={$form.confirm}
								/>
								{#if $errors.confirm}
									<div class="mt-2 text-danger">
										{@html $errors.confirm.toString()}
									</div>
								{/if}
							</div>
							<div
								class="flex items-center mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm"
							>
								<FormCheck.Input
									id="remember-me"
									type="checkbox"
									class="mr-2 border {$errors.privacy ? `border-danger` : ``}"
									name="privacy"
									checked={true}
									disabled
									bind:value={$form.privacy}
								/>
								<label class="cursor-pointer select-none" for="remember-me">
									I agree to the register
								</label>
								<a class="ml-1 text-primary dark:text-slate-200" href="/privacy-policy">
									Privacy Policy.
								</a>
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
								<div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
									<Button variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
										Register
									</Button>
									<Button
										variant="outline-secondary"
										class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
										on:click={() => {
											goto('/login');
										}}
									>
										Sign in
									</Button>
								</div>
							{/if}

							{#if $message}
								<div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
									<Alert
										variant={$message == 'registered' ? 'success' : 'pending'}
										class="flex items-center mb-2"
									>
										<Lucide
											icon={$message == 'registered' ? 'CheckCircleIcon' : 'AlertTriangle'}
											class="w-6 h-6 mr-2"
										/>
										{$message == 'registered'
											? 'Thank you for registering, please wait for review and approval later.'
											: $message}
									</Alert>
								</div>
							{/if}
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
