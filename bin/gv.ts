import { program } from 'commander';
import { version } from '../package.json';
import { CommandLoader } from '../lib/commands';
import {
	loadLocalBinCommandLoader,
	localBinExists,
} from '../lib/utils/local-binaries';

async function bootstrap() {
	program
		.version(version, '-v, --version', 'Output the current version.')
		.usage('<command> [options]')
		.helpOption('-h, --help', 'Output usage information.');

	if (localBinExists()) {
		const localCommandLoader = loadLocalBinCommandLoader();
		await localCommandLoader.load(program);
	} else {
		await CommandLoader.load(program);
	}

	program.parseAsync(process.argv);

	if (!process.argv.slice(2).length) {
		program.outputHelp();
	}
}

bootstrap();
