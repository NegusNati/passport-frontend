import { TanstackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { AppShell } from '@/app/layout/AppShell'
import { AppErrorBoundary } from '@/features/misc/components/AppErrorBoundary'
import { NotFound } from '@/features/misc/components/NotFound'

export const Route = createRootRoute({
  notFoundComponent: () => <NotFound />,
  component: () => (
    <AppErrorBoundary>
      <AppShell>
        <Outlet />
      </AppShell>
      {import.meta.env.DEV ? (
        <TanstackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      ) : null}
    </AppErrorBoundary>
  ),
})

