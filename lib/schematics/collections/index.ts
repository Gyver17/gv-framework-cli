/* import { AbstractRunner } from '../runners';
import { AbstractCollection } from './abstract.collection';
import { SchematicOption } from './schematic.option'; */

// @Interfaces
import { Schematic } from '../../interfaces';

export class Collection {
	public static schematics: Schematic[] = [
		{
			name: 'resource',
			alias: 'res',
			description: 'Generate a new CRUD resource',
		},
		{
			name: 'controller',
			alias: 'co',
			description: 'Generate a controller declaration',
		},
		{
			name: 'service',
			alias: 's',
			description: 'Generate a service declaration',
		},
		{
			name: 'repository',
			alias: 'rep',
			description: 'Generate a repository declaration',
		},
		{
			name: 'middleware',
			alias: 'mi',
			description: 'Generate a middleware declaration',
		},
		{
			name: 'validator',
			alias: 'vld',
			description: 'Generate a validator declaration',
		},
	];

	public static getSchematics(): string[] {
		return this.schematics.map((item) => item.name);
	}

	public static validate(name: string) {
		const schematic = this.schematics.find(
			(s) => s.name === name || s.alias === name,
		);

		if (schematic === undefined || schematic === null) {
			throw new Error(
				`Invalid schematic "${name}". Please, ensure that "${name}" exists in this collection.`,
			);
		}
		return schematic.name;
	}
}
