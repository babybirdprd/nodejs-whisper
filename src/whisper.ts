import shell from 'shelljs'
import { WHISPER_CPP_PATH, WHISPER_CPP_MAIN_PATH, BUILD_COMMANDS, PLATFORM } from './constants'
import path from 'path'

const projectDir = process.cwd()

export interface IShellOptions {
	silent: boolean
	async: boolean
}

const defaultShellOptions: IShellOptions = {
	silent: false,
	async: true,
}

function handleError(error: Error, logger = console) {
	logger.error('[Nodejs-whisper] Error:', error.message)
	shell.cd(projectDir)
	throw error
}

export async function whisperShell(
	command: string,
	options: IShellOptions = defaultShellOptions,
	logger = console
): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		shell.exec(command, options, (code, stdout, stderr) => {
			logger.debug('[Nodejs-whisper] Exit code:', code)
			logger.debug('[Nodejs-whisper] Output:', stdout)
			logger.debug('[Nodejs-whisper] Errors:', stderr)

			if (code === 0) {
				if (stdout.includes('error:')) {
					reject(new Error('Error in whisper.cpp:\n' + stdout))
					return
				}
				logger.debug('[Nodejs-whisper] Transcribing Done!')
				resolve(stdout)
			} else {
				reject(new Error(stderr || 'Command failed with no error output'))
			}
		})
	}).catch((error: Error) => {
		handleError(error)
		return Promise.reject(error)
	})
}

export async function executeCppCommand(command: string, logger = console, withCuda: boolean): Promise<string> {
	try {
		shell.cd(WHISPER_CPP_PATH)
		const binaryPath = path.join(WHISPER_CPP_PATH, WHISPER_CPP_MAIN_PATH)

		if (!shell.test('-f', binaryPath)) {
			logger.debug('[Nodejs-whisper] whisper.cpp not built, starting build process...')

			const buildCommands = BUILD_COMMANDS[PLATFORM]
			if (!buildCommands) {
				throw new Error(`Unsupported platform: ${PLATFORM}`)
			}

			// Configure build
			logger.debug('[Nodejs-whisper] Configuring build...')
			const configureResult = shell.exec(buildCommands.command)
			if (configureResult.code !== 0) {
				throw new Error('Failed to configure build: ' + configureResult.stderr)
			}

			// Build with or without CUDA
			logger.debug('[Nodejs-whisper] Building...')
			const buildCmd = withCuda ? 
				`${buildCommands.buildCommand} -DWHISPER_CUBLAS=1` : 
				buildCommands.buildCommand
			
			const buildResult = shell.exec(buildCmd)
			if (buildResult.code !== 0) {
				throw new Error('Build failed: ' + buildResult.stderr)
			}

			logger.log('[Nodejs-whisper] Build completed successfully.')
		}

		return await whisperShell(command, defaultShellOptions, logger)
	} catch (error) {
		handleError(error as Error)
		throw error
	}
}
