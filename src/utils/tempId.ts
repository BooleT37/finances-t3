let currentTempId = -1;

export function getTempId() {
  return currentTempId--;
}

export function isTempId(id: number) {
  return id < 0;
}
