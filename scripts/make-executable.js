const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'downloadModel.js');

try {
	fs.chmodSync(filePath, '755');
} catch (error) {
	// On Windows, chmod isn't necessary
	if (process.platform !== 'win32') {
		console.error('Failed to make downloadModel.js executable:', error);
		process.exit(1);
	}
}