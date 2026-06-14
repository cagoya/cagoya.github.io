import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { globSync } from 'node:fs';

const docsDir = join(import.meta.dirname, '..', 'docs');
const markdownFiles = globSync('**/*.md', { cwd: docsDir, withFileTypes: false });

const admonitionTypeMap = new Map([
  ['abstract', 'info'],
  ['note', 'info'],
  ['info', 'info'],
  ['question', 'info'],
  ['quesion', 'info'],
  ['tip', 'tip'],
  ['warning', 'warning'],
  ['danger', 'danger'],
  ['error', 'danger'],
]);

const fenceLangMap = new Map([
  ['c++', 'cpp'],
  ['C++', 'cpp'],
  ['cpp', 'cpp'],
  ['CMake', 'cmake'],
  ['cmake', 'cmake'],
  ['SQL', 'sql'],
  ['sql', 'sql'],
  ['JS', 'js'],
  ['JavaScript', 'js'],
  ['javascript', 'js'],
  ['Python', 'python'],
  ['python', 'python'],
  ['Bash', 'bash'],
  ['bash', 'bash'],
  ['Shell', 'bash'],
  ['shell', 'bash'],
  ['Solidity', 'solidity'],
  ['solidity', 'solidity'],
]);

function normalizeTitle(rawTitle) {
  const title = rawTitle.trim();
  if (!title) {
    return '';
  }

  return title.replace(/^['"]|['"]$/g, '').trim();
}

function convertAdmonitions(source) {
  const lines = source.split('\n');
  const output = [];
  const stack = [];

  for (const line of lines) {
    const match = line.match(/^(\s*)(!!!|\?\?\?)\s*([A-Za-z]+)?\s*(.*)$/);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const isBlank = line.trim() === '';
      const lineIndent = line.match(/^(\s*)/)?.[1].length ?? 0;
      const isNestedContent = isBlank || lineIndent > current.indent;
      const startsNewAdmonition = Boolean(match);

      if (isNestedContent && !startsNewAdmonition) {
        break;
      }

      output.push(`${current.prefix}:::`);
      stack.pop();
    }

    if (match) {
      const [, leading, , rawType = 'info', rawTitle = ''] = match;
      const type = admonitionTypeMap.get(rawType) ?? 'info';
      const title = normalizeTitle(rawTitle);
      output.push(`${leading}:::${type}${title ? ` ${title}` : ''}`);
      stack.push({ indent: leading.length, prefix: leading });
      continue;
    }

    const current = stack[stack.length - 1];
    if (current) {
      const contentPrefix = ' '.repeat(current.indent + 4);
      if (line.startsWith(contentPrefix)) {
        output.push(`${current.prefix}${line.slice(contentPrefix.length)}`);
      } else {
        output.push(line);
      }
      continue;
    }

    output.push(line);
  }

  while (stack.length > 0) {
    const current = stack.pop();
    output.push(`${current.prefix}:::`);
  }

  return output.join('\n');
}

function convertImageAttributes(source) {
  return source.replace(
    /!\[([^\]]*)\]\((images[\\/][^)\n]+?)\)(\{[^}\n]*\})?/g,
    (_match, alt, rawSrc, rawAttrs = '') => {
      const normalizedSrc = rawSrc.replace(/\\/g, '/').replace(/"$/, '');
      const widthMatch = rawAttrs.match(/width\s*=\s*"?(\d+)(?:px)?"?/);
      const altAttr = alt ? ` alt="${alt.replace(/"/g, '&quot;')}"` : ' alt=""';
      const widthAttr = widthMatch ? ` width="${widthMatch[1]}"` : '';
      return `<img src="./${normalizedSrc}"${altAttr}${widthAttr} />`;
    },
  );
}

function convertFenceLanguages(source) {
  return source.replace(/^(\s*)```\s*([A-Za-z+#]+)(.*)$/gm, (match, indent, lang, rest) => {
    const normalized = fenceLangMap.get(lang);
    if (!normalized) {
      return match;
    }

    return `${indent}\`\`\`${normalized}${rest}`;
  });
}

for (const file of markdownFiles) {
  const path = join(docsDir, file);
  const original = readFileSync(path, 'utf8');
  const converted = convertFenceLanguages(convertImageAttributes(convertAdmonitions(original)));

  if (converted !== original) {
    writeFileSync(path, converted);
  }
}
