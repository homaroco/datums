import { Nunito } from '@next/font/google'

import '../styles/globals.css'

const nunito = Nunito({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap',
	fallback: ['Helvetica', 'sans-serif'],
})

export default function App({ Component, pageProps }) {
	return (
		<>
			<style jsx global>{`
				html {
					font-family: ${nunito.style.fontFamily};
				}
			`}</style>
			<Component {...pageProps} />
		</>
	)
}