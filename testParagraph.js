VAL = {
  get SPEC() { return 'spec'; },
  get DEV() { return 'dev'; },
  get RECETTE() { return 'recette'; }
}
var actions, versions, teams;
module( "Paragraph rendering", {
  setup: function() {
    actions = [ null, STR.ADD, STR.DELETE ];
    versions = [ null, 3, 4, 5 ];
    teams = [ null, VAL.SPEC, VAL.DEV, VAL.RECETTE ];
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
          var element = document.getElementById('p' + getId(actions[indexAction], versions[indexVersion], teams[indexTeam]));
          if(element != null) { element.remove(); }
        }
      }
    }
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
  var newParagraph = document.createElement('p');
  var newDiv = document.createElement('div');
  newParagraph.appendChild(newDiv);
  document.body.appendChild(newParagraph);
  var id = getId(modificationAction, modificationVersion, modificationTeam);
  if(modificationAction != null) { newDiv.setAttribute(STR.ACTION, modificationAction); }
  if(modificationVersion != null) { newDiv.setAttribute(STR.VERSION, modificationVersion); }
  if(modificationTeam != null) { newDiv.setAttribute(STR.TEAM, modificationTeam); }
  newDiv.setAttribute(STR.TYPE, STR.PARAGRAPH);
  newDiv.setAttribute('id', 'div' + id);
  newParagraph.setAttribute('id', 'p' + id);
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
test( "Empty paragraph is always visible", function() {
  renderToolbar();
  var pEmpty = document.getElementById('p' + getId(null, null, null));
  var divEmpty = document.getElementById('div' + getId(null, null, null));
  clickOn(STR.DISPLAYED_VERSION, 4);
  verifyRenderingAndColors(pEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  clickOn(STR.MODIFIED_VERSION, 3);
  verifyRenderingAndColors(pEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
  verifyRenderingAndColors(divEmpty, false, STR.VISIBLE, STR.BACKGROUND_COLOR_NONE);
});
