import { GenerateInput } from '../../interfaces';

export abstract class AbstractAction {
	public abstract handle(
		inputs?: GenerateInput,
		extraFlags?: string[],
	): Promise<void>;
}
