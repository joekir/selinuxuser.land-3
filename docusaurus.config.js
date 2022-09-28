// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Security Enhanced Linux education site',
  tagline: "Don't disable it, it's actually really powerful!",
  url: 'https://selinuxuser.land',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

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
          remarkPlugins: [
            require('mdx-mermaid'),
          ]
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
        content: "This is currently a beta release and I'm looking for constructive feedback, please <a target='_blank' href='https://github.com/joekir/selinuxuser.land/issues'>file any issues on Github.</a>",
        backgroundColor: '#ffffff',
        textColor: '#2e4885',
        isCloseable: true,
      },
      image: 'img/logo.png',
      navbar: {
        // title: 'selinuxuser.land',
        logo: {
          alt: 'SE Linux userland logo',
          src: 'img/logo.png',
          srcDark: 'img/logo-dark.png'
        },
        items: [
          {
            to: '/course/category/foundational-concepts-and-policy-building-blocks',
            position: 'left',
            label: 'Course',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/joekir/selinuxuser.land',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            label: 'Buy Me a Coffee',
            href: 'https://www.buymeacoffee.com/joekir',
          },
          {
            label: 'Twitter',
            href: 'https://twitter.com/josephkirwin',
          },
          {
            label: 'Found a bug or inaccuracy?',
            href: 'https://github.com/joekir/selinuxuser.land/issues',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),
};

module.exports = config;
