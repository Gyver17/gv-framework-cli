// @Libraries
import { Command } from 'commander';
import inquirer from 'inquirer';

// @Command
import { AbstractCommand } from './abstract';

// @Utils
import { generateQuestion } from '../utils/question-collection';

// @Interfaces
import { GenerateAnswers, GenerateInput } from '../interfaces';

export class GenerateCommand extends AbstractCommand {
	public async load(program: Command): Promise<void> {
		program
			.command('generate [schematic] [name] [path]')
			.alias('g')
			.description('generate command')
			.action(
				async (schematic?: string, name?: string, path?: string) => {
					let input: GenerateInput | null = null;
					if (schematic) {
						if (!name)
							throw new Error('argument name is not defined');
						input = {
							schematic,
							name,
							path: this.pathDefault(path || ''),
						};
					} else {
						const answer = await inquirer.prompt<GenerateAnswers>(
							generateQuestion,
						);
						input = {
							schematic: answer.schematic,
							name: answer.name,
							path: this.pathDefault(answer.path),
						};
					}
					if (!input) throw new Error();

					console.log(input);
				},
			);
	}

	private pathDefault(path: string) {
		if (path === '') {
			return '/';
		} else {
			return path;
		}
	}
}
