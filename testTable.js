var table;
module( "Table rendering", {
  setup: function() {
    document.body.setAttribute("class", "page-metadata");
    table = document.createElement('table');
    document.body.appendChild(table);
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    var isHeader = true;
    var actions = [ null, STR.ADD, STR.DELETE ];
    var versions = [ null, 3, 4, 5 ];
    var cellWithParagraph = [ false, true ];
    var tr, th, td, cell, withParagraph, p, id, textContainer, textContent;
    for(var indexActionLine = 0; indexActionLine < actions.length; indexActionLine++) {
      for(var indexVersionLine = 0; indexVersionLine < versions.length; indexVersionLine++) {
        for(var indexParagraphLine = 0; indexParagraphLine < cellWithParagraph.length; indexParagraphLine++) {
          tr = document.createElement('tr');
          tbody.appendChild(tr);
          for(var indexActionColumn = 0; indexActionColumn < actions.length; indexActionColumn++) {
            for(var indexVersionColumn = 0; indexVersionColumn < versions.length; indexVersionColumn++) {
              for(var indexParagraphColumn = 0; indexParagraphColumn < cellWithParagraph.length; indexParagraphColumn++) {
                withParagraph = cellWithParagraph[indexParagraphLine] || cellWithParagraph[indexParagraphColumn];
                textContent = "";
                id = getCellId(isHeader, actions[indexActionLine], versions[indexVersionLine], cellWithParagraph[indexParagraphLine], actions[indexActionColumn], versions[indexVersionColumn], cellWithParagraph[indexParagraphColumn]);
                if(isHeader) {
                  th = document.createElement('th');
                  tr.appendChild(th);
                  cell = th;
                  textContent += "Column header ";
                } else {
                  td = document.createElement('td');
                  tr.appendChild(td);
                  cell = td;
                  textContent += "Cell ";
                }
                cell.setAttribute('id', id);
                textContent += id;
                if(withParagraph) {
                  p = document.createElement('p');
                  cell.appendChild(p);
                  textContainer = p;
                } else {
                  textContainer = cell;
                }
                textContainer.innerHTML = textContent;
                if(isHeader) {
                  addNewCellDiv(textContainer, id, isHeader, actions[indexActionColumn], versions[indexVersionColumn]);
                } else if(indexActionColumn == 0 && indexVersionColumn == 0 && indexParagraphColumn == 0) {
                  addNewCellDiv(textContainer, id, isHeader, actions[indexActionLine], versions[indexVersionLine]);
                }
              }
            }
          }
          if(isHeader) {
            isHeader = false;
            indexParagraphLine--;
          }
        }
      }
    }
  },
  teardown: function() {
    if(table != null) table.remove();
    var toolbarDiv = document.getElementById(STR.TOOLBAR);
    if(toolbarDiv != null) toolbarDiv.remove();
  }
});
function getEmptyIfNull(value) {
  if(value == null) {
    return 'Empty';
  }
  return value;
}
function getCellId(isHeader, modificationActionLine, modificationVersionLine, withParagraphLine, modificationActionColumn, modificationVersionColumn, withParagraphColumn) {
  var cellId = "";
  if(isHeader) {
    cellId += "Header";
  } else {
    cellId += "Cell";
    cellId += "Line" + getEmptyIfNull(modificationActionLine) + getEmptyIfNull(modificationVersionLine) + getEmptyIfNull(withParagraphLine);
  }
  cellId += "Column" + getEmptyIfNull(modificationActionColumn) + getEmptyIfNull(modificationVersionColumn) + getEmptyIfNull(withParagraphColumn);
  return cellId;
}
function addNewCellDiv(element, id, isHeader, modificationAction, modificationVersion) {
  var newDiv = document.createElement('div');
  newDiv.setAttribute('id', 'div' + id);
  if(isHeader) {
    newDiv.setAttribute(STR.TYPE, STR.TABLE_COLUMN);
  } else {
    newDiv.setAttribute(STR.TYPE, STR.TABLE_LINE);
  }
  if(modificationAction != null) { newDiv.setAttribute(STR.ACTION, modificationAction); }
  if(modificationVersion != null) { newDiv.setAttribute(STR.VERSION, modificationVersion); }
  element.appendChild(newDiv);
}
function clickOn(groupName, version) {
  document.getElementById(groupName + version).click();
}
function verifyRendering(element, hidden, renderStyle) {
  ok( element.hidden == hidden, "Passed!" );
  var elementRenderStyle = element.getAttribute('renderStyle');
  ok( (renderStyle == STR.VISIBLE && (elementRenderStyle == null)) || (elementRenderStyle == renderStyle), "Passed!" );
}
function verifyRenderingAndColors(element, hidden, renderStyle, backgroundColor) {
  verifyRendering(element, hidden, renderStyle);
  var style = getComputedStyle(element);
  var elementBackgroundColor = style.getPropertyValue('background-color');
  ok( elementBackgroundColor == backgroundColor, "Passed!" );
}
test( "Table line should be highlighted, even if the associated div is under a paragraph", function() {
  renderToolbar();
  
  clickOn(STR.DISPLAYED_VERSION, 4);
  
  var cell = document.getElementById(getCellId(false, STR.ADD, 5, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(false, STR.ADD, 5, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(false, STR.ADD, 4, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(false, STR.ADD, 4, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(false, STR.ADD, 3, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(false, STR.ADD, 3, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.MODIFIED_VERSION, 5);
  
  cell = document.getElementById(getCellId(false, STR.ADD, 5, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  cell = document.getElementById(getCellId(false, STR.ADD, 5, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  
  cell = document.getElementById(getCellId(false, STR.ADD, 4, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(false, STR.ADD, 4, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(false, STR.ADD, 3, false, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(false, STR.ADD, 3, true, null, null, false));
  verifyRenderingAndColors(cell.parentElement, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
});
test( "Table column should be highlighted, even if the associated div is under a paragraph", function() {
  renderToolbar();
  
  clickOn(STR.DISPLAYED_VERSION, 4);
  
  var cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 5, false));
  verifyRenderingAndColors(cell, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 5, true));
  verifyRenderingAndColors(cell, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 4, false));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 4, true));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 3, false));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 3, true));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.MODIFIED_VERSION, 5);
  
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 5, false));
  verifyRenderingAndColors(cell, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 5, true));
  verifyRenderingAndColors(cell, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 4, false));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 4, true));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 3, false));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  cell = document.getElementById(getCellId(true, null, null, false, STR.ADD, 3, true));
  verifyRenderingAndColors(cell, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
});
