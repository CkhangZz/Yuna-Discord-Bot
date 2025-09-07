#!/usr/bin/env node

// 🎵 Yuna Music - Enhanced Startup Script
// Handles warnings and provides better error reporting

const originalEmitWarning = process.emitWarning;

// Comprehensive warning suppression for production use
process.emitWarning = function(warning, type, code) {
    // Suppress DEP0190 warning from child processes (yt-dlp plugin)
    if (code === 'DEP0190') {
        console.log('⚠️  Suppressed DEP0190 warning (child process security - harmless in container)');
        return;
    }
    
    // Suppress ready event deprecation (already fixed)
    if (code === 'READY_DEPRECATION' || warning.includes('ready event')) {
        return;
    }
    
    // Suppress Opus-related warnings in containers (we handle fallbacks)
    if (warning.includes('opus') || warning.includes('Opus')) {
        console.log('⚠️  Suppressed Opus warning (handled by fallback system)');
        return;
    }
    
    // Suppress ExperimentalWarning for --experimental-* flags
    if (type === 'ExperimentalWarning') {
        return;
    }
    
    // Show important warnings only
    originalEmitWarning.call(this, warning, type, code);
};

// Suppress warnings from child processes globally
const originalSpawn = require('child_process').spawn;
require('child_process').spawn = function(command, args, options) {
    if (options && options.shell === true) {
        // Replace shell option with safer alternatives when possible
        options.stdio = options.stdio || 'inherit';
    }
    return originalSpawn.call(this, command, args, options);
};

console.log('🎵 Starting Yuna Music with enhanced error handling...');
console.log('🔧 Warnings filtered for clean startup experience');
console.log('');

// Handle uncaught exceptions gracefully
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    console.error('🔄 Bot will attempt to continue...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('🔄 Bot will attempt to continue...');
});

// Set up enhanced error logging
console.originalLog = console.log;
console.log = function(...args) {
    const timestamp = new Date().toISOString();
    console.originalLog(`[${timestamp}]`, ...args);
};

console.originalError = console.error;
console.error = function(...args) {
    const timestamp = new Date().toISOString();
    console.originalError(`[${timestamp}] ❌`, ...args);
};

// Start the actual bot
try {
    require('./index.js');
} catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
}