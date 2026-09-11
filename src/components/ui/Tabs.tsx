import { NavLink } from 'react-router-dom'
import type { ComponentType } from 'react'
import { HomeIcon, CalendarIcon, LearnIcon, PassportIcon, StatsIcon, SettingsIcon } from './icons'

interface Tab {
  to: string
  label: string
  Icon: ComponentType<{ className?: string }>
}

const TABS: Tab[] = [
  { to: '/',         label: 'Home',     Icon: HomeIcon     },
  { to: '/daily',    label: 'Daily',    Icon: CalendarIcon },
  { to: '/learn',    label: 'Learn',    Icon: LearnIcon    },
  { to: '/passport', label: 'Passport', Icon: PassportIcon },
  { to: '/stats',    label: 'Stats',    Icon: StatsIcon    },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
]

/**
 * The floating glass tab capsule. Inset from the edges (never edge-to-edge), sits above the
 * home indicator, and stays inside the app's max-w-md shell on wide screens.
 */
export function Tabs() {
  return (
    <nav
      aria-label="Main"
      className="glass fixed left-1/2 -translate-x-1/2 z-40 h-[62px] w-[calc(100%-2rem)] max-w-[calc(28rem-2rem)] rounded-full grid grid-cols-6 items-center px-1.5"
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
    >
      {TABS.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center gap-0.5 h-full rounded-full text-[10px] font-semibold tracking-wide transition-colors ${
              isActive ? 'text-ink' : 'text-ink-3'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="w-5 h-5" />
              <span>{label}</span>
              {/* Active marker: a gold dot, so the state never rides on color alone */}
              <span
                aria-hidden="true"
                className={`absolute -bottom-0.5 w-1 h-1 rounded-full bg-aha transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
