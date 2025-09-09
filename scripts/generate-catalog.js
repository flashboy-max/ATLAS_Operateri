#!/usr/bin/env node
/**
 * ATLAS Standard Catalog Generator v1.5+
 * Enhanced with cross-validation, fuzzy matching, and advanced features
 */

import fs from 'fs';
import path from 'path';

// Paths
const catalogPath = 'standard_catalog.json';
const schemaPath = 'standard_catalog.schema.json';
const outputDir = 'generated';
const outputPath = path.join(outputDir, 'standard_catalog.js');

console.log('🏗️  ATLAS Catalog Generator v1.5+ Enhanced');
console.log('===========================================');

// Check if files exist
if (!fs.existsSync(catalogPath)) {
  console.error('❌ Error: standard_catalog.json not found');
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error('❌ Error: standard_catalog.schema.json not found');
  process.exit(1);
}

// Load catalog
let catalog;
try {
  const catalogData = fs.readFileSync(catalogPath, 'utf8');
  catalog = JSON.parse(catalogData);
  console.log('✅ Loaded catalog:', catalogPath);
} catch (error) {
  console.error('❌ Error parsing catalog JSON:', error.message);
  process.exit(1);
}

// Enhanced validation function
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

    // Validate regex patterns
    if (service.match_regex) {
      try {
        new RegExp(service.match_regex);
      } catch (e) {
        errors.push(`${prefix}: Invalid regex pattern '${service.match_regex}': ${e.message}`);
      }
    }

    // Validate replacement_id references
    if (service.replacement_id && !allIds.has(service.replacement_id)) {
      warnings.push(`${prefix}: replacement_id '${service.replacement_id}' does not exist`);
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

    // Validate regex patterns
    if (tech.match_regex) {
      try {
        new RegExp(tech.match_regex);
      } catch (e) {
        errors.push(`${prefix}: Invalid regex pattern '${tech.match_regex}': ${e.message}`);
      }
    }

    // Validate replacement_id references
    if (tech.replacement_id && !allIds.has(tech.replacement_id)) {
      warnings.push(`${prefix}: replacement_id '${tech.replacement_id}' does not exist`);
    }
  });

  // Check for duplicate IDs
  if (duplicateIds.length > 0) {
    errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
  }

  // Warnings for missing enhancements
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

  const allIds = new Set([
    ...catalog.services.map(s => s.id),
    ...catalog.technologies.map(t => t.id)
  ]);

  // Check alias conflicts
  catalog.services.forEach((service, index) => {
    if (service.aliases) {
      service.aliases.forEach(alias => {
        if (allIds.has(alias)) {
          warnings.push(`Service[${index}] alias '${alias}' conflicts with existing ID`);
        }
      });
    }
  });

  catalog.technologies.forEach((tech, index) => {
    if (tech.aliases) {
      tech.aliases.forEach(alias => {
        if (allIds.has(alias)) {
          warnings.push(`Technology[${index}] alias '${alias}' conflicts with existing ID`);
        }
      });
    }
  });

  return { errors, warnings };
}

// Validate catalog
const { errors, warnings } = validateCatalog(catalog);
const crossRefResults = validateCrossReferences(catalog);

const allErrors = [...errors, ...crossRefResults.errors];
const allWarnings = [...warnings, ...crossRefResults.warnings];

if (allErrors.length > 0) {
  console.error('❌ Catalog validation failed:');
  allErrors.forEach(error => console.error(`   - ${error}`));
  process.exit(1);
}

console.log('✅ Catalog validation passed');

// Auto-calculate totals
catalog.metadata.total_services = catalog.services.length;
catalog.metadata.total_technologies = catalog.technologies.length;
catalog.metadata.generated_at = new Date().toISOString();

// Generate enhanced ES module
const jsContent = `/**
 * ATLAS Standard Catalog - AUTO-GENERATED
 * Generated: ${catalog.metadata.generated_at}
 * Version: ${catalog.metadata.version}
 *
 * ⚠️  WARNING: DO NOT EDIT THIS FILE DIRECTLY
 * Edit standard_catalog.json and run: npm run generate-catalog
 */

export const standardCatalog = ${JSON.stringify(catalog, null, 2)};

// Legacy compatibility wrapper
export function getStandardServicesAndTechnologies() {
  return {
    standardServices: standardCatalog.services,
    standardTechnologies: standardCatalog.technologies
  };
}

// Enhanced utility functions
export const catalogUtils = {
  // Basic getters
  getServiceById: (id) => standardCatalog.services.find(s => s.id === id),
  getTechnologyById: (id) => standardCatalog.technologies.find(t => t.id === id),
  getServicesByDomain: (domain) => standardCatalog.services.filter(s => s.domain === domain),
  getTechnologiesByDomain: (domain) => standardCatalog.technologies.filter(t => t.domain === domain),

  // Status helpers
  getActiveServices: () => standardCatalog.services.filter(s => s.status === 'active'),
  getActiveTechnologies: () => standardCatalog.technologies.filter(t => t.status === 'active'),
  getDeprecatedItems: () => [
    ...standardCatalog.services.filter(s => s.status === 'deprecated'),
    ...standardCatalog.technologies.filter(t => t.status === 'deprecated')
  ],

  // Advanced fuzzy matching with caching
  _matchCache: new Map(),

  fuzzyMatchService: (query) => {
    if (!query || typeof query !== 'string') return [];

    const cacheKey = \`service_\${query.toLowerCase().trim()}\`;
    if (catalogUtils._matchCache.has(cacheKey)) {
      return catalogUtils._matchCache.get(cacheKey);
    }

    const normalized = query.toLowerCase().trim();
    const matches = [];

    standardCatalog.services.forEach(service => {
      let score = 0;
      let matchType = 'none';

      // Exact ID match (highest priority)
      if (service.id === normalized.replace(/[^a-z0-9]/g, '_')) {
        score = 100;
        matchType = 'exact_id';
      }
      // Exact naziv match
      else if (service.naziv.toLowerCase() === normalized) {
        score = 95;
        matchType = 'exact_name';
      }
      // Alias match
      else if (service.aliases && service.aliases.some(alias =>
        alias.toLowerCase() === normalized)) {
        score = 90;
        matchType = 'alias';
      }
      // Regex match
      else if (service.match_regex) {
        try {
          const regex = new RegExp(service.match_regex, 'i');
          if (regex.test(query)) {
            score = 85;
            matchType = 'regex';
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
      // Partial naziv match
      else if (service.naziv.toLowerCase().includes(normalized)) {
        score = Math.max(70, 70 + (normalized.length / service.naziv.length) * 10);
        matchType = 'partial_name';
      }
      // Tag match
      else if (service.tags && service.tags.some(tag =>
        tag.toLowerCase().includes(normalized))) {
        score = 60;
        matchType = 'tag';
      }
      // Token overlap
      else {
        const serviceTokens = service.naziv.toLowerCase().split(/\\s+/);
        const queryTokens = normalized.split(/\\s+/);
        const overlap = serviceTokens.filter(t => queryTokens.includes(t));
        if (overlap.length > 0) {
          const overlapRatio = overlap.length / Math.max(serviceTokens.length, queryTokens.length);
          score = Math.floor(overlapRatio * 50);
          matchType = 'token_overlap';
        }
      }

      if (score > 0) {
        matches.push({
          service,
          score,
          confidence: score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low',
          matchType
        });
      }
    });

    const sortedMatches = matches.sort((a, b) => b.score - a.score);
    catalogUtils._matchCache.set(cacheKey, sortedMatches);
    return sortedMatches;
  },

  fuzzyMatchTechnology: (query) => {
    if (!query || typeof query !== 'string') return [];

    const cacheKey = \`tech_\${query.toLowerCase().trim()}\`;
    if (catalogUtils._matchCache.has(cacheKey)) {
      return catalogUtils._matchCache.get(cacheKey);
    }

    const normalized = query.toLowerCase().trim();
    const matches = [];

    standardCatalog.technologies.forEach(tech => {
      let score = 0;
      let matchType = 'none';

      // Exact ID match
      if (tech.id === normalized.replace(/[^a-z0-9]/g, '_')) {
        score = 100;
        matchType = 'exact_id';
      }
      // Exact naziv match
      else if (tech.naziv.toLowerCase() === normalized) {
        score = 95;
        matchType = 'exact_name';
      }
      // Alias match
      else if (tech.aliases && tech.aliases.some(alias =>
        alias.toLowerCase() === normalized)) {
        score = 90;
        matchType = 'alias';
      }
      // Regex match
      else if (tech.match_regex) {
        try {
          const regex = new RegExp(tech.match_regex, 'i');
          if (regex.test(query)) {
            score = 85;
            matchType = 'regex';
          }
        } catch (e) {
          // Invalid regex, skip
        }
      }
      // Partial naziv match
      else if (tech.naziv.toLowerCase().includes(normalized)) {
        score = Math.max(70, 70 + (normalized.length / tech.naziv.length) * 10);
        matchType = 'partial_name';
      }
      // Tag match
      else if (tech.tags && tech.tags.some(tag =>
        tag.toLowerCase().includes(normalized))) {
        score = 60;
        matchType = 'tag';
      }

      if (score > 0) {
        matches.push({
          technology: tech,
          score,
          confidence: score >= 85 ? 'high' : score >= 70 ? 'medium' : 'low',
          matchType
        });
      }
    });

    const sortedMatches = matches.sort((a, b) => b.score - a.score);
    catalogUtils._matchCache.set(cacheKey, sortedMatches);
    return sortedMatches;
  },

  // Batch matching for operator validation
  validateOperatorData: (operatorServices, operatorTechnologies) => {
    const results = {
      services: { matched: [], missing: [], suggestions: [] },
      technologies: { matched: [], missing: [], suggestions: [] },
      summary: { totalServices: 0, matchedServices: 0, totalTechnologies: 0, matchedTechnologies: 0 }
    };

    // Validate services
    if (operatorServices && Array.isArray(operatorServices)) {
      results.summary.totalServices = operatorServices.length;
      operatorServices.forEach(service => {
        const matches = catalogUtils.fuzzyMatchService(service.naziv);
        if (matches.length > 0 && matches[0].score >= 80) {
          results.services.matched.push({
            operator: service,
            catalog: matches[0].service,
            score: matches[0].score,
            confidence: matches[0].confidence,
            matchType: matches[0].matchType
          });
          results.summary.matchedServices++;
        } else {
          results.services.missing.push(service);
          if (matches.length > 0) {
            results.services.suggestions.push({
              operator: service,
              suggestions: matches.slice(0, 3)
            });
          }
        }
      });
    }

    // Validate technologies
    if (operatorTechnologies && Array.isArray(operatorTechnologies)) {
      results.summary.totalTechnologies = operatorTechnologies.length;
      operatorTechnologies.forEach(tech => {
        const matches = catalogUtils.fuzzyMatchTechnology(tech.naziv);
        if (matches.length > 0 && matches[0].score >= 80) {
          results.technologies.matched.push({
            operator: tech,
            catalog: matches[0].technology,
            score: matches[0].score,
            confidence: matches[0].confidence,
            matchType: matches[0].matchType
          });
          results.summary.matchedTechnologies++;
        } else {
          results.technologies.missing.push(tech);
          if (matches.length > 0) {
            results.technologies.suggestions.push({
              operator: tech,
              suggestions: matches.slice(0, 3)
            });
          }
        }
      });
    }

    return results;
  },

  // Deprecation helpers
  getDeprecatedReplacements: () => {
    const replacements = [];

    standardCatalog.services.forEach(service => {
      if (service.status === 'deprecated' && service.replacement_id) {
        const replacement = catalogUtils.getServiceById(service.replacement_id);
        if (replacement) {
          replacements.push({
            deprecated: service,
            replacement: replacement
          });
        }
      }
    });

    standardCatalog.technologies.forEach(tech => {
      if (tech.status === 'deprecated' && tech.replacement_id) {
        const replacement = catalogUtils.getTechnologyById(tech.replacement_id);
        if (replacement) {
          replacements.push({
            deprecated: tech,
            replacement: replacement
          });
        }
      }
    });

    return replacements;
  },

  // Localization helpers
  getDisplayStatus: (status) => {
    const statusMap = {
      'active': 'Aktivna',
      'planned': 'Planirana',
      'deprecated': 'Ukinuta'
    };
    return statusMap[status] || status;
  },

  getDisplayDomain: (domain) => {
    const domainMap = {
      'mobile': 'Mobilni',
      'fixed': 'Fiksni',
      'internet': 'Internet',
      'tv': 'Televizija',
      'cloud': 'Cloud',
      'additional': 'Dodatno',
      'security': 'Bezbednost',
      // Technology domains
      'access': 'Pristupna',
      'core': 'Core',
      'transport': 'Transportna'
    };
    return domainMap[domain] || domain;
  },

  // Search and filter helpers
  searchServices: (query, filters = {}) => {
    let results = standardCatalog.services;

    // Apply text search
    if (query) {
      const matches = catalogUtils.fuzzyMatchService(query);
      const matchedIds = matches.map(m => m.service.id);
      results = results.filter(s => matchedIds.includes(s.id));
    }

    // Apply filters
    if (filters.domain) {
      results = results.filter(s => s.domain === filters.domain);
    }
    if (filters.status) {
      results = results.filter(s => s.status === filters.status);
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(s =>
        s.tags && filters.tags.some(tag => s.tags.includes(tag))
      );
    }

    return results;
  },

  searchTechnologies: (query, filters = {}) => {
    let results = standardCatalog.technologies;

    // Apply text search
    if (query) {
      const matches = catalogUtils.fuzzyMatchTechnology(query);
      const matchedIds = matches.map(m => m.technology.id);
      results = results.filter(t => matchedIds.includes(t.id));
    }

    // Apply filters
    if (filters.domain) {
      results = results.filter(t => t.domain === filters.domain);
    }
    if (filters.tip) {
      results = results.filter(t => t.tip === filters.tip);
    }
    if (filters.status) {
      results = results.filter(t => t.status === filters.status);
    }

    return results;
  },

  // Statistics
  getStatistics: () => {
    return {
      metadata: standardCatalog.metadata,
      services: {
        total: standardCatalog.services.length,
        byDomain: standardCatalog.services.reduce((acc, s) => {
          acc[s.domain] = (acc[s.domain] || 0) + 1;
          return acc;
        }, {}),
        byStatus: standardCatalog.services.reduce((acc, s) => {
          acc[s.status] = (acc[s.status] || 0) + 1;
          return acc;
        }, {}),
        withAliases: standardCatalog.services.filter(s => s.aliases && s.aliases.length > 0).length,
        withRegex: standardCatalog.services.filter(s => s.match_regex).length
      },
      technologies: {
        total: standardCatalog.technologies.length,
        byDomain: standardCatalog.technologies.reduce((acc, t) => {
          acc[t.domain] = (acc[t.domain] || 0) + 1;
          return acc;
        }, {}),
        byStatus: standardCatalog.technologies.reduce((acc, t) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {}),
        byType: standardCatalog.technologies.reduce((acc, t) => {
          acc[t.tip] = (acc[t.tip] || 0) + 1;
          return acc;
        }, {}),
        withAliases: standardCatalog.technologies.filter(t => t.aliases && t.aliases.length > 0).length,
        withRegex: standardCatalog.technologies.filter(t => t.match_regex).length
      }
    };
  }
};
`;

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write generated file
try {
  fs.writeFileSync(outputPath, jsContent);
  console.log('✅ Generated:', outputPath);
} catch (error) {
  console.error('❌ Error writing output file:', error.message);
  process.exit(1);
}

// Show warnings if any
if (allWarnings.length > 0) {
  console.log('');
  console.log('⚠️  WARNINGS:');
  allWarnings.forEach(warning => console.log(`   - ${warning}`));
}

// Summary
console.log('');
console.log('📊 CATALOG SUMMARY');
console.log('==================');
console.log(`📋 Services: ${catalog.metadata.total_services}`);
console.log(`🔧 Technologies: ${catalog.metadata.total_technologies}`);
console.log(`🆔 Unique IDs: ${catalog.metadata.total_services + catalog.metadata.total_technologies}`);
console.log(`📅 Version: ${catalog.metadata.version}`);
console.log(`🎯 Status: Ready for import`);
console.log('');
console.log('🚀 Next steps:');
console.log('   1. Update index.html: <script type="module" src="app.js"></script>');
console.log('   2. Update app.js: import { standardCatalog, catalogUtils } from "./generated/standard_catalog.js"');
console.log('   3. Test the application');
console.log('');
console.log('💡 Available utilities:');
console.log('   - catalogUtils.fuzzyMatchService(query)');
console.log('   - catalogUtils.fuzzyMatchTechnology(query)');
console.log('   - catalogUtils.validateOperatorData(services, technologies)');
console.log('   - catalogUtils.getStatistics()');