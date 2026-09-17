/**
 * Serializes a rendered HTML table into Markdown (GFM) or CSV (RFC 4180).
 *
 * Both formats read the visible text of each cell, so inline markup
 * (links, code, bold) is flattened to its text content. Cells with a
 * colspan are padded with empty cells to keep columns aligned; rowspan
 * is not expanded.
 */

function cellText(cell: HTMLTableCellElement): string {
  const text = cell.innerText ?? cell.textContent ?? '';
  return text.replace(/\s+/g, ' ').trim();
}

function tableToGrid(table: HTMLTableElement): string[][] {
  const grid: string[][] = [];
  for (const row of Array.from(table.rows)) {
    const cells: string[] = [];
    for (const cell of Array.from(row.cells)) {
      cells.push(cellText(cell));
      for (let extra = 1; extra < cell.colSpan; extra += 1) {
        cells.push('');
      }
    }
    grid.push(cells);
  }
  const width = grid.reduce((max, row) => Math.max(max, row.length), 0);
  return grid.map((row) =>
    row.length < width
      ? [...row, ...Array<string>(width - row.length).fill('')]
      : row
  );
}

export function tableToMarkdown(table: HTMLTableElement): string {
  const grid = tableToGrid(table);
  if (grid.length === 0) {
    return '';
  }
  const escape = (value: string) =>
    value.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
  const line = (row: string[]) => `| ${row.map(escape).join(' | ')} |`;
  const [header, ...body] = grid;
  const divider = `| ${header.map(() => '---').join(' | ')} |`;
  return [line(header), divider, ...body.map(line)].join('\n');
}

export function tableToCsv(table: HTMLTableElement): string {
  const escape = (value: string) =>
    /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  return tableToGrid(table)
    .map((row) => row.map(escape).join(','))
    .join('\r\n');
}
