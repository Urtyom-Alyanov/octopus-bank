export const getImagePath = ({ id, size }: { id?: number; size?: number }) => {
  return id ? `/api/image/${id}?size=${size}` : null;
};
