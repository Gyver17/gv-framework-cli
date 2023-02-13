// @Libraries
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table3';

// @Command
import { AbstractCommand } from './abstract';

// @Utils
import { normalizeToKebabCase } from '../utils';

// @Questions
import { generateQuestion } from '../question';

// @Interfaces
import { GenerateAnswers, GenerateInput, Schematic } from '../interfaces';

// @Collections
import { Collection } from '../schematics/collections';

export class GenerateCommand extends AbstractCommand {
	public async load(program: Command): Promise<void> {
		program
			.command('generate [schematic] [name] [path]')
			.alias('g')
			.description(await this.buildDescription())
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

					Collection.validate(input.schematic);
					input.name = normalizeToKebabCase(input.name);

					await this.action.handle(input);
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

	private async buildDescription() {
		return (
			'Generate a Gv element.\n' +
			`  ${chalk.bold('schemes available:')}\n` +
			this.buildSchematicsListAsTable(Collection.schematics)
		);
	}

	private buildSchematicsListAsTable(schematics: Schematic[]): string {
		const leftMargin = '    ';
		const tableConfig = {
			head: ['name', 'alias', 'description'],
			chars: {
				left: leftMargin.concat('│'),
				'top-left': leftMargin.concat('┌'),
				'bottom-left': leftMargin.concat('└'),
				mid: '',
				'left-mid': '',
				'mid-mid': '',
				'right-mid': '',
			},
		};
		const table: any = new Table(tableConfig);
		for (const schematic of schematics) {
			table.push([
				chalk.green(schematic.name),
				chalk.cyan(schematic.alias),
				schematic.description,
			]);
		}
		return table.toString();
	}
}
