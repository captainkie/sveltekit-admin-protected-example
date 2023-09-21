<script lang="ts">
	import { _ } from 'svelte-i18n';
	import clsx from 'clsx';
	import type { PageData } from './$types';
	import { z } from 'zod';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import dayjs from 'dayjs';
	import buddhistEra from 'dayjs/plugin/buddhistEra';
	import customParseFormat from 'dayjs/plugin/customParseFormat';
	import utc from 'dayjs/plugin/utc';
	import 'dayjs/locale/th';

	import logoUrl from '$lib/images/ydm-logo.svg';
	import illustrationUrl from '$lib/images/illustration.svg';
	import DarkModeSwitcher from '@components/common/DarkModeSwitcher';
	import { FormInput, FormCheck } from '@components/base/Form';
	import Button from '@components/base/Button';
	import Alert from '@components/base/Alert';
	import Lucide from '@components/base/Lucide';
	import LoadingIcon from '@components/base/LoadingIcon';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data: PageData;

	dayjs.extend(buddhistEra);
	dayjs.extend(utc);
	dayjs.extend(customParseFormat);
	dayjs.locale('th');

	$: defaultYear = parseInt(dayjs().format('BBBB'));

	const loginSchema = z.object({
		username: z
			.string()
			.min(5)
			.max(30)
			.regex(/^[a-z0-9]+$/i),
		password: z
			.string()
			.min(8)
			.max(24)
			.regex(
				/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,24}$/
			)
	});

	const { form, message, errors, enhance, delayed, timeout } = superForm(data.form, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		resetForm: true,
		validators: loginSchema,
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
						<h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
							{$_('pages.login.signin')}
						</h2>
						<div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
							{@html $_('pages.login.title') + '<br/>' + $_('pages.login.excerpt')}
						</div>

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
						</div>
						<div class="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
							<div class="flex items-center mr-auto">
								<FormCheck.Input id="remember-me" type="checkbox" class="mr-2 border" />
								<label class="cursor-pointer select-none" for="remember-me"> Remember me </label>
							</div>
							<a href="#top">Forgot Password?</a>
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
							<div class="xl:flex mt-5 text-center intro-x xl:mt-8 xl:text-left">
								<form method="POST" use:enhance>
									<Button
										formaction="?/login"
										variant="primary"
										class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
									>
										Login
									</Button>
								</form>
								<Button
									on:click={() => {
										goto('/register');
									}}
									variant="outline-secondary"
									class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
								>
									Register
								</Button>
							</div>
						{/if}

						{#if $message}
							<div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
								<Alert variant="pending" class="flex items-center mb-2">
									<Lucide icon="AlertTriangle" class="w-6 h-6 mr-2" />
									{$message}
								</Alert>
							</div>
						{/if}

						<div
							class="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left"
						>
							By signin up, you agree to our
							<a class="text-primary dark:text-slate-200" href="/privacy-policy">
								Privacy Policy
							</a>
							| © {defaultYear} Digital Technology
							<a
								class="text-primary dark:text-slate-200"
								href="https://www.ydmthailand.com"
								target="_blank"
							>
								@Ydm Thailand
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
