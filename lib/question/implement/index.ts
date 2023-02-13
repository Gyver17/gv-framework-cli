import { QuestionCollection } from 'inquirer';

export interface ImplementQuestion {
	getQuestions(): QuestionCollection;
}
