'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Product', link: '/dashboard/product' }
  ],
  '/dashboard/assets': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Assets', link: '/dashboard/assets' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    
    // Special handling for reports with dynamic ID
    if (segments[0] === 'dashboard' && segments[1] === 'reports' && segments.length === 3) {
      // For /dashboard/reports/[id] - try to get report title from page metadata
      const reportTitle = typeof window !== 'undefined' 
        ? document.querySelector('h1')?.textContent || segments[2]
        : segments[2];
      
      return [
        { title: 'Dashboard', link: '/dashboard' },
        { title: 'Reports', link: '/dashboard/reports' },
        { title: reportTitle, link: pathname }
      ];
    }
    
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
