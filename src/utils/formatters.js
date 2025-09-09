/**
 * Formatting utilities for ATLAS operators catalog
 * Extracted from app.js global functions
 */

import {
  TECH_NAMES,
  SERVICE_NAMES,
  TECH_TOOLTIPS,
  SERVICE_TOOLTIPS
} from './constants.js';

/**
 * Get readable technology name from key
 * @param {string} techKey - Technology key (e.g., 'tech_2g')
 * @returns {string} Readable technology name
 */
export function getReadableTechName(techKey) {
  return TECH_NAMES[techKey] || techKey.replace('tech_', '').replace(/_/g, ' ').toUpperCase();
}

/**
 * Get readable service name from key
 * @param {string} serviceKey - Service key (e.g., 'mobile_prepaid')
 * @returns {string} Readable service name
 */
export function getReadableServiceName(serviceKey) {
  return SERVICE_NAMES[serviceKey] || serviceKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get technology tooltip content
 * @param {string} techKey - Technology key
 * @returns {string} Tooltip description
 */
export function getTechTooltip(techKey) {
  return TECH_TOOLTIPS[techKey] || 'Napredna telekomunikaciona tehnologija';
}

/**
 * Get service tooltip content
 * @param {string} serviceKey - Service key
 * @returns {string} Tooltip description
 */
export function getServiceTooltip(serviceKey) {
  return SERVICE_TOOLTIPS[serviceKey] || 'Telekomunikaciona usluga za krajnje korisnike';
}
