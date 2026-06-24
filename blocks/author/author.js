import { fetchPlaceholders, getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders(getMetadata('locale'));
  console.log(placeholders);

  const {
    header,
    fnameKey,
    lnameKey,
    roleKey,
    orgKey,
    cntrKey,
    firstName,
    lastName,
    role,
    organization,
    country,
  } = placeholders;

  const table = document.createElement('table');
  table.classList.add('author-table');

  // Row 1 - Header
  const headerRow = document.createElement('tr');
  const headerCell = document.createElement('th');
  headerCell.colSpan = 2;
  headerCell.textContent = header || 'Author';
  headerRow.append(headerCell);
  table.append(headerRow);

  // Helper function to create label-value row
  const createRow = (label, value) => {
    const tr = document.createElement('tr');

    const labelTd = document.createElement('td');
    labelTd.textContent = label || '';

    const valueTd = document.createElement('td');
    valueTd.textContent = value || '';

    tr.append(labelTd, valueTd);
    return tr;
  };

  table.append(
    createRow(fnameKey, firstName),
    createRow(lnameKey, lastName),
    createRow(roleKey, role),
    createRow(orgKey, organization),
    createRow(cntrKey, country),
  );

  block.innerHTML = '';
  block.append(table);
}