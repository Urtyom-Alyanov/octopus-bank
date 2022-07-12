export const getMinValue = (min: 6, fieldName?: string) => {
  return {
    value: min,
    message: `В ${fieldName || "данном поле"} не может быть менее 6 символов`,
  };
};
