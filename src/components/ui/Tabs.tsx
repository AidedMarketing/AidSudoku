import { NavLink } from 'react-router-dom'

interface Tab {
  to: string
  label: string
  icon: string  // emoji or SVG path
}

const TABS: Tab[] = [
  { to: '/',         label: 'Home',     icon: '⊞' },
  { to: '/daily',    label: 'Daily',    icon: '📅' },
  { to: '/passport', label: 'Passport', icon: '🗺' },
  { to: '/stats',    label: 'Stats',    icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export function Tabs() {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
              isActive
                ? 'text-accent'
                : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
