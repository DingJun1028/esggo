'use client';

import React from 'react';
import { getMatrixComponents, MATRIX_ROUTES } from '@/lib/omni-core/matrix-store';
import { MATRIX_ROUTE_COMPONENTS } from '@/lib/omni-core/matrix-component-registry';

export const MatrixDashboard: React.FC = () => {
  const [components, setComponents] = React.useState<any[]>([]);
  const [isLoading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getMatrixComponents()
      .then(setComponents)
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    'Perception',
    'Command',
    'Omniscience',
    'Global',
    'Hologram',
    'Atoms',
  ] as const;

  const getRouteComponent = (route: string) => {
    return MATRIX_ROUTE_COMPONENTS.find((rc) => rc.route === route);
  };

  if (isLoading) return <div>Loading matrix...</div>;

  return (
    <div className="p-6">
      <h1 className="text-heading-lg mb-6">Omni Matrix Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <section key={category} className="bg-theme-surface-glass rounded-lg p-4">
            <h2 className="text-body-lg font-semibold mb-3 capitalize">{category}</h2>
            <ul className="space-y-2">
              {MATRIX_ROUTES.filter((r) => {
                const rc = getRouteComponent(r);
                return rc?.category === category;
              }).map((route) => (
                <li key={route} className="text-caption hover:text-theme-primary">
                  <a href={route} className="block py-1">
                    {route === '/' ? 'Home' : route.substring(1).replace(/-/g, ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="mt-8 text-caption text-theme-muted">
        Total Routes: {MATRIX_ROUTES.length} | Active Components: {components?.length || 0}
      </div>
    </div>
  );
};
