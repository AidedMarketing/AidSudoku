import { NavLink } from 'react-router-dom'

interface Tab {
  to: string
  label: string
}

const TABS: Tab[] = [
  { to: '/',         label: 'Home'     },
  { to: '/daily',    label: 'Daily'    },
  { to: '/passport', label: 'Passport' },
  { to: '/stats',    label: 'Stats'    },
  { to: '/settings', label: 'Settings' },
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
            `flex-1 flex items-center justify-center py-3 min-h-[44px] text-[11px] font-semibold tracking-wide transition-colors ${
              isActive
                ? 'text-accent'
                : 'text-gray-400 dark:text-gray-500'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
