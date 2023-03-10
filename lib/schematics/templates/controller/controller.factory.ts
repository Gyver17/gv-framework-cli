import { join, Path, strings } from '@angular-devkit/core';
import {
	apply,
	branchAndMerge,
	chain,
	filter,
	mergeWith,
	move,
	noop,
	Rule,
	SchematicContext,
	template,
	Tree,
	url,
} from '@angular-devkit/schematics';
import {
	normalizeToKebabCase,
	NameParser,
	Location,
	mergeSourceRoot,
} from '../../../utils';

import { DEFAULT_LANGUAGE } from '../../../constants';
import { ControllerOptions } from './controller.schema';

const ELEMENT_METADATA = 'controllers';
const ELEMENT_TYPE = 'controller';

export function main(options: ControllerOptions): Rule {
	options = transform(options);
	return (tree: Tree, context: SchematicContext) => {
		return branchAndMerge(
			chain([
				mergeSourceRoot(options),
				mergeWith(generate(options)),
				// addDeclarationToModule(options),
			]),
		)(tree, context);
	};
}

function transform(source: ControllerOptions): ControllerOptions {
	const target: ControllerOptions = Object.assign({}, source);
	target.metadata = ELEMENT_METADATA;
	target.type = ELEMENT_TYPE;

	const location: Location = new NameParser().parse(target);
	target.name = normalizeToKebabCase(location.name);
	target.path = normalizeToKebabCase(location.path);
	target.language =
		target.language !== undefined ? target.language : DEFAULT_LANGUAGE;

	target.specFileSuffix = normalizeToKebabCase(
		source.specFileSuffix || 'spec',
	);

	target.path = target.flat
		? target.path
		: join(target.path as Path, target.name);
	return target;
}

function generate(options: ControllerOptions) {
	return (context: SchematicContext) =>
		apply(url(join('./files' as Path, options.language)), [
			options.spec
				? noop()
				: filter((path) => {
						const languageExtension = options.language || 'ts';
						const suffix = `.__specFileSuffix__.${languageExtension}`;
						return !path.endsWith(suffix);
				  }),
			template({
				...strings,
				...options,
			}),
			move(options.path),
		])(context);
}

/* function addDeclarationToModule(options: ControllerOptions): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }
    options.module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });
    if (!options.module) {
      return tree;
    }
    const content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(
      options.module,
      declarator.declare(content, options as DeclarationOptions),
    );
    return tree;
  };
} */
