import { Answers, QuestionCollection } from 'inquirer';
import { GenerateAnswers } from '../interfaces';
import { ImplementQuestion } from './implement';
import { Collection } from '../schematics/collections/index';

export const generateQuestion: QuestionCollection<GenerateAnswers> = [
	{
		type: 'list',
		name: 'schematic',
		message: 'enter a schematic',
		choices: Collection.getSchematics(),
	},
	{
		type: 'input',
		name: 'name',
		message: 'enter a name',
		validate(input: string) {
			if (input === '') {
				return 'Name is required';
			}

			return true;
		},
	},
	{
		type: 'input',
		name: 'path',
		message: 'enter a path',
	},
];

export class GenerateQuestion implements ImplementQuestion {
	public getQuestions(): QuestionCollection {
		return [
			{
				type: 'list',
				name: 'schematic',
				message: 'enter a schematic',
				choices: Collection.getSchematics(),
			},
			{
				type: 'input',
				name: 'name',
				message: 'enter a name',
				validate(input) {
					if (input === '') {
						return 'Name is required';
					}

					return true;
				},
			},
			{
				type: 'input',
				name: 'path',
				message: 'enter a path',
			},
		];
	}
}
