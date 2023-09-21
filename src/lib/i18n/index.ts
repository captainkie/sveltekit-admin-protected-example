import { init, register } from 'svelte-i18n'

const defaultLocale = 'th'

register('en', () => import('$lib/i18n/locales/en.json'))
register('th', () => import('$lib/i18n/locales/th.json'))

init({
	fallbackLocale: defaultLocale,
	initialLocale: defaultLocale,
})