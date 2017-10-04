'use strict'

window.onload = () => {
  for (let i = 1; i <= 5; ++i) {
    document.getElementById(`select-condition-field-${i}`)
      .addEventListener('change', handleSelectedFieldChange);
  }
};

function handleSelectedFieldChange(event) {
  const selectedField = event.currentTarget.value;
  const parentListItem = event.currentTarget.parentElement.parentElement;
  const numId = parentListItem.id.slice(-1);

  const selectOtherField = document.getElementById(`select-other-field-${numId}`);
  if (selectedField === '$other') {
    if (!selectOtherField) addSelectOtherField(parentListItem);
  } else {
    if (selectOtherField) removeSelectOtherField(parentListItem);
  }

  const checkboxExactMatch = document.getElementById(`checkbox-exact-match-${numId}`);
  if (['$keyword', '$hashtag'].includes(selectedField)) {
    if (!checkboxExactMatch) addCheckboxExactMatch(parentListItem);
  } else {
    if (checkboxExactMatch) removeCheckboxExactMatch(parentListItem);
  }
}

function addCheckboxExactMatch(parent) {
  const numId = parent.id.slice(-1);

  const labelExactMatch = document.createElement('label');
  labelExactMatch.setAttribute('id', `checkbox-exact-match-${numId}`);

  const checkboxExactMatch = document.createElement('input');
  checkboxExactMatch.setAttribute('type', 'checkbox');
  checkboxExactMatch.setAttribute('name', `exactMatch${numId}`)

  labelExactMatch.appendChild(checkboxExactMatch);
  labelExactMatch.appendChild(document.createTextNode('Exact Match'));

  parent.appendChild(labelExactMatch);
}

function removeCheckboxExactMatch(parent) {
  const numId = parent.id.slice(-1);
  const checkboxExactMatch = document.getElementById(`checkbox-exact-match-${numId}`);
  parent.removeChild(checkboxExactMatch);
}


function addSelectOtherField(parent) {
  const numId = parent.id.slice(-1);

  const selectOtherField = document.createElement('select');
  selectOtherField.setAttribute('id', `select-other-field-${numId}`);
  selectOtherField.setAttribute('name', `otherField${numId}`)

  for (const dataSrc in locals.allFields) {
    for (const field of locals.allFields[dataSrc]) {
      const option = document.createElement('option');
      option.setAttribute('value', field);
      option.appendChild(document.createTextNode(`${dataSrc}: ${field}`));

      selectOtherField.appendChild(option);
    }
  }

  const labelConditionField = document.getElementById(`label-condition-field-${numId}`);
  parent.insertBefore(selectOtherField, labelConditionField.nextSibling);
}

function removeSelectOtherField(parent) {
  const numId = parent.id.slice(-1);
  const selectOtherField = document.getElementById(`select-other-field-${numId}`);
  parent.removeChild(selectOtherField);
}