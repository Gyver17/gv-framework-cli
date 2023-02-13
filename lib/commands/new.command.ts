import { Command } from 'commander';
import { AbstractCommand } from './abstract';

export class NewCommand extends AbstractCommand {
	public async load(program: Command): Promise<void> {
		console.log('new command');
	}
}