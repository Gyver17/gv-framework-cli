import path from 'path';
import { AbstractAction } from './abstract';
import { GenerateInput } from '../interfaces';

export class GenerateAction extends AbstractAction {
	public async handle(input: GenerateInput) {
		this.execute(
			path.join('src', input.path),
			input.schematic,
			input.name,
			{},
			{ ...input.options },
		);
	}
}
