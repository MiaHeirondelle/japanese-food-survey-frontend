export function extractUrlEncodedFormData(form) {
  const formDataEntries = [...new FormData(form)];
  const result = formDataEntries.reduce((acc, [id, value]) => {
    acc[id] = value;
    return acc;
  }, {})
  console.log(result);
  return new URLSearchParams(result);
}