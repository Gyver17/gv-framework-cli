import { AbstractAction } from './abstract';
import { GenerateInput } from '../interfaces';

export class GenerateAction extends AbstractAction {
	public async handle(input: GenerateInput) {
		console.log(input);
		//   await generateFiles(inputs.concat(options))
	}
}
