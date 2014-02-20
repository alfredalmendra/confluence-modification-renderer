var div;
module( "Div rendering", {
  setup: function() {
    div = addNewDiv();
  },
  teardown: function() {
    div.remove();
    var toolbarDiv = document.getElementById(STR.TOOLBAR);
    if(toolbarDiv != null) toolbarDiv.remove();
  }
});
function addNewDiv() {
  var newDiv = document.createElement('div');
  document.body.appendChild(newDiv);
  return newDiv;
}
function addNewDivWithAttributes(modificationAction, modificationVersion) {
  var newDiv = addNewDiv();
  setAttributes(newDiv, modificationAction, modificationVersion);
  return newDiv;
}
function setAttributes(element, modificationAction, modificationVersion) {
  element.setAttribute(STR.ACTION, modificationAction);
  element.setAttribute(STR.VERSION, modificationVersion);
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
test( "Div with no specific attributes remains unchanged", function() {
  renderVersion(1);
  ok( div.hidden == false, "Passed!" );
  ok( div.hasAttribute('renderStyle') == false, "Passed!" );
});
test( "Div added in version 2 is hidden while reading version 1", function() {
  setAttributes(div, STR.ADD, 2);
  renderVersion(1);
  verifyRendering(div, true, STR.HIDDEN);
});
test( "Div deleted in version 1 is hidden while reading version 2", function() {
  setAttributes(div, STR.DELETE, 1);
  renderVersion(2);
  verifyRendering(div, true, STR.HIDDEN);
});
test( "Div deleted in version 1 is hidden while reading version 1", function() {
  setAttributes(div, STR.DELETE, 1);
  renderVersion(1);
  verifyRendering(div, true, STR.HIDDEN);
});
test( "Div deleted in version 2 is visible while reading version 1", function() {
  setAttributes(div, STR.DELETE, 2);
  renderVersion(1);
  verifyRendering(div, false, STR.VISIBLE);
});
test( "Div added in version 2 is visible while reading version 2", function() {
  setAttributes(div, STR.ADD, 2);
  renderVersion(2);
  verifyRendering(div, false, STR.VISIBLE);
});
test( "No modification toolbar if no div with specific attributes", function() {
  renderToolbar();
  var toolbarDiv = document.getElementById(STR.TOOLBAR);
  ok( (toolbarDiv instanceof HTMLDivElement) == false, "Passed!" );
});
test( "Modification toolbar is available since div with specific attributes exist", function() {
  var modifiedVersion = 2;
  setAttributes(div, STR.ADD, modifiedVersion);
  var div2 = addNewDivWithAttributes(STR.DELETE, modifiedVersion);
  renderToolbar();
  var toolbarDiv = document.getElementById(STR.TOOLBAR);
  ok( toolbarDiv instanceof HTMLDivElement, "Passed!" );
  var displayedVersionInputList =  toolbarDiv.getElementsByTagName("input");
  ok( displayedVersionInputList.length >= 2, "Passed!" );
  displayedVersionInputList = document.getElementsByName(STR.DISPLAYED_VERSION);
  ok( displayedVersionInputList.length == 2, "Passed!" );
  for(var index = 0; index < displayedVersionInputList.length; index++) {
    ok( displayedVersionInputList[index].getAttribute('type') == 'radio', "Passed!" );
    ok( displayedVersionInputList[index].getAttribute('value') == (modifiedVersion - 1 + index), "Passed!" );
  }
  div2.remove();
});
function clickOn(groupName, version) {
  document.getElementById(groupName + version).click();
}
function clickOnAndVerify3Div(groupName, version, element1, hidden1, renderStyle1, element2, hidden2, renderStyle2, element3, hidden3, renderStyle3) {
  clickOn(groupName, version);
  verifyRendering(element1, hidden1, renderStyle1);
  verifyRendering(element2, hidden2, renderStyle2);
  verifyRendering(element3, hidden3, renderStyle3);
}
test( "Render the selected displayed version", function() {
  setAttributes(div, STR.ADD, 2);
  var div2 = addNewDivWithAttributes(STR.DELETE, 4);
  var div3 = addNewDivWithAttributes(STR.ADD, 8);
  renderToolbar();
  clickOnAndVerify3Div(STR.DISPLAYED_VERSION, 3, div, false, STR.VISIBLE, div2, false, STR.VISIBLE, div3, true, STR.HIDDEN);
  clickOnAndVerify3Div(STR.DISPLAYED_VERSION, 4, div, false, STR.VISIBLE, div2, true, STR.HIDDEN, div3, true, STR.HIDDEN);
  clickOnAndVerify3Div(STR.DISPLAYED_VERSION, 8, div, false, STR.VISIBLE, div2, true, STR.HIDDEN, div3, false, STR.VISIBLE);
  div2.remove();
  div3.remove();
});
test( "No modified version available int the toolbar if no div with specific attributes", function() {
  renderToolbar();
  ok( document.getElementsByName(STR.MODIFIED_VERSION).length == 0, "Passed!" );
});
test( "Modified versions are available in the toolbar", function() {
  var modifiedVersions = [2, 5, 7];
  setAttributes(div, STR.ADD, modifiedVersions[1]);
  var div2 = addNewDivWithAttributes(STR.DELETE, modifiedVersions[0]);
  var div3 = addNewDivWithAttributes(STR.ADD, modifiedVersions[2]);
  renderToolbar();
  var modifiedVersionInputList = document.getElementsByName(STR.MODIFIED_VERSION);
  ok( modifiedVersionInputList.length == 3, "Passed!" );
  for(var index = 0; index < modifiedVersionInputList.length; index++) {
    ok( modifiedVersionInputList[index].getAttribute('type') == 'checkbox', "Passed!" );
    ok( modifiedVersionInputList[index].getAttribute('value') == modifiedVersions[index], "Passed!" );
  }
  div2.remove();
  div3.remove();
});
test( "Hightlight background colors", function() {
  setAttributes(div, STR.ADD, 3);
  var div2 = addNewDivWithAttributes(STR.DELETE, 3);
  var div3 = addNewDivWithAttributes('unknown', 3);
  var div4 = addNewDiv();
  div4.setAttribute(STR.VERSION, 3);
  renderToolbar();
  
  clickOn(STR.DISPLAYED_VERSION, 2);
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  verifyRenderingAndColors(div2, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_DELETE);
  verifyRenderingAndColors(div3, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  verifyRenderingAndColors(div4, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.DISPLAYED_VERSION, 3);
  verifyRenderingAndColors(div, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  verifyRenderingAndColors(div2, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_DELETE);
  verifyRenderingAndColors(div3, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  verifyRenderingAndColors(div4, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  div2.remove();
  div3.remove();
  div4.remove();
});
test( "Hightlight selected team modifications", function() {
  setAttributes(div, STR.ADD, 3);
  var div2 = addNewDivWithAttributes(STR.DELETE, 3);
  var div3 = addNewDiv();
  var div4 = addNewDiv();
  
  div.setAttribute(STR.TEAM, 'dev');
  div2.setAttribute(STR.TEAM, 'dev');
  div3.setAttribute(STR.VERSION, 3);
  div3.setAttribute(STR.TEAM, 'dev');
  div4.setAttribute(STR.TEAM, 'dev');
  renderToolbar();
  
  clickOn(STR.DISPLAYED_VERSION, 2);
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  clickOn(STR.AUTHOR_TEAM, 'dev');
  verifyRenderingAndColors(div, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_ADD);
  verifyRenderingAndColors(div2, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_DELETE);
  verifyRenderingAndColors(div3, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  verifyRenderingAndColors(div4, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_OTHER);
  
  clickOn(STR.AUTHOR_TEAM, 'dev');
  verifyRenderingAndColors(div, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div2, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div3, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(div4, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  
  div2.remove();
  div3.remove();
  div4.remove();
});
