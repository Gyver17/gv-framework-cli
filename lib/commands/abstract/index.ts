import { Command, Option } from 'commander';
import { AbstractAction } from '../../actions/abstract';

export abstract class AbstractCommand {
  constructor(protected action: AbstractAction) {}

  public abstract load(program: Command): void;
}
