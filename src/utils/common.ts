export function generateNumberArray(length: number): Array<number> {
  return Array.from({ length }, (_, index) => index);
}

export function getNameWithDepth(name: string, depth: number): string {
  return (
    generateNumberArray(depth)
      .map(() => '—')
      .join(' ') +
    ' ' +
    name
  );
}
