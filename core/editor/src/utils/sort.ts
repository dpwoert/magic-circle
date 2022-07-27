export default function sortHelper(
  key: string,
  after?: string | string[],
  before?: string | string[]
) {
  if (after) {
    if (Array.isArray(after) && after.includes(key)) {
      return 1;
    }
    if (!Array.isArray(after) && after === key) {
      return 1;
    }
  }

  if (before) {
    if (Array.isArray(before) && before.includes(key)) {
      return -1;
    }
    if (!Array.isArray(before) && before === key) {
      return -1;
    }
  }

  return 0;
}
