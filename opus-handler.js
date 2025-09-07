// 🎵 Yuna Music - Opus Library Handler
// Handles Opus library detection and fallback for different environments

const path = require('path');

class OpusHandler {
    constructor() {
        this.opusLibrary = null;
        this.libraryType = null;
    }

    /**
     * Detect and initialize the best available Opus library
     */
    async detectOpus() {
        console.log('🎤 Detecting Opus libraries...');
        
        // Try libraries in order of preference (performance-wise)
        const libraries = [
            { name: '@discordjs/opus', type: 'native' },
            { name: 'node-opus', type: 'native' }, 
            { name: 'opusscript', type: 'js' }
        ];

        for (const lib of libraries) {
            try {
                const opusLib = require(lib.name);
                this.opusLibrary = opusLib;
                this.libraryType = lib.type;
                
                console.log(`✅ Using ${lib.name} (${lib.type} implementation)`);
                
                // Test if the library actually works
                if (this.testOpusLibrary(opusLib)) {
                    return true;
                } else {
                    console.log(`⚠️  ${lib.name} loaded but failed functionality test`);
                    continue;
                }
            } catch (error) {
                console.log(`⚠️  ${lib.name} not available:`, error.message.split('\n')[0]);
                continue;
            }
        }

        console.log('❌ No working Opus library found');
        this.suggestSolutions();
        return false;
    }

    /**
     * Test if the Opus library actually works
     */
    testOpusLibrary(opusLib) {
        try {
            // Basic test - try to create an encoder/decoder
            if (typeof opusLib.OpusEncoder === 'function') {
                const encoder = new opusLib.OpusEncoder(48000, 2);
                if (encoder) {
                    return true;
                }
            }
            
            // Alternative test for different library structures
            if (typeof opusLib.encode === 'function') {
                return true;
            }
            
            // For opusscript
            if (opusLib.encode && opusLib.decode) {
                return true;
            }
            
            return false;
        } catch (error) {
            console.log(`Opus test failed:`, error.message);
            return false;
        }
    }

    /**
     * Get environment-specific installation suggestions
     */
    suggestSolutions() {
        console.log('\n🛠️  Opus Installation Solutions:');
        console.log('');
        
        if (process.platform === 'linux') {
            console.log('📋 For Linux/Docker containers:');
            console.log('   apt-get update');
            console.log('   apt-get install -y libopus-dev build-essential');
            console.log('   npm rebuild @discordjs/opus node-opus');
            console.log('   npm install opusscript  # Fallback');
        }
        
        if (process.platform === 'win32') {
            console.log('📋 For Windows:');
            console.log('   npm install --global windows-build-tools');
            console.log('   npm rebuild @discordjs/opus node-opus');
            console.log('   npm install opusscript  # Fallback');
        }
        
        if (process.platform === 'darwin') {
            console.log('📋 For macOS:');
            console.log('   brew install opus');
            console.log('   npm rebuild @discordjs/opus node-opus');
            console.log('   npm install opusscript  # Fallback');
        }
        
        console.log('\n📋 For SillyDev/Container platforms:');
        console.log('   Run: npm run install-deps');
        console.log('   Or: bash install-deps.sh');
        console.log('');
        console.log('⚠️  Bot will continue with degraded audio performance');
        console.log('');
    }

    /**
     * Get information about the current Opus setup
     */
    getOpusInfo() {
        return {
            library: this.opusLibrary,
            type: this.libraryType,
            performance: this.libraryType === 'native' ? 'High' : 'Standard',
            available: !!this.opusLibrary
        };
    }

    /**
     * Initialize Opus for Discord.js Voice
     * This sets up the library for @discordjs/voice to use
     */
    setupDiscordVoice() {
        if (!this.opusLibrary) {
            console.log('⚠️  No Opus library available - voice quality may be affected');
            return false;
        }

        try {
            // Set environment variable to help @discordjs/voice find Opus
            if (this.libraryType === 'native') {
                process.env.OPUS_ENGINE = this.opusLibrary.name || 'native';
            }
            
            console.log(`🎵 Voice system configured with ${this.libraryType} Opus engine`);
            return true;
        } catch (error) {
            console.log('⚠️  Failed to configure voice system:', error.message);
            return false;
        }
    }
}

// Export singleton instance
const opusHandler = new OpusHandler();
module.exports = opusHandler;