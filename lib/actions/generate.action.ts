import { AbstractAction } from './abstract';
import { GenerateInput } from '../interfaces';

export class GenerateAction extends AbstractAction {
	public async handle(inputs: GenerateInput) {
		//   await generateFiles(inputs.concat(options))
	}
}
