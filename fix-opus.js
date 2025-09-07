#!/usr/bin/env node

// 🎵 Yuna Music - Container Opus Fix Script
// Specifically designed for SillyDev and Linux containers

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Opus libraries for container environment...');

async function fixOpusForContainer() {
    try {
        // Check if we're in a container environment
        const isContainer = fs.existsSync('/home/container') || 
                          fs.existsSync('/.dockerenv') ||
                          process.env.NODE_ENV === 'production';
                          
        if (isContainer) {
            console.log('📦 Container environment detected');
        }

        // Remove potentially broken Opus installations
        console.log('🧹 Cleaning existing Opus installations...');
        try {
            execSync('npm uninstall @discordjs/opus node-opus', { stdio: 'pipe' });
        } catch (e) {
            // Ignore uninstall errors
        }

        // Install opusscript first as reliable fallback
        console.log('✅ Installing opusscript (JavaScript fallback)...');
        execSync('npm install opusscript@^0.1.1 --save', { stdio: 'inherit' });

        // Try to install native Opus libraries
        console.log('🎵 Attempting to install native Opus libraries...');
        
        try {
            execSync('npm install @discordjs/opus@^0.10.0 --save --build-from-source', { 
                stdio: 'inherit',
                timeout: 120000  // 2 minutes timeout
            });
            console.log('✅ @discordjs/opus installed successfully');
        } catch (e) {
            console.log('⚠️ @discordjs/opus failed, continuing with opusscript...');
        }

        try {
            execSync('npm install node-opus@^0.3.3 --save --build-from-source', { 
                stdio: 'inherit',
                timeout: 120000
            });
            console.log('✅ node-opus installed successfully');
        } catch (e) {
            console.log('⚠️ node-opus failed, continuing with opusscript...');
        }

        // Test installations
        console.log('🧪 Testing Opus installations...');
        
        const testResults = {
            discordjs: false,
            nodeOpus: false, 
            opusscript: false
        };

        try {
            require('@discordjs/opus');
            testResults.discordjs = true;
            console.log('✅ @discordjs/opus working');
        } catch (e) {
            console.log('❌ @discordjs/opus not working');
        }

        try {
            require('node-opus');
            testResults.nodeOpus = true;
            console.log('✅ node-opus working');
        } catch (e) {
            console.log('❌ node-opus not working');
        }

        try {
            require('opusscript');
            testResults.opusscript = true;
            console.log('✅ opusscript working');
        } catch (e) {
            console.log('❌ opusscript not working');
        }

        // Summary
        console.log('\n📊 Opus Libraries Status:');
        console.log(`@discordjs/opus: ${testResults.discordjs ? '✅ Working' : '❌ Failed'}`);
        console.log(`node-opus: ${testResults.nodeOpus ? '✅ Working' : '❌ Failed'}`);
        console.log(`opusscript: ${testResults.opusscript ? '✅ Working' : '❌ Failed'}`);

        if (testResults.discordjs || testResults.nodeOpus || testResults.opusscript) {
            console.log('\n🎉 At least one Opus library is working!');
            console.log('🎵 Bot should be able to play music now');
            return true;
        } else {
            console.log('\n❌ No Opus library is working');
            console.log('🔧 Please check the installation logs above for errors');
            return false;
        }

    } catch (error) {
        console.error('💥 Error during Opus fix:', error.message);
        return false;
    }
}

// Run if called directly
if (require.main === module) {
    fixOpusForContainer()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = fixOpusForContainer;