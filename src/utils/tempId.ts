let currentTempId = -1;

export function getTempId() {
  return currentTempId--;
}
