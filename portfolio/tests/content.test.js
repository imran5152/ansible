import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { profile, projects, moreProjects, contactLink } from '../src/data.js';

test('hiring and project enquiries use different subjects and safely encode message content', () => {
  const fields = { name: 'A & B', email: 'hello@example.test', message: 'A React app? #next\nहिन्दी' };
  for (const mode of ['hire', 'project']) {
    const result = new URL(contactLink(mode, fields));
    assert.equal(result.protocol, 'mailto:');
    assert.equal(result.pathname, profile.email);
    assert.equal(result.searchParams.get('subject'), mode === 'hire' ? 'An opportunity for Imran' : 'A project for Imran');
    const body = result.searchParams.get('body');
    for (const value of Object.values(fields)) assert.ok(body.includes(value));
  }
});
test('project categories and references are complete without fake demo links', () => {
  assert.equal(new Set(projects.map(project => project.id)).size, projects.length);
  assert.equal(projects.filter(project => project.category === 'DevOps').length, 1);
  for (const project of projects) {
    assert.ok(project.name && project.description && project.highlights.length);
    for (const key of ['source', 'demo']) if (project[key]) assert.equal(new URL(project[key]).protocol, 'https:');
    if (project.image) assert.ok(existsSync(new URL('../public'+project.image, import.meta.url)));
  }
  for (const project of moreProjects) if (project.url) assert.equal(new URL(project.url).protocol, 'https:');
});
test('both supplied resumes and original project screenshot are packaged as real assets', () => {
  for (const file of ['Imran-Full-Stack-Resume.pdf', 'Imran-DevOps-Resume.pdf']) {
    const data = readFileSync(new URL('../public/resumes/'+file, import.meta.url));
    assert.equal(data.subarray(0, 4).toString(), '%PDF');
  }
  const image = readFileSync(new URL('../public/images/shopwave.jpg', import.meta.url));
  assert.equal(image.subarray(0, 2).toString('hex'), 'ffd8');
});
