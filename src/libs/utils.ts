export function isString(str: any): boolean {
  return typeof str === 'string';
}

export function isValidNonEmptyString(str: any): boolean {
  return isString(str) && str.length > 0;
}

export function isValidNonEmptyArray(arr: any): boolean {
  return Array.isArray(arr) && arr.length > 0;
}
