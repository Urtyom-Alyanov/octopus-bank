export const getMaxValue = (max: number = 32, fieldName?: string) => {
  return {
    value: max,
    message: `В ${fieldName || "данном поле"} не может быть более 32 символов`,
  };
};
