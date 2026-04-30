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
      name: 'Sidebars',
      url: '/sidebars',
      iconComponent: { name: 'cil-menu' }
    },

    {
      name: 'Services',
      url: '/service-categories',
      iconComponent: { name: 'cil-tags' },
      children: [
        {
          name: 'Categories',
          url: '/service-categories'
        },
        {
          name: 'Services',
          url: '/services'
        }
      ]
    },
    {
      name: 'Articles',
      url: '/admin/articles',
      iconComponent: { name: 'cil-description' },
      children: [
        {
          name: 'Articles',
          url: '/admin/articles'
        },
        {
          name: 'Article Comments',
          url: '/admin/article-comments'
        }
      ]
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
    },
     {
      name: 'Company Profiles',
      url: '/company-profiles',
      iconComponent: { name: 'cil-building' }
    },
  ];


  items.push({
    name: 'Logout',
    url: '/logout',
    iconComponent: { name: 'cil-account-logout' }
  });

  return items;
}
