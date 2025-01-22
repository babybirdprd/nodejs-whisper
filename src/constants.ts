import path from 'path'
import { platform } from 'os'

export const MODELS_LIST = [
	'tiny',
	'tiny.en',
	'base',
	'base.en',
	'small',
	'small.en',
	'medium',
	'medium.en',
	'large-v1',
	'large',
	'large-v3-turbo',
]

export const MODELS = [
	'ggml-tiny.en.bin',
	'ggml-tiny.bin',
	'ggml-base.en.bin',
	'ggml-base.bin',
	'ggml-small.en.bin',
	'ggml-small.bin',
	'ggml-medium.en.bin',
	'ggml-medium.bin',
	'ggml-large-v1.bin',
	'ggml-large.bin',
	'ggml-large-v3-turbo.bin',
]

export const MODEL_OBJECT = {
	tiny: 'ggml-tiny.bin',
	'tiny.en': 'ggml-tiny.en.bin',
	base: 'ggml-base.bin',
	'base.en': 'ggml-base.en.bin',
	small: 'ggml-small.bin',
	'small.en': 'ggml-small.en.bin',
	medium: 'ggml-medium.bin',
	'medium.en': 'ggml-medium.en.bin',
	'large-v1': 'ggml-large-v1.bin',
	large: 'ggml-large.bin',
	'large-v3-turbo': 'ggml-large-v3-turbo.bin',
}

export const DEFAULT_MODEL = 'tiny.en'

export const PLATFORM = platform()
export const IS_WINDOWS = PLATFORM === 'win32'
export const IS_MACOS = PLATFORM === 'darwin'
export const IS_LINUX = !IS_WINDOWS && !IS_MACOS

export const WHISPER_CPP_PATH = path.join(__dirname, '..', 'cpp', 'whisper.cpp')

export const BUILD_COMMANDS = {
    win32: {
        command: 'cmake -S . -B build -G "Visual Studio 17 2022" -A x64',
        buildCommand: 'cmake --build build --config Release',
        binaryPath: path.join('build', 'bin', 'Release', 'whisper-cli.exe')
    },
    darwin: {
        command: 'cmake -S . -B build',
        buildCommand: 'cmake --build build',
        binaryPath: path.join('build', 'bin', 'whisper-cli')
    },
    linux: {
        command: 'cmake -S . -B build',
        buildCommand: 'cmake --build build',
        binaryPath: path.join('build', 'bin', 'whisper-cli')
    }
}

export const WHISPER_CPP_MAIN_PATH = BUILD_COMMANDS[PLATFORM].binaryPath
