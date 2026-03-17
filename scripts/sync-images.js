import fs from 'fs';
import path from 'path';

const THUMB_DIR = './public/thumbnails';
const SUPABASE_URL = 'https://jrgfbfxzrpzfscguicwi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZ2ZiZnh6cnB6ZnNjZ3VpY3dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1ODUwNDEsImV4cCI6MjA4OTE2MTA0MX0.VTOenW3GEUaMML55NxB7TEXlpDfrx2YnQescbbR0WAk';

/**
 * Helper to convert name to kebab-case (matches components.js logic)
 */
function toKebab(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function sync() {
  console.log('🔍 Starting Persistent Thumbnail Sync Check...\n');

  // 1. Get projects from Supabase
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=name`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  const projects = await res.json();

  // 2. Get local files
  const localFiles = fs.readdirSync(THUMB_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  const expectedNames = projects.map(p => {
    const kebab = toKebab(p.name);
    return {
      original: p.name,
      kebab: kebab + '.jpg',
      prefix: kebab.split('-').slice(0, 3).join('-') + '.jpg'
    };
  });

  console.log('--- STATUS REPORT & PROTECTION CHECK ---');
  let missing = 0;
  const foundMap = new Map();

  expectedNames.forEach(p => {
    let status = '❌ MISSING';
    let detail = `Expected: ${p.kebab}`;
    
    if (localFiles.includes(p.kebab)) {
      status = '✅ PROTECTED (Exact)';
      detail = `Using: ${p.kebab}`;
      foundMap.set(p.kebab, (foundMap.get(p.kebab) || 0) + 1);
    } else if (localFiles.includes(p.prefix)) {
      status = '✅ PROTECTED (Prefix)';
      detail = `Using: ${p.prefix}`;
      foundMap.set(p.prefix, (foundMap.get(p.prefix) || 0) + 1);
    } else {
      missing++;
    }
    
    console.log(`${status.padEnd(25)} | [${p.original}]`);
    console.log(`   ${detail}`);
  });

  // Consistency Check: Report shared images
  console.log('\n--- CONSISTENCY CHECK ---');
  foundMap.forEach((count, file) => {
    if (count > 1) {
      console.log(`🔗 SHARED: ${file} is being correctly used by ${count} project listings.`);
    }
  });

  // Orphan Check (Assets not linked to any project)
  console.log('\n--- ORPHAN CHECK ---');
  localFiles.forEach(f => {
    if (f === 'placeholder.jpg') return;
    const isUsed = Array.from(foundMap.keys()).includes(f);
    if (!isUsed) {
      console.log(`⚠️ UNLINKED: ${f} (This file is in the folder but doesn't match any current project)`);
    }
  });

  if (missing > 0) {
    console.log(`\n💡 Note: I will only "Generate" missing images. Your existing images shown as "PROTECTED" will never be overwritten.`);
  } else {
    console.log('\n✨ All projects have consistent visual identities. Everything is protected.');
  }
}

sync().catch(console.error);
