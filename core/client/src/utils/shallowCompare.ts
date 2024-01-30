export default function shallowEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>
) {
  return [...Object.keys(a), ...Object.keys(b)].every((k) => b[k] === a[k]);
}
