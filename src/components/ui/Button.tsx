import { type ReactNode, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = gold (the one action that matters); secondary = quiet paper; glass = floats over chrome;
   *  ghost = text only; danger = destructive. */
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:   'bg-aha text-[#1A1200] shadow-glow active:brightness-95',
  secondary: 'bg-paper-2 border border-line text-ink active:bg-line/60',
  glass:     'glass text-ink',
  ghost:     'bg-transparent text-ink-2 active:bg-line/60',
  danger:    'bg-signal text-white active:opacity-80',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-6 text-base',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none transition-[transform,filter,background-color] active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
