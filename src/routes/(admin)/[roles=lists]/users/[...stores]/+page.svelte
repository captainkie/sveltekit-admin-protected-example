<script lang="ts">
	import _ from 'lodash';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Toastify from 'toastify-js';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import avatar from '$lib/images/settings/profile.png';
	import Button from '@components/base/Button';
	import { FormInput, FormLabel, FormCheck, FormHelp } from '@components/base/Form';
	import Lucide from '@components/base/Lucide';
	import TomSelect from '@components/base/TomSelect';
	import { Dialog } from '@components/base/Headless';
	import LoadingIcon from '@components/base/LoadingIcon';
	import Notification from '@components/base/Notification';
	import PasswordStrength from '@components/common/PasswordStrength';

	import type { PageData } from './$types';

	export let data: PageData;

	let user: any = $page.data.userProfile;

	$: mode = data.mode;

	const { form, message, errors, enhance, delayed, timeout } = superForm(data.registerStoreForm, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		// resetForm: true,
		defaultValidator: 'clear',
		onError({ result, message }) {
			showErrorNotification();
		},
		onUpdate({ form, formEl, cancel }) {
			if (!form.valid) {
				showErrorNotification();
			}
		},
		onUpdated({ form }) {
			if (form.valid) {
				if (mode === 'add' && form.data.id !== 'generated') {
					goto('/').then(() => goto(`/admin/users/`));
				} else {
					showSuccessNotification();
				}
			}
		}
	});

	const {
		form: deleteForm,
		message: deleteMessage,
		errors: deleteErrors,
		enhance: deleteEnhance,
		delayed: deleteDelayed,
		timeout: deleteTimeout
	} = superForm(data.deleteForm, {
		delayMs: 500,
		timeoutMs: 8000,
		dataType: 'json',
		// resetForm: true,
		// defaultValidator: 'clear',
		onError({ result, message }) {
			showErrorNotification();
		},
		onUpdate({ form, formEl, cancel }) {
			if (!form.valid) {
				showErrorNotification();
			}
		},
		onUpdated({ form }) {
			if (form.valid) {
				goto('/').then(() => goto(`/admin/users`));
			}
		}
	});

	const showSuccessNotification = () => {
		if (browser) {
			const successEl = document
				.querySelectorAll('#success-notification-content')[0]
				.cloneNode(true) as HTMLElement;
			successEl.classList.remove('hidden');

			const toast = Toastify({
				node: successEl,
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: 'top',
				position: 'right',
				stopOnFocus: true
			});

			toast.showToast();

			setTimeout(() => {
				toast.hideToast();
			}, 2000);
		}
	};
	const showErrorNotification = () => {
		if (browser) {
			const failedEl = document
				.querySelectorAll('#failed-notification-content')[0]
				.cloneNode(true) as HTMLElement;
			failedEl.classList.remove('hidden');

			const toast = Toastify({
				node: failedEl,
				duration: 3000,
				newWindow: true,
				close: true,
				gravity: 'top',
				position: 'right',
				stopOnFocus: true
			});

			toast.showToast();

			setTimeout(() => {
				toast.hideToast();
			}, 2000);
		}
	};

	let deleteConfirmationModal = false;
	const setDeleteConfirmationModal = (value: boolean) => {
		deleteConfirmationModal = value;
	};
	let deleteButtonRef: any = null;

	let handleDeleteSubmit: () => void = async () => {
		if (browser) {
			const submitForm = document.getElementById('deleteForm');
			if (submitForm) {
				submitForm.dispatchEvent(new Event('submit', { bubbles: true }));
			}
		}
	};
</script>

<div>
	<div class="flex items-center mt-8 intro-y">
		<h2 class="mr-auto text-lg font-medium">
			{mode === 'add' ? `Add New User` : `Update Profile`}
		</h2>
	</div>

	{#key mode}
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-12 lg:col-span-8 2xl:col-span-12">
				<!-- BEGIN: Display Information -->
				<div class="intro-y box lg:mt-5">
					<div class="flex items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
						<h2 class="mr-auto text-base font-medium">Personal Information</h2>
					</div>
					<div class="p-5">
						<div class="flex flex-col xl:flex-row">
							<div class="flex-1 mt-6 xl:mt-0">
								<div class="grid grid-cols-12 gap-x-5">
									<div class="col-span-12 2xl:col-span-6">
										<div>
											<FormLabel htmlFor="update-profile-form-1">Username</FormLabel>
											<FormInput
												class={$errors.username ? `border-danger` : ``}
												id="update-profile-form-1"
												type="text"
												placeholder="username"
												readOnly={mode === 'edit'}
												disabled={mode === 'edit'}
												bind:value={$form.username}
											/>
										</div>
										<div class="mt-3">
											<FormLabel htmlFor="update-profile-form-4">Firstname</FormLabel>
											<FormInput
												class={$errors.name ? `border-danger` : ``}
												id="update-profile-form-4"
												type="text"
												placeholder="Kie"
												bind:value={$form.name}
											/>
										</div>
										<div class="mt-3">
											<FormLabel htmlFor="update-profile-form-2">Role</FormLabel>
											<TomSelect
												id="update-profile-form-2"
												readOnly={mode === 'add'}
												disabled={mode === 'add'}
												bind:value={$form.role}
												class="w-full {$errors.role ? `border-danger` : ``}"
											>
												{#if user.role === 'superadmin'}
													<option value="superadmin">Super Administrator</option>
												{/if}
												{#if user.role === 'api'}
													<option value="api">Api</option>
												{/if}
												<option value="admin">Administrator</option>
												<option value="user">User</option>
												<option value="guest">Guest</option>
											</TomSelect>
										</div>
										<FormHelp class="text-warning">** This field enable in in "edit" mode</FormHelp>
									</div>
									<div class="col-span-12 2xl:col-span-6">
										<div class="mt-3 2xl:mt-0">
											<FormLabel htmlFor="update-profile-form-4">Email</FormLabel>
											<FormInput
												class={$errors.email ? `border-danger` : ``}
												id="update-profile-form-4"
												type="text"
												placeholder="kie@adyim.com"
												readOnly={mode === 'edit'}
												disabled={mode === 'edit'}
												bind:value={$form.email}
											/>
										</div>
										<div class="mt-3">
											<FormLabel htmlFor="update-profile-form-4">Surname</FormLabel>
											<FormInput
												id="update-profile-form-4"
												type="text"
												placeholder="Adyim"
												class={$errors.surname ? `border-danger` : ``}
												bind:value={$form.surname}
											/>
										</div>
										<div class="mt-3">
											<FormLabel htmlFor="update-profile-form-2">Status</FormLabel>
											<TomSelect
												id="update-profile-form-2"
												readOnly={mode === 'add'}
												disabled={mode === 'add'}
												bind:value={$form.status}
												class="w-full {$errors.role ? `border-danger` : ``}"
											>
												<option value={'true'}>Active</option>
												<option value={'false'}>Inactive</option>
											</TomSelect>
										</div>
										<FormHelp class="text-warning">** This field enable in "edit" mode</FormHelp>
									</div>
									<div class="col-span-12">
										{#if mode === 'add'}
											<div class="mt-3">
												<FormLabel htmlFor="update-profile-form-5">Password</FormLabel>
												<FormInput
													id="update-profile-form-1"
													type="password"
													placeholder="password ..."
													class={$errors.password ? `border-danger` : ``}
													bind:value={$form.password}
												/>
												<PasswordStrength password={$form.password} />
											</div>
											<div class="mt-3">
												<FormLabel htmlFor="update-profile-form-5">Confirm Password</FormLabel>
												<FormInput
													id="update-profile-form-1"
													type="password"
													placeholder="confirm password ..."
													class={$errors.confirm ? `border-danger` : ``}
													bind:value={$form.confirm}
												/>
											</div>
										{/if}
										<div class="mt-3">
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
									</div>
									<div class="col-span-12">
										<div class="mt-3">
											{#if $errors.username}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Username : </span>
													{@html $errors.username.toString()}
												</div>
											{/if}
											{#if $errors.email}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Email : </span>
													{@html $errors.email.toString()}
												</div>
											{/if}
											{#if $errors.name}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Firstname : </span>
													{@html $errors.name.toString()}
												</div>
											{/if}
											{#if $errors.surname}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Surname : </span>
													{@html $errors.surname.toString()}
												</div>
											{/if}
											{#if $errors.password}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Password : </span>
													{@html $errors.password.toString()}
												</div>
											{/if}
											{#if $errors.confirm}
												<div class="mt-1 text-danger">
													<span class="font-bold italic">Confirm Password : </span>
													{@html $errors.confirm.toString()}
												</div>
											{/if}
										</div>
									</div>
								</div>
								{#if $delayed}
									<div class="flex w-full mt-8 sm:w-auto sm:mt-0">
										<div
											class="flex items-center justify-center col-span-6 sm:col-span-3 xl:col-span-2"
										>
											<LoadingIcon icon="puff" class="w-8 h-8" />
											<LoadingIcon icon="puff" class="w-8 h-8" />
											<LoadingIcon icon="puff" class="w-8 h-8" />
										</div>
									</div>
								{:else}
									<div class="mt-8 flex">
										{#if mode !== 'add' && user._id !== $form.id}
											<Button
												on:click={(event) => {
													event.preventDefault();
													setDeleteConfirmationModal(true);
												}}
												variant="danger"
												class="wflex items-center shadow-md mr-2"
												>Delete
												<Lucide icon="Trash" class="w-4 h-4 ml-2" /></Button
											>
										{/if}

										<form method="POST" use:enhance>
											<Button
												formaction="?/registerStore"
												variant="primary"
												type="submit"
												class="w-20">Save <Lucide icon="SaveIcon" class="w-4 h-4 ml-2" /></Button
											>
										</form>
									</div>
								{/if}
							</div>
							<div class="mx-auto w-52 xl:mr-0 xl:ml-6">
								<div
									class="p-5 border-2 border-dashed rounded-md shadow-sm border-slate-200/60 dark:border-darkmode-400"
								>
									<div class="relative h-40 mx-auto cursor-pointer image-fit zoom-in">
										<img
											class="rounded-md"
											alt="Midone Tailwind HTML Admin Template"
											src={avatar}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- END: Display Information -->

				<!-- DEBUG -->
				<!-- <div class="p-5 intro-y box mt-2">
					<div class="mt-3">
						<FormLabel htmlFor="post-form-3">Debug Add/Edit Form</FormLabel>
						<SuperDebug data={$form} />
					</div>
					<div class="mt-3">
						<FormLabel htmlFor="post-form-3">Debug Delete Form</FormLabel>
						<SuperDebug data={$deleteForm} />
					</div>
				</div> -->
			</div>

			<!-- BEGIN: Success Notification Content -->
			<Notification id="success-notification-content" class="flex hidden">
				<Lucide icon="CheckCircle" class="text-success" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Success!</div>
					<div class="mt-1 text-slate-500">contents is updated</div>
				</div>
			</Notification>
			<!-- END: Success Notification Content -->
			<!-- BEGIN: Failed Notification Content -->
			<Notification id="failed-notification-content" class="flex hidden">
				<Lucide icon="XCircle" class="text-danger" />
				<div class="ml-4 mr-4">
					<div class="font-medium">Failed!</div>
					<div class="mt-1 text-slate-500">can not update contents</div>
				</div>
			</Notification>
			<!-- END: Failed Notification Content -->
		</div>
	{/key}

	<!-- BEGIN: Delete Confirmation Modal -->
	<Dialog
		open={deleteConfirmationModal}
		on:close={() => {
			setDeleteConfirmationModal(false);
		}}
		initialFocus={deleteButtonRef}
	>
		<Dialog.Panel>
			<form id="deleteForm" action="?/deleteItem" method="POST" use:deleteEnhance>
				<div class="p-5 text-center">
					<Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
					<div class="mt-5 text-3xl">Are you sure?</div>
					<div class="mt-2 text-slate-500">
						Do you really want to delete these records? <br />
						This process cannot be undone.
					</div>
				</div>
				<div class="px-5 pb-8 text-center">
					<Button
						variant="outline-secondary"
						type="button"
						on:click={() => {
							setDeleteConfirmationModal(false);
						}}
						class="w-24 mr-1"
					>
						Cancel
					</Button>

					<Button
						variant="danger"
						type="button"
						class="w-24"
						bind:ref={deleteButtonRef}
						on:click={handleDeleteSubmit}>Delete</Button
					>
				</div>
			</form>
		</Dialog.Panel>
	</Dialog>
	<!-- END: Delete Confirmation Modal -->
</div>
