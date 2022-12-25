/** @type {import('next').NextConfig */
const withPWA = require('next-pwa')({
	dest: 'public',
})
module.exports = withPWA({
	compiler: {
		styledComponents: true,
	},
	i18n: {
		locales: ["en"],
		defaultLocale: "en",
	},
})