export const getPattern = (fieldName?: string) => {
  return {
    value: /^[a-zA-Z1-9_\-.]+$/,
    message: `${
      fieldName || "Данное поле"
    } может иметь только лaтинские буквы, а так же цифры и символы - _ .`,
  };
};
