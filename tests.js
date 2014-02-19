var div;
module( "Div rendering", {
  setup: function() {
    div = addNewDiv();
  },
  teardown: function() {
    div.remove();
    var toolbarDiv = document.getElementById('modificationToolbarDiv');
    if(toolbarDiv != null) toolbarDiv.remove();
  }
});
function addNewDiv() {
  var newDiv = document.createElement('div');
  document.body.appendChild(newDiv);
  return newDiv;
}
function setAttributes(element, modificationAction, modificationVersion) {
  element.setAttribute('modificationAction', modificationAction);
  element.setAttribute('modificationVersion', modificationVersion);
}
function verifyRendering(element, hidden, renderStyle) {
  ok( element.hidden == hidden, "Passed!" );
  ok( element.getAttribute('renderStyle') == renderStyle, "Passed!" );
}
test( "Div with no specific attributes remains unchanged", function() {
  renderVersion(1);
  ok( div.hidden == false, "Passed!" );
  ok( div.hasAttribute('renderStyle') == false, "Passed!" );
});
test( "Div added in version 2 is hidden while reading version 1", function() {
  setAttributes(div, 'add', 2);
  renderVersion(1);
  verifyRendering(div, true, "hidden");
});
test( "Div deleted in version 1 is hidden while reading version 2", function() {
  setAttributes(div, 'delete', 1);
  renderVersion(2);
  verifyRendering(div, true, "hidden");
});
test( "Div deleted in version 1 is hidden while reading version 1", function() {
  setAttributes(div, 'delete', 1);
  renderVersion(1);
  verifyRendering(div, true, "hidden");
});
test( "Div deleted in version 2 is visible while reading version 1", function() {
  setAttributes(div, 'delete', 2);
  renderVersion(1);
  verifyRendering(div, false, "visible");
});
test( "Div added in version 2 is visible while reading version 2", function() {
  setAttributes(div, 'add', 2);
  renderVersion(2);
  verifyRendering(div, false, "visible");
});
test( "No modification toolbar if no div with specific attributes", function() {
  renderToolbar();
  var toolbarDiv = document.getElementById('modificationToolbarDiv');
  ok( (toolbarDiv instanceof HTMLDivElement) == false, "Passed!" );
});
test( "Modification toolbar is available since div with specific attributes exist", function() {
  var modifiedVersion = 2;
  setAttributes(div, 'add', modifiedVersion);
  var div2 = addNewDiv();
  setAttributes(div2, 'delete', modifiedVersion);
  renderToolbar();
  var toolbarDiv = document.getElementById('modificationToolbarDiv');
  ok( toolbarDiv instanceof HTMLDivElement, "Passed!" );
  var displayedVersionInputList =  toolbarDiv.getElementsByTagName("input");
  ok( displayedVersionInputList.length >= 2, "Passed!" );
  displayedVersionInputList = document.getElementsByName('modificationDisplayedVersion');
  for(var index = 0; index < displayedVersionInputList.length; index++) {
    ok( displayedVersionInputList[index].getAttribute('type') == 'radio', "Passed!" );
    ok( displayedVersionInputList[index].getAttribute('name') == 'modificationDisplayedVersion', "Passed!" );
    ok( displayedVersionInputList[index].getAttribute('value') == (modifiedVersion - 1 + index), "Passed!" );
  }
  div2.remove();
});
test( "Render the selected displayed version", function() {
  setAttributes(div, 'add', 2);
  var div2 = addNewDiv();
  setAttributes(div2, 'delete', 4);
  var div3 = addNewDiv();
  setAttributes(div3, 'add', 8);
  renderToolbar();
  document.getElementsByName('modificationDisplayedVersion')[2].click();
  verifyRendering(div, false, "visible");
  verifyRendering(div2, false, "visible");
  verifyRendering(div3, true, "hidden");
  document.getElementsByName('modificationDisplayedVersion')[3].click();
  verifyRendering(div, false, "visible");
  verifyRendering(div2, true, "hidden");
  verifyRendering(div3, true, "hidden");
  document.getElementsByName('modificationDisplayedVersion')[7].click();
  verifyRendering(div, false, "visible");
  verifyRendering(div2, true, "hidden");
  verifyRendering(div3, false, "visible");
  div2.remove();
  div3.remove();
});
test( "No modified version available int the toolbar if no div with specific attributes", function() {
  renderToolbar();
  ok( document.getElementsByName('modificationModifiedVersion').length == 0, "Passed!" );
});
test( "Modified versions are available in the toolbar", function() {
  var modifiedVersions = [2, 5, 7];
  setAttributes(div, 'add', modifiedVersions[1]);
  var div2 = addNewDiv();
  setAttributes(div2, 'delete', modifiedVersions[0]);
  var div3 = addNewDiv();
  setAttributes(div3, 'add', modifiedVersions[2]);
  renderToolbar();
  var modifiedVersionInputList = document.getElementsByName('modificationModifiedVersion');
  ok( modifiedVersionInputList.length == 3, "Passed!" );
  for(var index = 0; index < modifiedVersionInputList.length; index++) {
    ok( modifiedVersionInputList[index].getAttribute('type') == 'checkbox', "Passed!" );
    ok( modifiedVersionInputList[index].getAttribute('value') == modifiedVersions[index], "Passed!" );
  }
  div2.remove();
  div3.remove();
});
test( "Hightlight modifications of checked versions", function() {
  setAttributes(div, 'add', 3);
  renderToolbar();
  document.getElementsByName('modificationDisplayedVersion')[0].click();
  verifyRendering(div, true, "hidden");
  document.getElementsByName('modificationModifiedVersion')[0].click();
  verifyRendering(div, false, "hightlighted");
  document.getElementsByName('modificationModifiedVersion')[0].click();
  verifyRendering(div, true, "hidden");
  document.getElementsByName('modificationDisplayedVersion')[1].click();
  verifyRendering(div, false, "visible");
  document.getElementsByName('modificationModifiedVersion')[0].click();
  verifyRendering(div, false, "hightlighted");
  document.getElementsByName('modificationModifiedVersion')[0].click();
  verifyRendering(div, false, "visible");
});
