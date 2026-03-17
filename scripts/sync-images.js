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
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function sync() {
  console.log('🔍 Starting Thumbnail Sync Check...\n');

  // 1. Get projects from Supabase
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=name`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
  });
  const projects = await res.json();

  // 2. Get local files
  const localFiles = fs.readdirSync(THUMB_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  const expectedNames = projects.map(p => ({
    original: p.name,
    kebab: toKebab(p.name) + '.jpg'
  }));

  console.log('--- STATUS REPORT ---');
  let missing = 0;
  expectedNames.forEach(p => {
    if (!localFiles.includes(p.kebab)) {
      console.log(`❌ MISSING: [${p.original}]`);
      console.log(`   Expected: ${p.kebab}`);
      missing++;
    } else {
      console.log(`✅ FOUND:   ${p.kebab}`);
    }
  });

  // Check for orphans
  console.log('\n--- ORPHAN CHECK ---');
  const expectedArray = expectedNames.map(e => e.kebab);
  localFiles.forEach(f => {
    if (f !== 'placeholder.jpg' && !expectedArray.includes(f)) {
      console.log(`⚠️ ORPHAN:  ${f} (No matching project found in Supabase)`);
    }
  });

  if (missing > 0) {
    console.log(`\n💡 Tip: Place new thumbnails in ${THUMB_DIR} and name them as shown above.`);
  } else {
    console.log('\n✨ All projects have matching local thumbnails.');
  }
}

sync().catch(console.error);
