import { Role } from '@/modules/user/user.entity';

export function getRoleLevel(role: Role) {
  return role === Role.User
    ? 1
    : role === Role.Moderator
    ? 2
    : role === Role.Editor
    ? 3
    : role === Role.Administrator
    ? 4
    : role === Role.SuperUser
    ? 5
    : 0;
}
