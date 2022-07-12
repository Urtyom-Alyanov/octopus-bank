import { ManyOpts } from './Opts';

export class WithManyOpts<ObjectT extends {}> {
  opts: ManyOpts;
  items: ObjectT[];
}
