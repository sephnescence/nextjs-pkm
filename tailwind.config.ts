import type { Config } from 'tailwindcss'

// For now instead of using the `safelist` option, use the CDN version of Tailwind CSS
// <script src="https://cdn.tailwindcss.com"></script>

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
