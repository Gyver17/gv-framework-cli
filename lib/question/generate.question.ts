import { Answers, QuestionCollection } from 'inquirer';
import { GenerateAnswers } from '../interfaces';
import { ImplementQuestion } from './implement';
import { Collection } from '../schematics/collections/index';
import {QUESTIONS} from '../ui'

export const generateQuestion: QuestionCollection<GenerateAnswers> = [
	{
		type: 'list',
		name: 'schematic',
		message: QUESTIONS.SCHEMATIC,
		choices: Collection.getSchematics(),
	},
	{
		type: 'input',
		name: 'name',
		message: QUESTIONS.NAME,
		validate(input: string) {
			if (input === '') {
				return QUESTIONS.NAME_REQUIRED;
			}

			return true;
		},
	},
	{
		type: 'input',
		name: 'path',
		message: QUESTIONS.PATH,
		suffix: ' (/)'
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
