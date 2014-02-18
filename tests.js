var div;
module( "Div rendering", {
  setup: function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  },
  teardown: function() {
    div.remove();
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
  var toolbar = renderToolbar();
  ok( toolbar.isEmpty() == true, "Passed!" );
});
