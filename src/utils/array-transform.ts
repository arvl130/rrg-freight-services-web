export function chunkArray<T>(items: T[], chunkSize: number) {
  return items.reduce((acc, _, i) => {
    if (i % chunkSize === 0) acc.push(items.slice(i, i + chunkSize))
    return acc
  }, [] as T[][])
}
