// this is used in tests to generate unique ids for mocked data.
// 1000 is enough to not collide with any existing ids in the mocked data
let id = 1000;

export function nextId() {
  return id++;
}
