var div;
module( "Div rendering", {
  setup: function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  },
  teardown: function() {
    div.remove();
    var toolbarDiv = document.getElementById('modificationToolbarDiv');
    if(toolbarDiv != null) toolbarDiv.remove();
  }
});
function setAttributes(modificationAction, modificationVersion) {
  div.setAttribute('modificationAction', modificationAction);
  div.setAttribute('modificationVersion', modificationVersion);
}
function verifyRendering(hidden, renderStyle) {
  ok( div.hidden == hidden, "Passed!" );
  ok( div.getAttribute('renderStyle') == renderStyle, "Passed!" );
}
test( "Div with no specific attributes remains unchanged", function() {
  renderVersion(1);
  ok( div.hidden == false, "Passed!" );
  ok( div.hasAttribute('renderStyle') == false, "Passed!" );
});
test( "Div added in version 2 is hidden while reading version 1", function() {
  setAttributes('add', 2);
  renderVersion(1);
  verifyRendering(true, "hidden");
});
test( "Div deleted in version 1 is hidden while reading version 2", function() {
  setAttributes('delete', 1);
  renderVersion(2);
  verifyRendering(true, "hidden");
});
test( "Div deleted in version 1 is hidden while reading version 1", function() {
  setAttributes('delete', 1);
  renderVersion(1);
  verifyRendering(true, "hidden");
});
test( "Div deleted in version 2 is visible while reading version 1", function() {
  setAttributes('delete', 2);
  renderVersion(1);
  verifyRendering(false, "visible");
});
test( "Div added in version 2 is visible while reading version 2", function() {
  setAttributes('add', 2);
  renderVersion(2);
  verifyRendering(false, "visible");
});
test( "No modification toolbar if no div with specific attributes", function() {
  renderToolbar();
  var toolbarDiv = document.getElementById('modificationToolbarDiv');
  ok( (toolbarDiv instanceof HTMLDivElement) == false, "Passed!" );
});
test( "Modification toolbar is available since div with specific attributes exist", function() {
  var modifiedVersion = 2;
  setAttributes('add', modifiedVersion);
  setAttributes('delete', modifiedVersion);
  renderToolbar();
  var toolbarDiv = document.getElementById('modificationToolbarDiv');
  ok( toolbarDiv instanceof HTMLDivElement, "Passed!" );
  var inputList =  toolbarDiv.getElementsByTagName("input");
  ok( inputList.length == 2, "Passed!" );
  for(var index = 0; index < inputList.length; index++) {
    ok( inputList[index].getAttribute('type') == 'radio', "Passed!" );
    ok( inputList[index].getAttribute('name') == 'modificationDisplayedVersion', "Passed!" );
    ok( inputList[index].getAttribute('value') == (modifiedVersion - 1 + index), "Passed!" );
  }
});
