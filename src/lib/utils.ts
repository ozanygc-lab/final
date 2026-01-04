// Version simplifiée sans clsx et tailwind-merge
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ')
}
