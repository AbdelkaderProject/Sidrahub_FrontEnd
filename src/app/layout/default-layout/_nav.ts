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
      name: 'Orders',
      url: '/orders',
      iconComponent: { name: 'cil-task' }
    },
    {
      name: 'Consultations',
      url: '/consultations',
      iconComponent: { name: 'cil-chat-bubble' }
    },
    {
      name: 'Providers',
      url: '/providers',
      iconComponent: { name: 'cil-people' }
    },
    {
      name: 'Blog',
      url: '/blog',
      iconComponent: { name: 'cil-notes' }
    }
  ];

  if (isAdmin) {
    items.push({
      title: true,
      name: 'Management'
    });
    items.push({
      name: 'Admin Panel',
      url: '/admin',
      iconComponent: { name: 'cil-settings' }
    });
  }

  items.push({
    name: 'Logout',
    url: '/logout',
    iconComponent: { name: 'cil-account-logout' }
  });

  return items;
}
