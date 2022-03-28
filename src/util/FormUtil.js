export function extractFormData(form) {
  const formDataEntries = [...new FormData(form)];
  return formDataEntries.reduce((acc, [id, value]) => {
    acc[id] = value;
    return acc;
  }, {});
}

export function extractUrlEncodedFormData(form) {
  const result = extractFormData(form);
  return new URLSearchParams(result);
}
