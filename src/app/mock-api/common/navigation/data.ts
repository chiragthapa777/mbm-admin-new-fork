/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { PERMISSION_SUBJECT } from 'app/enums/permission.enum';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'apps.cave',
        title: 'Admin',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/admin',
        subject: [PERMISSION_SUBJECT.ADMIN],
    },
    {
        id: 'apps.cave',
        title: 'Manager',
        type: 'basic',
        icon: 'heroicons_outline:user-group',
        link: '/manager',
        subject: [PERMISSION_SUBJECT.MANAGER],
    },
    {
        id: 'apps.commerce',
        title: 'Buildings',
        type: 'basic',
        icon: 'heroicons_outline:document-search',
        link: '/building',
        subject: [PERMISSION_SUBJECT.BUILDING],
    },
    {
        id: 'apps.commerce',
        title: 'Buildings Docs',
        type: 'basic',
        icon: 'heroicons_outline:document-report',
        link: '/bdocs',
        subject: [PERMISSION_SUBJECT.BUILDING_DOC],
    },
    {
        id: 'apps.commerce',
        title: 'Buildings Notifications',
        type: 'basic',
        icon: 'heroicons_outline:bell',
        link: '/notification',
        subject: [PERMISSION_SUBJECT.NOTIFICATION],
    },

    {
        id: 'apps.commerce',
        title: 'Payment Logs',
        type: 'basic',
        icon: 'heroicons_outline:credit-card',
        link: '/payment',
        subject: [PERMISSION_SUBJECT.PAYMENT],
    },
    {
        id: 'dashboards.project',
        title: 'Ticket Pending',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-check',
        link: '/ticket0',
        subject: [PERMISSION_SUBJECT.TICKET],
    },
    {
        id: 'dashboards.analytics',
        title: 'Ticket Completed',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/ticket1',
        subject: [PERMISSION_SUBJECT.TICKET],
    },

    {
        id: 'example',
        title: 'Users',
        type: 'basic',
        icon: 'heroicons_outline:users',
        link: '/user',
        subject: [PERMISSION_SUBJECT.USER],
    },
    {
        id: 'example',
        title: 'Users Docs',
        type: 'basic',
        icon: 'heroicons_outline:document-report',
        link: '/udocs',
        subject: [PERMISSION_SUBJECT.USER_DOC],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
