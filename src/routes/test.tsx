import { createFileRoute } from '@tanstack/react-router'

function TestRouteComponent() {
  console.log('🎯 TEST ROUTE CALLED!')

  return (
    <div style={{ padding: '20px', backgroundColor: 'green', color: 'white' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>🎯 TEST ROUTE WORKING!</h1>
      <p style={{ fontSize: '18px' }}>
        If you can see this, TanStack Router routing is working correctly.
      </p>
      <p style={{ marginTop: '20px' }}>
        <a href="/passports" style={{ color: 'yellow', textDecoration: 'underline' }}>
          Go back to passports
        </a>
      </p>
    </div>
  )
}

export const Route = createFileRoute('/test')({
  component: TestRouteComponent,
})
