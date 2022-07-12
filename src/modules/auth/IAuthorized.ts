import { Gov } from '../gov/gov.entity';
import { Organization } from '../org/org.entity';
import { User } from '../user/user.entity';
import { Token } from './token/token.entity';

export interface IAuthorized extends Token {
  Related: User | Organization | Gov;
}
