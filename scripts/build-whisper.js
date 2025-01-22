const shell = require('shelljs');
const path = require('path');
const { platform } = require('os');

const PLATFORM = platform();
const WHISPER_CPP_PATH = path.join(__dirname, '..', 'cpp', 'whisper.cpp');

const BUILD_COMMANDS = {
	win32: {
		command: 'cmake -S . -B build -G "Visual Studio 17 2022" -A x64',
		buildCommand: 'cmake --build build --config Release'
	},
	darwin: {
		command: 'cmake -S . -B build',
		buildCommand: 'cmake --build build'
	},
	linux: {
		command: 'cmake -S . -B build',
		buildCommand: 'cmake --build build'
	}
};

async function buildWhisper() {
	shell.cd(WHISPER_CPP_PATH);
	
	const commands = BUILD_COMMANDS[PLATFORM];
	if (!commands) {
		console.error(`Unsupported platform: ${PLATFORM}`);
		process.exit(1);
	}

	console.log('Configuring build...');
	if (shell.exec(commands.command).code !== 0) {
		console.error('Failed to configure build');
		process.exit(1);
	}

	console.log('Building whisper...');
	if (shell.exec(commands.buildCommand).code !== 0) {
		console.error('Build failed');
		process.exit(1);
	}

	console.log('Build completed successfully');
}

buildWhisper().catch(console.error);