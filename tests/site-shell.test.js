const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync('assets/js/site-shell.js', 'utf8');

function activeLinks(hash = '') {
  const links = [
    { href: 'https://example.com/', current: false },
    { href: 'https://example.com/#projects', current: false },
    { href: 'https://example.com/dates/', current: false },
  ].map((link) => ({
    ...link,
    setAttribute(name, value) {
      if (name === 'aria-current' && value === 'page') this.current = true;
    },
  }));

  const document = {
    getElementById: () => null,
    querySelectorAll: () => links,
  };
  const window = {
    location: { pathname: '/', hash, origin: 'https://example.com' },
  };
  vm.runInNewContext(source, { document, window, URL });
  return links.filter((link) => link.current).map((link) => new URL(link.href).hash || 'home');
}

test('home and project navigation are never active together', () => {
  assert.deepEqual(activeLinks(''), ['home']);
  assert.deepEqual(activeLinks('#projects'), ['#projects']);
});
