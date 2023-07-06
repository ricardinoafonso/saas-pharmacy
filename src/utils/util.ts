export function getPagination(
  page: number,
  size: number
): { skip: number; take: number } {
  const take = size ? +size : 0;
  let skip = page == 0 ? 0 : page * take;
  return { skip, take}
}
