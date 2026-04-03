import type { DomainId, Templates } from '@/types'

const badgeStyles: Record<string, string> = {
  ocean: 'bg-domain-ocean/10 text-domain-ocean',
  indigo: 'bg-domain-indigo/10 text-domain-indigo',
  amethyst: 'bg-domain-amethyst/10 text-domain-amethyst',
  rose: 'bg-domain-rose/10 text-domain-rose',
  umber: 'bg-domain-umber/10 text-domain-umber',
  slate: 'bg-domain-slate/10 text-domain-slate',
}

export function DomainBadge({ domainId, templates }: { domainId: DomainId; templates: Templates }) {
  const domain = templates.domains[domainId]
  const color = domain.color
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap ${badgeStyles[color]}`}>
      {domain.label}
    </span>
  )
}
