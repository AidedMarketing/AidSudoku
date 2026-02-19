import { type ReactNode, type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const variantClasses: Record<NonNullable<Props['variant']>, string> = {
  primary:   'bg-accent text-white active:bg-accent-dim',
  secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white active:bg-gray-200 dark:active:bg-gray-700',
  ghost:     'bg-transparent text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800',
  danger:    'bg-error text-white active:opacity-80',
}

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2.5 text-base rounded-xl',
  lg: 'px-6 py-3.5 text-lg rounded-2xl',
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  return (
    <button
      className={`font-medium transition-opacity disabled:opacity-40 select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
