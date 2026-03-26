export function isNonNegativeInteger(value: any): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isNonEmptyString(value: any): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}
