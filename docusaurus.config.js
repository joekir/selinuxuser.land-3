// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Security-Enhanced Linux education site',
  tagline: "Don't disable it, it's not as complex as you think!",
  url: 'https://selinuxuser.land',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: false,
  markdown: {
    mermaid: true
  },
  themes: ['@docusaurus/theme-mermaid'],

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'joekir', // Usually your GitHub org/user name.
  projectName: 'selinuxuser.land-3', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          breadcrumbs: true,
          sidebarCollapsed: true,
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'course/',
        },
        blog: {
          include: ['*.md'],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      require.resolve("@cmfcmf/docusaurus-search-local"),
      {
        indexDocs: true,
        indexBlog: false,
        language: 'en',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      announcementBar: {
        id: 'beta',
        content: "This is currently an alpha release and I'm looking for constructive feedback, please <a target='_blank' href='https://github.com/joekir/selinuxuser.land-3/issues'>file any issues on Github.</a>",
        backgroundColor: '#ffffff',
        textColor: '#2e4885',
        isCloseable: true,
      },
      image: 'img/logo.png',
      navbar: {
        // title: 'selinuxuser.land',
        logo: {
          alt: 'SELinux userland logo',
          src: 'img/logo.png',
          srcDark: 'img/logo-dark.png'
        },
        items: [
          {
            to: '/course/overview',
            position: 'left',
            label: 'Course',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/joekir/selinuxuser.land-3',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Buy me a coffee?',
            href: 'https://www.buymeacoffee.com/joekir',
            target: "_blank",
          },
          {
            label: 'Chat about the course on Mastodon',
            href: 'https://infosec.exchange/@joek',
            rel: 'me noopener noreferrer',
            target: "_blank",
          },
          {
            label: 'Found a bug or inaccuracy?',
            href: 'https://github.com/joekir/selinuxuser.land-3/issues',
            target: "_blank",
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      mermaid: {
        theme: {light: 'forest', dark: 'dark'},
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
