export const getFirstUnusedName = (
  usedNames: string[],
  name: string
): string => {
  if (!usedNames.includes(name)) {
    return name;
  }
  let index = 1;
  let newName = name;
  do {
    index++;
    newName = `${name} ${index}`;
  } while (usedNames.includes(newName));
  return newName;
};
