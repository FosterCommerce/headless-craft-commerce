module.exports = {
  // Compiler mode
  mode: 'jit',
  // Locations of source files
  content: [
    './src/components/**/*.{vue,js}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/nuxt.config.{js,ts}',
  ],
  theme: {
    /* Centers containers by default. Saves us from writing a bunch of mx-auto everywhere. */
    container: {
      center: true,
    },
    /* NOTE: Values at the "Theme" level override the Tailwind default config completely, so use sparingly.  */
    screens: {
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      '2xl': '1240px',
      '3xl': '1500px',
      '4xl': '1680px',
    },
    extend: {
      /* NOTE: "Extend" the config here, rather than overriding it completely at the "Theme" level.
        Also, note that with JIT (Just In Time) mode set in Tailwind, there shouldn't be any real need
        to create one-off font sizes or spacing values as JIT mode allows for arbitrary styles using
        bracket syntax (ex: text-[1.875rem]). See the docs at: https://tailwindcss.com/docs/just-in-time-mode.
        So extending here, should only be done to include specific design tokens such as fonts and colors.
      * */
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  // If you want to generate extra variants for certain properties, they can be added here
  // See: https://v2.tailwindcss.com/docs/configuring-variants
  variants: {
    extend: {},
  },
  // Extra Tailwind plugins
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};
