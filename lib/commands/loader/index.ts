// @Libraries
import { Command } from 'commander';
import chalk from 'chalk';

// @Commands
import { GenerateCommand } from '../generate.command';

// @Actions
import { GenerateAction } from '../../actions';

// @Lib
import { ERROR_PREFIX } from '../../ui';

export class CommandLoader {
	public static async load(program: Command): Promise<void> {
		await new GenerateCommand(new GenerateAction()).load(program);

		this.handleInvalidCommand(program);
	}

	private static handleInvalidCommand(program: Command) {
		program.on('command:*', () => {
			console.error(
				`\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
				program.args.join(' '),
			);
			console.log(
				`See ${chalk.red(
					'--help',
				)} for a list of available commands.\n`,
			);
			process.exit(1);
		});
	}
}
