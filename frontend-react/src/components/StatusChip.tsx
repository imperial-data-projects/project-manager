import type { StatusChip as StatusChipType } from '@/types'

const styles: Record<StatusChipType['type'], string> = {
  awaiting: 'bg-warning-bg text-warning-text',
  blocked: 'bg-error-bg text-error-text',
  'not-started': 'bg-muted text-muted-foreground',
}

const dotStyles: Record<StatusChipType['type'], string> = {
  awaiting: 'bg-warning-base',
  blocked: 'bg-error-base',
  'not-started': 'bg-muted-foreground',
}

export function StatusChip({ chip }: { chip: StatusChipType }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide whitespace-nowrap ${styles[chip.type]}`}>
      <span className={`size-1.5 rounded-full ${dotStyles[chip.type]}`} />
      {chip.label}
    </span>
  )
}
