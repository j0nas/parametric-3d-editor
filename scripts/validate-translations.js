#!/usr/bin/env node
/**
 * Translation Validation Script
 * Ensures all translation keys exist across all language files
 */

const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const LOCALES = ['en', 'nb'];

/**
 * Recursively get all translation keys from an object
 */
function getKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...getKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Load and parse a translation file
 */
function loadTranslations(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load ${locale}.json:`, error.message);
    process.exit(1);
  }
}

/**
 * Main validation logic
 */
function validateTranslations() {
  console.log('🔍 Validating translation files...\n');

  // Load all translation files
  const translations = {};
  const allKeys = {};

  for (const locale of LOCALES) {
    translations[locale] = loadTranslations(locale);
    allKeys[locale] = new Set(getKeys(translations[locale]));
    console.log(`📄 ${locale}.json: ${allKeys[locale].size} keys`);
  }

  console.log();

  // Check for missing keys in each locale
  let hasErrors = false;

  for (const locale of LOCALES) {
    const otherLocales = LOCALES.filter(l => l !== locale);

    for (const otherLocale of otherLocales) {
      const missingKeys = [...allKeys[otherLocale]].filter(
        key => !allKeys[locale].has(key)
      );

      if (missingKeys.length > 0) {
        hasErrors = true;
        console.error(`❌ ${locale}.json is missing ${missingKeys.length} keys from ${otherLocale}.json:`);
        missingKeys.forEach(key => console.error(`   - ${key}`));
        console.log();
      }
    }
  }

  // Report results
  if (hasErrors) {
    console.error('❌ Translation validation failed!\n');
    console.error('Please add the missing keys to maintain translation parity.\n');
    process.exit(1);
  } else {
    console.log('✅ All translation files are in sync!\n');
  }
}

// Run validation
validateTranslations();
