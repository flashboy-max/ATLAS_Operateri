#!/usr/bin/env node
/**
 * Enhanced catalog validator with cross-reference and statistics
 */

import fs from 'fs';

console.log('🔍 ATLAS Catalog Validator v1.5+ Enhanced');
console.log('==========================================');

// Load catalog
let catalog;
try {
  const catalogData = fs.readFileSync('standard_catalog.json', 'utf8');
  catalog = JSON.parse(catalogData);
  console.log('✅ Loaded catalog: standard_catalog.json');
} catch (error) {
  console.error('❌ Error loading catalog:', error.message);
  process.exit(1);
}

// Validation function
function validateCatalog(catalog) {
  const errors = [];
  const warnings = [];
  
  // Check structure
  if (!catalog.metadata) errors.push('Missing metadata section');
  if (!catalog.services) errors.push('Missing services section');
  if (!catalog.technologies) errors.push('Missing technologies section');
  
  if (errors.length > 0) return { errors, warnings };
  
  // Check metadata
  if (!catalog.metadata.version) errors.push('Missing metadata.version');
  if (!catalog.metadata.last_updated) errors.push('Missing metadata.last_updated');
  
  // Check unique IDs across services and technologies
  const allIds = new Set();
  const duplicateIds = [];
  
  // Validate services
  catalog.services.forEach((service, index) => {
    const prefix = `Service[${index}]`;
    
    if (!service.id) {
      errors.push(`${prefix}: Missing id`);
    } else {
      if (!/^[a-z0-9_]+$/.test(service.id)) {
        errors.push(`${prefix}: Invalid id format '${service.id}' (use lowercase, numbers, underscores only)`);
      }
      if (allIds.has(service.id)) {
        duplicateIds.push(service.id);
      } else {
        allIds.add(service.id);
      }
    }
    
    if (!service.naziv) errors.push(`${prefix}: Missing naziv`);
    if (!service.domain) errors.push(`${prefix}: Missing domain`);
    if (!service.status) errors.push(`${prefix}: Missing status`);
    
    if (service.domain && !['mobile', 'fixed', 'internet', 'tv', 'cloud', 'additional', 'security'].includes(service.domain)) {
      errors.push(`${prefix}: Invalid domain '${service.domain}'`);
    }
    
    if (service.status && !['active', 'planned', 'deprecated'].includes(service.status)) {
      errors.push(`${prefix}: Invalid status '${service.status}'`);
    }
    
    if (service.aliases && !Array.isArray(service.aliases)) {
      errors.push(`${prefix}: aliases must be an array`);
    }
    
    if (service.tags && !Array.isArray(service.tags)) {
      errors.push(`${prefix}: tags must be an array`);
    }
  });
  
  // Validate technologies
  catalog.technologies.forEach((tech, index) => {
    const prefix = `Technology[${index}]`;
    
    if (!tech.id) {
      errors.push(`${prefix}: Missing id`);
    } else {
      if (!/^[a-z0-9_]+$/.test(tech.id)) {
        errors.push(`${prefix}: Invalid id format '${tech.id}' (use lowercase, numbers, underscores only)`);
      }
      if (allIds.has(tech.id)) {
        duplicateIds.push(tech.id);
      } else {
        allIds.add(tech.id);
      }
    }
    
    if (!tech.naziv) errors.push(`${prefix}: Missing naziv`);
    if (!tech.domain) errors.push(`${prefix}: Missing domain`);
    if (!tech.tip) errors.push(`${prefix}: Missing tip`);
    if (!tech.status) errors.push(`${prefix}: Missing status`);
    
    if (tech.domain && !['access', 'core', 'transport', 'cloud', 'security'].includes(tech.domain)) {
      errors.push(`${prefix}: Invalid domain '${tech.domain}'`);
    }
    
    if (tech.status && !['active', 'planned', 'deprecated'].includes(tech.status)) {
      errors.push(`${prefix}: Invalid status '${tech.status}'`);
    }
  });
  
  // Check for duplicate IDs
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
  }
  
  // Warnings
  const servicesWithoutAliases = catalog.services.filter(s => !s.aliases || s.aliases.length === 0);
  if (servicesWithoutAliases.length > 0) {
    warnings.push(`${servicesWithoutAliases.length} services without aliases (may affect fuzzy matching)`);
  }
  
  const techsWithoutAliases = catalog.technologies.filter(t => !t.aliases || t.aliases.length === 0);
  if (techsWithoutAliases.length > 0) {
    warnings.push(`${techsWithoutAliases.length} technologies without aliases (may affect fuzzy matching)`);
  }
  
  return { errors, warnings };
}

// Cross-reference validation
function validateCrossReferences(catalog) {
  const errors = [];
  const warnings = [];
  
  // Check if aliases reference existing IDs
  const allIds = new Set([
    ...catalog.services.map(s => s.id),
    ...catalog.technologies.map(t => t.id)
  ]);
  
  catalog.services.forEach((service, index) => {
    if (service.aliases) {
      service.aliases.forEach(alias => {
        if (allIds.has(alias)) {
          warnings.push(`Service[${index}] alias '${alias}' matches existing ID`);
        }
      });
    }
  });
  
  catalog.technologies.forEach((tech, index) => {
    if (tech.aliases) {
      tech.aliases.forEach(alias => {
        if (allIds.has(alias)) {
          warnings.push(`Technology[${index}] alias '${alias}' matches existing ID`);
        }
      });
    }
  });
  
  return { errors, warnings };
}

// Statistics validation
function generateStatistics(catalog) {
  const stats = {
    metadata: catalog.metadata,
    services: {
      total: catalog.services.length,
      byDomain: {},
      byStatus: {},
      withAliases: 0,
      withTags: 0,
      withRegex: 0
    },
    technologies: {
      total: catalog.technologies.length,
      byDomain: {},
      byStatus: {},
      byType: {},
      withAliases: 0,
      withRegex: 0
    }
  };
  
  // Service statistics
  catalog.services.forEach(service => {
    stats.services.byDomain[service.domain] = (stats.services.byDomain[service.domain] || 0) + 1;
    stats.services.byStatus[service.status] = (stats.services.byStatus[service.status] || 0) + 1;
    
    if (service.aliases && service.aliases.length > 0) stats.services.withAliases++;
    if (service.tags && service.tags.length > 0) stats.services.withTags++;
    if (service.match_regex) stats.services.withRegex++;
  });
  
  // Technology statistics
  catalog.technologies.forEach(tech => {
    stats.technologies.byDomain[tech.domain] = (stats.technologies.byDomain[tech.domain] || 0) + 1;
    stats.technologies.byStatus[tech.status] = (stats.technologies.byStatus[tech.status] || 0) + 1;
    stats.technologies.byType[tech.tip] = (stats.technologies.byType[tech.tip] || 0) + 1;
    
    if (tech.aliases && tech.aliases.length > 0) stats.technologies.withAliases++;
    if (tech.match_regex) stats.technologies.withRegex++;
  });
  
  return stats;
}

// Run validation
const { errors, warnings } = validateCatalog(catalog);
const crossRefResults = validateCrossReferences(catalog);
const stats = generateStatistics(catalog);

// Combine all errors and warnings
const allErrors = [...errors, ...crossRefResults.errors];
const allWarnings = [...warnings, ...crossRefResults.warnings];

// Report results
if (allErrors.length === 0) {
  console.log('✅ Catalog validation PASSED');
  console.log('');
  console.log('📊 DETAILED STATISTICS');
  console.log('======================');
  console.log(`📋 Services: ${stats.services.total}`);
  console.log(`🔧 Technologies: ${stats.technologies.total}`);
  console.log(`🆔 Unique IDs: ${stats.services.total + stats.technologies.total}`);
  console.log(`📅 Version: ${stats.metadata.version}`);
  console.log(`🗓️  Last Updated: ${stats.metadata.last_updated}`);
  
  console.log('');
  console.log('📋 Services by Domain:');
  Object.entries(stats.services.byDomain).forEach(([domain, count]) => {
    console.log(`   ${domain}: ${count}`);
  });
  
  console.log('');
  console.log('🔧 Technologies by Domain:');
  Object.entries(stats.technologies.byDomain).forEach(([domain, count]) => {
    console.log(`   ${domain}: ${count}`);
  });
  
  console.log('');
  console.log('📈 Enhancement Coverage:');
  console.log(`   Services with aliases: ${stats.services.withAliases}/${stats.services.total} (${Math.round(stats.services.withAliases/stats.services.total*100)}%)`);
  console.log(`   Services with tags: ${stats.services.withTags}/${stats.services.total} (${Math.round(stats.services.withTags/stats.services.total*100)}%)`);
  console.log(`   Services with regex: ${stats.services.withRegex}/${stats.services.total} (${Math.round(stats.services.withRegex/stats.services.total*100)}%)`);
  console.log(`   Technologies with aliases: ${stats.technologies.withAliases}/${stats.technologies.total} (${Math.round(stats.technologies.withAliases/stats.technologies.total*100)}%)`);
  console.log(`   Technologies with regex: ${stats.technologies.withRegex}/${stats.technologies.total} (${Math.round(stats.technologies.withRegex/stats.technologies.total*100)}%)`);
  
} else {
  console.log('❌ Catalog validation FAILED');
  console.log('');
  console.log('ERRORS:');
  allErrors.forEach(error => console.log(`  ❌ ${error}`));
}

if (allWarnings.length > 0) {
  console.log('');
  console.log('WARNINGS:');
  allWarnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
}

console.log('');

// Exit with appropriate code
process.exit(allErrors.length > 0 ? 1 : 0);
