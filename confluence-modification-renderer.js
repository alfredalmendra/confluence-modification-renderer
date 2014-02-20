STR = {
  get TITLE_CURRENT_VERSION() { return 'Current version'; },
  get TITLE_HIGHLIGHT_MODIFICATIONS() { return 'Highlight modifications'; },
  get ADD() { return 'add'; },
  get DELETE() { return 'delete'; },
  get TOOLBAR() { return 'modificationToolbarDiv'; },
  get DISPLAYED_VERSION() { return 'modificationDisplayedVersion'; },
  get MODIFIED_VERSION() { return 'modificationModifiedVersion'; },
  get ACTION() { return 'modificationAction'; },
  get VERSION() { return 'modificationVersion'; },
  get HIDDEN() { return 'hidden'; },
  get VISIBLE() { return 'visible'; },
  get HIGHLIGHTED() { return 'hightlighted'; },
  get BACKGROUND_COLOR_NONE() { return 'transparent'; },
  get BACKGROUND_COLOR_ADD() { return 'rgb(224, 238, 224)'; },
  get BACKGROUND_COLOR_DELETE() { return 'rgb(238, 224, 224)'; },
  get BACKGROUND_COLOR_OTHER() { return 'rgb(224, 224, 238)'; }
}
function getRadioValue(theRadioGroup) {
  var elements = document.getElementsByName(theRadioGroup);
  for (var index = 0, len = elements.length; index < len; index++) {
    if (elements[index].checked) {
      return elements[index].value;
    }
  }
}
function renderCurrentVersion() {
  renderVersion(getRadioValue(STR.DISPLAYED_VERSION));
}
function renderVersion(renderedVersion) {
  $('div').each(function(index, element) {
    var modifAction = $(this).attr(STR.ACTION);
    var modifVersion = $(this).attr(STR.VERSION);
    var versionCheckbox = document.getElementById(STR.MODIFIED_VERSION + modifVersion);
    if(versionCheckbox != null && versionCheckbox.checked) {
      $(this).attr('renderStyle', STR.HIGHLIGHTED);
      $(this).attr('hidden', false);
      if(modifAction == STR.ADD) {
        $(this).css('background-color', STR.BACKGROUND_COLOR_ADD);
        //$(this).css('border-color', 'rgb(48, 187, 48)');
      } else if(modifAction == STR.DELETE) {
        $(this).css('background-color', STR.BACKGROUND_COLOR_DELETE);
      } else {
        $(this).css('background-color', STR.BACKGROUND_COLOR_OTHER);
      }
    } else if( (modifAction == STR.ADD && modifVersion > renderedVersion)
        || (modifAction == STR.DELETE && modifVersion <= renderedVersion) ) {
      $(this).attr('renderStyle', STR.HIDDEN);
      $(this).attr('hidden', true);
      $(this).css('background-color', 'transparent');
      //$(this).css('border-color', '');
    } else if(modifAction !== undefined && modifVersion !== undefined) {
      $(this).attr('renderStyle', STR.VISIBLE);
      $(this).attr('hidden', false);
      $(this).css('background-color', 'transparent');
      //$(this).css('border-color', '');
    }
  });
}
function createInput(type, name, value, onclick) {
  var input = document.createElement('input')
  input.setAttribute('type', type);
  input.setAttribute('id', name + value);
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.setAttribute('onclick', onclick);
  return input;
}
function renderToolbar() {
  var versionList = [];
  $('div').each(function(index, element) {
    var modifVersion = $(this).attr(STR.VERSION);
    if(modifVersion !== undefined && modifVersion != null && modifVersion != '') {
      versionList.push(modifVersion);
    }
  });
  if(versionList.length > 0) {
    versionList = _.uniq(versionList);
    versionList.sort();
    var toolbarDiv = document.createElement('div');
    toolbarDiv.setAttribute('id', STR.TOOLBAR);
    toolbarDiv.innerHTML += STR.TITLE_CURRENT_VERSION + ' : ';
    var minVersion = versionList[0] - 1;
    var maxVersion = versionList[versionList.length - 1];
    for(var version = minVersion; version <= maxVersion; version++) {
      if(_.contains(versionList, version) || _.contains(versionList, '' + version)) {
        toolbarDiv.innerHTML += '<b>' + version + '</b>';
      } else {
        toolbarDiv.innerHTML += version;
      }
      toolbarDiv.appendChild(createInput('radio', STR.DISPLAYED_VERSION, version, 'renderVersion(' + version + ')'));
    }
    toolbarDiv.innerHTML += ' - ' + STR.TITLE_HIGHLIGHT_MODIFICATIONS + ' : ';
    for(var index = 0; index < versionList.length; index++) {
      toolbarDiv.innerHTML += versionList[index];
      toolbarDiv.appendChild(createInput('checkbox', STR.MODIFIED_VERSION, versionList[index], 'renderCurrentVersion()'));
    }
    $("body").prepend(toolbarDiv);
  }
}