import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('cspell.json', 'utf8'));
const patterns = new Map(
  config.patterns.map(({ name, pattern }) => {
    const end = pattern.lastIndexOf('/');
    return [name, new RegExp(pattern.slice(1, end), pattern.slice(end + 1))];
  }),
);

const probes = [
  ['MdxJsxTag', '<Component prop="value">', '</Component>'],
  ['Bech32Addr', 'bbn1y7h7nmxpwlfuj8m72qa0uwc8nqflzgragve5zv'],
];

for (const [name, ...values] of probes) {
  const pattern = patterns.get(name);
  if (!pattern) throw new Error(`Missing cspell pattern: ${name}`);
  for (const value of values) {
    pattern.lastIndex = 0;
    if (!pattern.test(value)) {
      throw new Error(`Pattern ${name} does not match probe: ${value}`);
    }
  }
}

console.log(`Validated ${probes.length} cspell pattern probes.`);
