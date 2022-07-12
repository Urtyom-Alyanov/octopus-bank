import { FindOptionsWhere } from 'typeorm';

export const getPaginatedResponseFromDB = (limit: number, page: number) => ({
  take: limit,
  skip: (page - 1) * limit,
});

export function getPaginatedResponseFromDBBy<Entity extends {}>(
  where: FindOptionsWhere<Entity>,
  limit: number,
  page: number,
) {
  return {
    ...getPaginatedResponseFromDB(limit, page),
    where,
  };
}
