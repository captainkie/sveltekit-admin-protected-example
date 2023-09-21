import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface DarkModeState {
	value: boolean;
}

const defaultValue = { value: false };
const initialValue = browser
	? { value: localStorage.getItem('darkMode') === 'true' } ?? defaultValue
	: defaultValue;

export const darkModeStore = writable<DarkModeState>(initialValue);

export const setDarkMode = () => {
	darkModeStore.update((value) => {
		return {
			value: !value.value
		};
	});

	darkModeStore.subscribe((value) => {
		if (browser) {
			const setTheme = value.value ? 'true' : 'false';
			window.localStorage.setItem('darkMode', setTheme);
		}
	});
};
