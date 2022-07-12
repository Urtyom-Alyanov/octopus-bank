import { Role } from '@/modules/user/user.entity';

export function getRoleString(
  role: Role,
): 'usr' | 'mod' | 'edt' | 'adm' | 'sus' {
  return role === Role.User
    ? 'usr'
    : role === Role.Moderator
    ? 'mod'
    : role === Role.Editor
    ? 'edt'
    : role === Role.Administrator
    ? 'adm'
    : role === Role.SuperUser
    ? 'sus'
    : null;
}
