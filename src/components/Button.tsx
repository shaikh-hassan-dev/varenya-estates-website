import type { Link } from '../content/content'

const variants = {
  primary: 'primary-button text-primary-cta-text',
  secondary: 'secondary-button text-secondary-cta-text',
}

export function Button({ label, target, variant = 'primary' }: Link & { variant?: keyof typeof variants }) {
  return (
    <a
      href={target}
      className={`flex items-center justify-center h-10 px-6 text-sm rounded cursor-pointer ${variants[variant]}`}
    >
      {label}
    </a>
  )
}
