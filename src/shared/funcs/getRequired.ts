export const getRequired = (required = true, fieldName?: string) => {
  return {
    value: required,
    message: `Требуется ${fieldName || "данное поле"}`,
  };
};
