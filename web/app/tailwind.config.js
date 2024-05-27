const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');
const svgToDataUri = require('mini-svg-data-uri');
const uiConfig = require('./ui.config.js');
const deepMerge = require('deepmerge');
const headlessuiPlugin = require('@headlessui/tailwindcss');

module.exports = uiConfig(deepMerge(
  {
    content: [
      './components/**/*.tsx',
      './pages/**/*.tsx',
      './_blog/*.mdx',
      './utils/**/*.ts',
      './node_modules/@supabase/ui/dist/config/default-theme.js',
      './styles/**/*.css',
      './src/**/*.{js,jsx,ts,tsx}', // Added from the new config
    ],
    // darkMode: 'class', // Removed dark mode setting
    theme: {
      borderColor: (theme) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.scale.600', 'currentColor'),
      }),
      divideColor: (theme) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.scale.200', 'currentColor'),
      }),
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.5rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '2rem' }],
        xl: ['1.25rem', { lineHeight: '2rem' }],
        '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['4rem', { lineHeight: '1' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      extend: {
        borderRadius: {
          '4xl': '2rem',
          '5xl': '2.5rem',
        },
        fontFamily: {
          sans: 'var(--font-inter)',
          display: 'var(--font-dm-sans)',
        },
        maxWidth: {
          '2xl': '40rem',
        },
        typography: ({ theme }) => ({
          DEFAULT: {
            css: {
              'code::before': {
                content: '""',
              },
              'code::after': {
                content: '""',
              },
              '--tw-prose-body': theme('colors.scale[1100]'),
              '--tw-prose-headings': theme('colors.scale[1200]'),
              '--tw-prose-lead': theme('colors.scale[1100]'),
              '--tw-prose-links': theme('colors.brand[900]'),
              '--tw-prose-bold': theme('colors.scale[1100]'),
              '--tw-prose-counters': theme('colors.scale[1100]'),
              '--tw-prose-bullets': theme('colors.scale[900]'),
              '--tw-prose-hr': theme('colors.scale[500]'),
              '--tw-prose-quotes': theme('colors.scale[1100]'),
              '--tw-prose-quote-borders': theme('colors.scale[500]'),
              '--tw-prose-captions': theme('colors.scale[700]'),
              '--tw-prose-code': theme('colors.scale[1200]'),
              '--tw-prose-pre-code': theme('colors.scale[900]'),
              '--tw-prose-pre-bg': theme('colors.scale[400]'),
              '--tw-prose-th-borders': theme('colors.scale[500]'),
              '--tw-prose-td-borders': theme('colors.scale[200]'),
              '--tw-prose-invert-body': theme('colors.scale[200]'),
              '--tw-prose-invert-headings': theme('colors.white'),
              '--tw-prose-invert-lead': theme('colors.scale[500]'),
              '--tw-prose-invert-links': theme('colors.white'),
              '--tw-prose-invert-bold': theme('colors.white'),
              '--tw-prose-invert-counters': theme('colors.scale[400]'),
              '--tw-prose-invert-bullets': theme('colors.scale[600]'),
              '--tw-prose-invert-hr': theme('colors.scale[700]'),
              '--tw-prose-invert-quotes': theme('colors.scale[100]'),
              '--tw-prose-invert-quote-borders': theme('colors.scale[700]'),
              '--tw-prose-invert-captions': theme('colors.scale[400]'),
              'h1, h2, h3, h4, h5': {
                fontWeight: '400',
              },
              h2: {
                fontWeight: '400',
              },
              p: {
                fontWeight: '400',
              },
              a: {
                fontWeight: '400',
              },
              pre: {
                background: 'none',
                padding: 0,
                marginBottom: '32px',
              },
              'p img': {
                border: '1px solid var(--colors-scale4)',
                borderRadius: '4px',
                overflow: 'hidden',
              },
            },
          },
          toc: {
            css: {
              ul: {
                'list-style-type': 'none',
                'padding-left': 0,
                margin: 0,
                li: {
                  'padding-left': 0,
                },
                a: {
                  display: 'block',
                  'text-decoration': 'none',
                  fontSize: '0.8rem',
                  fontWeight: '200',
                  color: theme('colors.scale[1100]'),
                  '&:hover': {
                    color: theme('colors.scale[1200]'),
                  },
                  'font-weight': '400',
                },
                ul: {
                  'list-style-type': 'none',
                  li: {
                    marginTop: '0.2rem',
                    marginBottom: '0.2rem',
                    'padding-left': '0 !important',
                    'margin-left': '0.5rem',
                  },
                  a: {
                    fontWeight: '200',
                    color: theme('colors.scale[1000]'),
                    '&:hover': {
                      color: theme('colors.scale[1200]'),
                    },
                  },
                },
              },
            },
          },
        }),
        backgroundImage: (theme) => ({
          squiggle: `url("${svgToDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 3" enable-background="new 0 0 6 3" width="6" height="3" fill="${theme(
              'colors.yellow.400'
            )}"><polygon points="5.5,0 2.5,3 1.1,3 4.1,0"/><polygon points="4,0 6,2 6,0.6 5.4,0"/><polygon points="0,2 1,3 2.4,3 0,0.6"/></svg>`
          )}")`,
        }),
        keyframes: {
          'flash-code': {
            '0%': { backgroundColor: 'rgba(63, 207, 142, 0.1)' },
            '100%': { backgroundColor: 'transparent' },
          },
        },
        animation: {
          'flash-code': 'flash-code 1s forwards',
          'flash-code-slow': 'flash-code 2s forwards',
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      headlessuiPlugin,
      addVariablesForColors,
    ],
  },
  uiConfig
));

function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ':root': newVars,
  });
}