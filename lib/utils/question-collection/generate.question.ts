import { QuestionCollection } from 'inquirer';
import { GenerateAnswers } from '../../interfaces';

export const generateQuestion: QuestionCollection<GenerateAnswers> = [
	{
		type: 'list',
		name: 'schematic',
		message: 'enter a schematic',
		choices: [
			'resource',
			'middleware',
			'validator',
			'controller',
			'service',
			'repository',
		],
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
