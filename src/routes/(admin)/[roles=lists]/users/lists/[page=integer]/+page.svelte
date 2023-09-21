<script lang="ts">
	import _ from 'lodash';
	import clsx from 'clsx';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '@components/base/Button';
	import Pagination from '@components/common/Pagination/Pagination.svelte';
	import { FormInput } from '@components/base/Form';
	import Lucide from '@components/base/Lucide';
	import { Dialog, Menu } from '@components/base/Headless';
	import avatar from '$lib/images/settings/profile.png';
	import type { PageData } from './$types';

	export let data: PageData;

	$: items = [...data.items?.users];
	$: totalItems = data.items.count;
	$: totalPages = Math.ceil(data.items.count / Number(data.limit));
	$: currentPage = Number($page.params.page) - 1;

	let user: any = $page.data.userProfile;

	let searchVal: string | null;
	if ($page.url.searchParams.has('q')) {
		searchVal = $page.url.searchParams.get('q');
	}

	const handleSearch = () => {
		const newUrl = new URL($page.url);
		searchVal ? newUrl?.searchParams?.set('q', searchVal) : newUrl?.searchParams?.delete('q');
		goto(newUrl);
	};

	const handleGotoEdit: (id: string) => void = (id) => {
		if (user.role !== 'superadmin' && user.role !== 'admin' && user._id !== id) {
			setPermissionConfirmationModal(true);
		} else {
			goto(`/admin/users/edit/${id}`);
		}
	};

	let permissionConfirmationModal = false;
	const setPermissionConfirmationModal = (value: boolean) => {
		permissionConfirmationModal = value;
	};
	let permissionButtonRef: any = null;
</script>

<div>
	<h2 class="mt-10 text-lg font-medium intro-y">Users</h2>
	<div class="grid grid-cols-12 gap-6 mt-5">
		<div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
			<Button variant="primary" class="mr-2 shadow-md" on:click={() => goto('/admin/users/add')}
				>Add New User</Button
			>
			<Menu>
				<Menu.Button as={Button} class="px-2 !box">
					<span class="flex items-center justify-center w-5 h-5">
						<Lucide icon="Plus" class="w-4 h-4" />
					</span>
				</Menu.Button>
			</Menu>
			<div class="hidden mx-auto md:block text-slate-500">
				found {totalItems} entries
			</div>
			<div class="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
				<div class="relative w-56 text-slate-500">
					<form on:submit|preventDefault={handleSearch}>
						<FormInput
							type="text"
							class="w-56 pr-10 !box"
							placeholder="Search..."
							bind:value={searchVal}
						/>
					</form>
					<Lucide icon="Search" class="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
				</div>
			</div>
		</div>
		<!-- BEGIN: Users Layout -->
		{#if items.length === 0}
			<div class="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap box h-20">
				<div class="hidden mx-auto md:block text-slate-500">- data not found -</div>
			</div>
		{:else}
			{#each items as item, itemKey}
				<div class="col-span-12 intro-y md:col-span-6">
					<div class="box">
						<div class="flex flex-col items-center p-5 lg:flex-row">
							<div class="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
								<img alt="profile" class="rounded-full" src={avatar} />
							</div>
							<div class="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
								<a href="#top" class="font-medium">
									{`${item.name} ${item.surname}`}
								</a>
								<div class="text-slate-500 text-xs mt-0.5">
									<span class="text-primary">email: </span>{item.email},
									<span class="text-primary">role: </span>{item.role}
								</div>
							</div>

							<div class="flex mt-4 lg:mt-0">
								<div
									class={clsx([
										'flex items-center justify-center mr-5',
										{ 'text-success': item.status },
										{ 'text-danger': !item.status }
									])}
								>
									<Lucide icon="CheckSquare" class="w-4 h-4 mr-2" />
									{item.status ? 'Active' : 'Inactive'}
								</div>
								{#if item.role === 'superadmin' || item.role === 'api'}
									<div />
								{:else}
									<Button
										variant="outline-secondary"
										class="px-2 py-1"
										on:click={(event) => {
											event.preventDefault();
											handleGotoEdit(item._id);
										}}><Lucide icon="EditIcon" class="w-4 h-4 mr-2" />Edit Profile</Button
									>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
		<!-- END: Users Layout -->
		<!-- BEGIN: Pagination -->
		<Pagination
			{totalItems}
			{totalPages}
			{currentPage}
			link={'users/lists'}
			search={$page.url.searchParams.get('q') ? `?q=${$page.url.searchParams.get('q')}` : ''}
		/>
		<!-- END: Pagination -->

		<!-- BEGIN: Permission Modal -->
		<Dialog
			open={permissionConfirmationModal}
			on:close={() => {
				setPermissionConfirmationModal(false);
			}}
			initialFocus={permissionButtonRef}
		>
			<Dialog.Panel>
				<div class="p-5 text-center">
					<Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-danger" />
					<div class="mt-5 text-3xl">Sorry!</div>
					<div class="mt-2 text-slate-500">You don't have permission to edit this profile.</div>
				</div>
				<div class="px-5 pb-8 text-center">
					<Button
						variant="outline-secondary"
						type="button"
						on:click={() => {
							setPermissionConfirmationModal(false);
						}}
						class="w-24 mr-1"
					>
						Close
					</Button>
				</div>
			</Dialog.Panel>
		</Dialog>
		<!-- END: Permission Modal -->
	</div>
</div>
