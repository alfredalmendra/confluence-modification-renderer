var actions, versions, teams;
module( "Paragraph rendering", {
  setup: function() {
    actions = [ null, STR.ADD, STR.DELETE ];
    versions = [ null, 3, 4, 5 ];
    teams = [ null, STR.SPEC, STR.DEV, STR.RECETTE ];
    for(var indexAction = 0; indexAction < actions.length; indexAction++) {
      for(var indexVersion = 0; indexVersion < versions.length; indexVersion++) {
        for(var indexTeam = 0; indexTeam < teams.length; indexTeam++) {
          addNewParagraph(actions[indexAction], versions[indexVersion], teams[indexTeam]);
        }
      }
    }
  },
  teardown: function() {
    for(var indexAction = 0; indexAction < actions.length; indexAction++) {
      for(var indexVersion = 0; indexVersion < versions.length; indexVersion++) {
        for(var indexTeam = 0; indexTeam < teams.length; indexTeam++) {
          var id = getId(actions[indexAction], versions[indexVersion], teams[indexTeam]);
          var element = document.getElementById('div' + id);
          if(element != null) { element.remove(); }
          element = document.getElementById('p' + id);
          if(element != null) { element.remove(); }
        }
      }
    }
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
function getId(modificationAction, modificationVersion, modificationTeam) {
  return getEmptyIfNull(modificationAction) + getEmptyIfNull(modificationVersion) + getEmptyIfNull(modificationTeam);
}
function addNewParagraph(modificationAction, modificationVersion, modificationTeam) {
  var id = getId(modificationAction, modificationVersion, modificationTeam);
  var newDiv = document.createElement('div');
  newDiv.setAttribute('id', 'div' + id);
  newDiv.setAttribute(STR.TYPE, STR.PARAGRAPH);
  if(modificationAction != null) { newDiv.setAttribute(STR.ACTION, modificationAction); }
  if(modificationVersion != null) { newDiv.setAttribute(STR.VERSION, modificationVersion); }
  if(modificationTeam != null) { newDiv.setAttribute(STR.TEAM, modificationTeam); }
  document.body.appendChild(newDiv);
  
  var newParagraph = document.createElement('p');
  newParagraph.setAttribute('id', 'p' + id);
  document.body.appendChild(newParagraph);
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
test( "Paragraph without specific attributes is always visible", function() {
  renderToolbar();
  var pEmpty = document.getElementById('p' + getId(null, null, null));
  var divEmpty = document.getElementById('div' + getId(null, null, null));
  clickOn(STR.DISPLAYED_VERSION, 4);
  verifyRenderingAndColors(pEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.MODIFIED_VERSION, 3);
  clickOn(STR.MODIFIED_VERSION, 4);
  clickOn(STR.MODIFIED_VERSION, 5);
  verifyRenderingAndColors(pEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.AUTHOR_TEAM, 'spec');
  clickOn(STR.AUTHOR_TEAM, 'dev');
  clickOn(STR.AUTHOR_TEAM, 'recette');
  verifyRenderingAndColors(pEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
});
test( "Paragraph should be highlighted, but associated div remains unchanged", function() {
  renderToolbar();
  var pDelete3Spec = document.getElementById('p' + getId(STR.DELETE, 3, STR.SPEC));
  var divDelete3Spec = document.getElementById('div' + getId(STR.DELETE, 3, STR.SPEC));
  clickOn(STR.DISPLAYED_VERSION, 4);
  verifyRenderingAndColors(pDelete3Spec, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(pDelete3Spec, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.AUTHOR_TEAM, 'spec');
  verifyRenderingAndColors(pDelete3Spec, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_DELETE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(pDelete3Spec, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(pDelete3Spec, false, STR.HIGHLIGHTED, STR.BACKGROUND_COLOR_DELETE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.AUTHOR_TEAM, 'spec');
  verifyRenderingAndColors(pDelete3Spec, true, STR.HIDDEN, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divDelete3Spec, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
});
