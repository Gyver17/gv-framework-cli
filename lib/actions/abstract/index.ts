import path from 'path';
import {
	NodeWorkflow,
	NodeWorkflowOptions,
} from '@angular-devkit/schematics/tools';
import {
	UnsuccessfulWorkflowExecution,
	formats,
} from '@angular-devkit/schematics';
import { schema, tags } from '@angular-devkit/core';
import chalk from 'chalk';

import { GenerateInput } from '../../interfaces';

interface Options {
	debug?: boolean;
	dryRun?: boolean;
	force?: boolean;
}

export abstract class AbstractAction {
	public abstract handle(
		inputs?: GenerateInput,
		extraFlags?: string[],
	): Promise<void>;

	execute(
		root: string,
		schematic: string,
		name: string,
		args: object,
		{ debug = false, dryRun = false, force = false }: Options,
	) {
		try {
			let error = false;
			let nothingDone = true;
			let allowPrivateSchematics = true;

			const options: NodeWorkflowOptions = {
				force,
				dryRun,
				packageManager: 'npm',
				resolvePaths: [__dirname, process.cwd(), root],
				registry: new schema.CoreSchemaRegistry(
					formats.standardFormats,
				),
				schemaValidation: true,
			};

			const workflow = new NodeWorkflow(root, options);

			workflow.registry.usePromptProvider(
				this.createPromptProvider(name),
			);

			const collection = workflow.engine.createCollection(
				path.join(
					__dirname,
					'..',
					'..',
					'schematics',
					'templates',
					'collection.json',
				),
			);

			const _schematic = collection.createSchematic(
				schematic,
				allowPrivateSchematics,
			);

			const collectionName = _schematic.collection.description.name;
			const schematicName = _schematic.description.name;

			const input = { ...args };
			let loggingQueue = [];

			workflow.reporter.subscribe((event) => {
				nothingDone = false;
				
				const eventPath = event.path.startsWith('/')
					? event.path.substr(1)
					: event.path;

				switch (event.kind) {
					case 'error':
						error = true;
						const desc =
							event.description == 'alreadyExist'
								? 'already exists'
								: 'does not exist.';
						// logger.warn(`ERROR! ${eventPath} ${desc}.`);
						console.log(`ERROR! ${eventPath} ${desc}.`);
						break;
					case 'update':
						loggingQueue.push(tags.oneLine`
					  ${chalk.cyan('UPDATE')} ${eventPath} (${event.content.length} bytes)
					`);
						break;
					case 'create':
						loggingQueue.push(tags.oneLine`
					  ${chalk.green('CREATE')} ${eventPath} (${event.content.length} bytes)
					`);
						break;
					case 'delete':
						loggingQueue.push(
							`${chalk.yellow('DELETE')} ${eventPath}`,
						);
						break;
					case 'rename':
						const eventToPath = event.to.startsWith('/')
							? event.to.substr(1)
							: event.to;
						loggingQueue.push(
							`${chalk.blue(
								'RENAME',
							)} ${eventPath} => ${eventToPath}`,
						);
						break;
				}
			});

			workflow.lifeCycle.subscribe((event) => {
				if (event.kind == 'end' || event.kind == 'post-tasks-start') {
					if (!error) {
						// Output the logging queue, no error happened.
						loggingQueue.forEach((log) => console.log(log));
					}

					loggingQueue = [];
					error = false;
				}
			});

			workflow
				.execute({
					collection: collectionName,
					schematic: schematicName,
					options: input,
					debug: debug,
					// logger: logger,
					allowPrivate: allowPrivateSchematics,
				})
				.subscribe({
					error: (err) => {
						// In case the workflow was not successful, show an appropriate error message.
						if (err instanceof UnsuccessfulWorkflowExecution) {
							// "See above" because we already printed the error.
							console.log(
								'The Schematic workflow failed. See above.',
							);
						} else if (debug) {
							console.log(
								`An error occured:\n${err.message}\n${err.stack}`,
							);
						} else {
							console.log(err.message);
						}
						// logger.complete();
					},
					complete: () => {
						if (nothingDone) {
							console.log('Nothing to be done.');
						}
						if (dryRun) {
							console.log(
								`The "dryRun" flag means no changes were made.`,
							);
						}
						// logger.complete();
					},
				});
		} catch (e) {
			console.log(e);
			// logger.fatal(e);
			// logger.complete();
		}
	}

	private createPromptProvider(name: string): schema.PromptProvider {
		return async () => {
			return { '/name': name };
		};
	}
}
