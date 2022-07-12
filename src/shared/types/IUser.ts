export interface IUser {
  id: number;
  account_id: number;
  username: string | false;
  vk_id: number | false;
  role: 'usr' | 'mod' | 'edt' | 'adm' | 'sus';
}
