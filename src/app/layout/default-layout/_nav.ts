import { INavData } from '@coreui/angular';

export function buildNavItems(isAdmin: boolean): INavData[] {
  const items: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      iconComponent: { name: 'cil-speedometer' }
    },
    {
      title: true,
      name: 'Core Services'
    },
    {
      name: 'Services',
      url: '/services',
      iconComponent: { name: 'cil-layers' }
    },
    {
      name: 'Service Categories',
      url: '/service-categories',
      iconComponent: { name: 'cil-tags' }
    },
    {
      name: 'Service Packages',
      url: '/service-packages',
      iconComponent: { name: 'cil-briefcase' }
    },
    {
      name: 'Articles',
      url: '/articles',
      iconComponent: { name: 'cil-description' }
    },
    {
      name: 'Article Comments',
      url: '/article-comments',
      iconComponent: { name: 'cil-comment-square' }
    },
    
    {
      name: 'Sidebars',
      url: '/sidebars',
      iconComponent: { name: 'cil-menu' }
    },
    {
      name: 'Company Profiles',
      url: '/company-profiles',
      iconComponent: { name: 'cil-building' }
    },
    {
      name: 'Team Members',
      url: '/team-members',
      iconComponent: { name: 'cil-user' }
    },
    {
      name: 'Partners',
      url: '/partners',
      iconComponent: { name: 'cil-handshake' }
    },
    {
      name: 'Branches',
      url: '/branches',
      iconComponent: { name: 'cil-location-pin' }
    }
  ];

  if (isAdmin) {
    items.push({
      title: true,
      name: 'Management'
    });
    items.push({
      name: 'Admin APIs',
      url: '/admin/articles',
      iconComponent: { name: 'cil-settings' },
      children: [
        { name: 'ArticleComments', url: '/admin/article-comments' },
        { name: 'Articles', url: '/admin/articles' },
        { name: 'Auth', url: '/admin/auth' },
        { name: 'CompanyProfiles', url: '/admin/company-profiles' },
        { name: 'Localization', url: '/admin/localization' },
        { name: 'ServiceCategories', url: '/admin/service-categories' },
        { name: 'ServicePackages', url: '/admin/service-packages' },
        { name: 'Services', url: '/admin/services' },
        { name: 'Setup', url: '/admin/setup' },
        { name: 'Sidebars', url: '/admin/sidebars' },
        { name: 'TeamMembers', url: '/admin/team-members' },
        { name: 'Partners', url: '/admin/partners' },
        { name: 'Branches', url: '/admin/branches' }
      ]
    });
  }

  items.push({
    name: 'Logout',
    url: '/logout',
    iconComponent: { name: 'cil-account-logout' }
  });

  return items;
}
