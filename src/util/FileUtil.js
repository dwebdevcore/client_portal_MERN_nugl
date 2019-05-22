export const rename = (file, name) => {
  const ext = file.name.split(".").pop();
  const newName = `${name}.${ext}`.toLowerCase();
  const blob = file.slice(0, file.size, file.type);
  let newBlob = new Blob([blob], { type: file.type });
  newBlob.lastModifiedDate = new Date();
  newBlob.name = newName;
  return newBlob;
};
