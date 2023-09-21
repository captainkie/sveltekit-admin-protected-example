import { dictionary, locale, _ } from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '$lin/i18n/locales/{locale}.json';

let cachedLocale;

async function setupI18n({ withLocale: _locale } = { withLocale: "en" }) {
  const messsagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace(
    "{locale}",
    _locale
  );

  const response = await fetch(messsagesFileUrl);
	const messages = await response.json();
	dictionary.set({ [_locale]: messages });
	cachedLocale = _locale;
	locale.set(cachedLocale);
}

export { _, locale, setupI18n };
