STR = {
  get SPEC() { return 'spec'; },
  get DEV() { return 'dev'; },
  get RECETTE() { return 'recette'; },
  get TITLE_NO_MODIFICATION() { return '(Aucune modification)'; },
  get TITLE_CURRENT_VERSION() { return 'Itération courante'; },
  get TITLE_HIGHLIGHT_MODIFICATIONS() { return 'Modifications'; },
  get TITLE_TEAM() { return 'Equipes'; },
  get ADD() { return 'ajout'; },
  get DELETE() { return 'suppression'; },
  get TOOLBAR() { return 'modificationToolbarDiv'; },
  get DISPLAYED_VERSION() { return 'modificationDisplayedVersion'; },
  get DISPLAYED_VERSION_NOT_SET() { return -1; },
  get MODIFIED_VERSION() { return 'modificationModifiedVersion'; },
  get AUTHOR_TEAM() { return 'modificationAuthorTeam'; },
  get ACTION() { return 'typemodification'; },
  get VERSION() { return 'iteration'; },
  get TEAM() { return 'equipe'; },
  get TYPE() { return 'typemacro'; },
  get PARAGRAPH() { return 'paragraph'; },
  get TABLE_LINE() { return 'ligne_tableau'; },
  get TABLE_COLUMN() { return 'colonne_tableau'; },
  get HIDDEN() { return 'hidden'; },
  get VISIBLE() { return 'visible'; },
  get HIGHLIGHTED() { return 'hightlighted'; },
  get BACKGROUND_COLOR_NONE() { return 'transparent'; },
  get BACKGROUND_COLOR_ADD() { return 'rgb(200, 240, 200)'; },
  get BACKGROUND_COLOR_DELETE() { return 'rgb(240, 200, 200)'; },
  get BACKGROUND_COLOR_OTHER() { return 'rgb(200, 200, 240)'; }
}
function getRadioValue(theRadioGroup) {
  var elements = document.getElementsByName(theRadioGroup);
  for (var index = 0, len = elements.length; index < len; index++) {
    if (elements[index].checked) {
      return elements[index].value;
    }
  }
  return STR.DISPLAYED_VERSION_NOT_SET;
}
function renderCurrentVersion() {
  renderVersion(getRadioValue(STR.DISPLAYED_VERSION));
}
function renderVersion(renderedVersion) {
  if(renderedVersion == null || renderedVersion === undefined) renderedVersion = STR.DISPLAYED_VERSION_NOT_SET;
  $('div').each(function(index, element) {
    var modifAction = $(this).attr(STR.ACTION);
    var modifVersion = $(this).attr(STR.VERSION);
    var modifTeam = $(this).attr(STR.TEAM);
    var modifType = $(this).attr(STR.TYPE);
    
    var versionCheckbox = document.getElementById(STR.MODIFIED_VERSION + modifVersion);
    var teamCheckbox = document.getElementById(STR.AUTHOR_TEAM + modifTeam);
    var isParagraph = (modifType == STR.PARAGRAPH);
    var isTableLine = (modifType == STR.TABLE_LINE);
    
    var willBeHightlighted = (modifVersion == null || (versionCheckbox != null && versionCheckbox.checked));
    willBeHightlighted = willBeHightlighted && (modifTeam == null || (teamCheckbox != null && teamCheckbox.checked));
    willBeHightlighted = willBeHightlighted && (modifVersion != null || modifTeam != null);
    
    var willBeHidden = (renderedVersion != STR.DISPLAYED_VERSION_NOT_SET && modifAction == STR.ADD && modifVersion > renderedVersion)
                       || (modifAction == STR.DELETE && (renderedVersion == STR.DISPLAYED_VERSION_NOT_SET || modifVersion <= renderedVersion));
    
    var willBeShown = !willBeHightlighted && !willBeHidden && (modifVersion != null || modifTeam != null);
    
    var modifiedElement = $(this);
    if(isParagraph) {
      modifiedElement = modifiedElement.next();
      if(modifiedElement === undefined || modifiedElement == null || modifiedElement.get(0).tagName != 'P') {
        // TODO : highlight error ?
        return ;
      }
    } else if(isTableLine) {
      var td = modifiedElement.parent();
      if(td.get(0).tagName == 'P') {
        td = td.parent();
      }
      var tr = td.parent();
      modifiedElement = tr;
      if(modifiedElement === undefined || modifiedElement == null || modifiedElement.get(0).tagName != 'TR') {
        // TODO : highlight error ?
        return ;
      }
    }
    
    if(willBeHightlighted) {
      modifiedElement.attr('renderStyle', STR.HIGHLIGHTED);
      modifiedElement.attr('hidden', false);
      var formatStyle = new String(modifAction).replace(STR.ADD,'success').replace(STR.DELETE,'problem');
      modifiedElement.attr('class', 'aui-message ' + $(formatStyle) + ' shadowed information-macro');
      modifiedElement.css('display', 'block');
      if(modifAction == STR.ADD) {
        modifiedElement.css('background-color', STR.BACKGROUND_COLOR_ADD);
        //modifiedElement.css('border-color', 'rgb(48, 187, 48)');
      } else if(modifAction == STR.DELETE) {
        modifiedElement.css('background-color', STR.BACKGROUND_COLOR_DELETE);
      } else {
        modifiedElement.css('background-color', STR.BACKGROUND_COLOR_OTHER);
      }
    } else if(willBeHidden) {
      modifiedElement.attr('renderStyle', STR.HIDDEN);
      modifiedElement.attr('hidden', true);
      modifiedElement.attr('class', "");
      modifiedElement.css('display', 'none');
      modifiedElement.css('background-color', STR.BACKGROUND_COLOR_NONE);
      //modifiedElement.css('border-color', '');
    } else if(willBeShown) {
      modifiedElement.attr('renderStyle', STR.VISIBLE);
      modifiedElement.attr('hidden', false);
      modifiedElement.attr('class', "");
      modifiedElement.css('display', 'block');
      modifiedElement.css('background-color', STR.BACKGROUND_COLOR_NONE);
      //modifiedElement.css('border-color', '');
    }
    
    modifiedElement.children().each(function() {
      if($(this).prop("tagName") == 'P') {
        if($(this).prop("className") == 'title') {
          $(this).css('display', willBeHightlighted ? 'block' : 'none');
        }
      }
    });
  });
}
function createInputElement(type, name, value, onclick) {
  var input = document.createElement('input')
  input.setAttribute('type', type);
  input.setAttribute('id', name + value);
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.setAttribute('onclick', onclick);
  return input;
}
function createToolbarDiv() {
  var toolbarDiv = document.createElement('div');
  toolbarDiv.setAttribute('id', STR.TOOLBAR);
  return toolbarDiv;
}
function renderToolbar() {
  var versionList = [];
  var teamList = [];
  $('div').each(function(index, element) {
    var modifVersion = $(this).attr(STR.VERSION);
    if(modifVersion !== undefined && modifVersion != null && modifVersion != '') {
      versionList.push(modifVersion);
    }
    var modifTeam = $(this).attr(STR.TEAM);
    if(modifTeam !== undefined && modifTeam != null && modifTeam != '') {
      teamList.push(modifTeam);
    }
  });
  if(versionList.length > 0) {
    versionList = _.uniq(versionList);
    versionList.sort(function(a,b){return a - b});
    var toolbarDiv = createToolbarDiv();
    toolbarDiv.innerHTML += STR.TITLE_CURRENT_VERSION + ' : ';
    var minVersion = versionList[0] - 1;
    var maxVersion = versionList[versionList.length - 1];
    for(var version = minVersion; version <= maxVersion; version++) {
      if(_.contains(versionList, version) || _.contains(versionList, '' + version)) {
        toolbarDiv.innerHTML += '<b>' + version + '</b>';
      } else {
        toolbarDiv.innerHTML += version;
      }
      toolbarDiv.appendChild(createInputElement('radio', STR.DISPLAYED_VERSION, version, 'renderVersion(' + version + ')'));
    }
    toolbarDiv.innerHTML += ' - ' + STR.TITLE_HIGHLIGHT_MODIFICATIONS + ' : ';
    for(var index = 0; index < versionList.length; index++) {
      toolbarDiv.innerHTML += versionList[index];
      toolbarDiv.appendChild(createInputElement('checkbox', STR.MODIFIED_VERSION, versionList[index], 'renderCurrentVersion()'));
    }
  }
  if(teamList.length > 0) {
    if(toolbarDiv === undefined || toolbarDiv == null) {
      toolbarDiv = createToolbarDiv();
    }
    teamList = _.uniq(teamList);
    toolbarDiv.innerHTML += ' - ' + STR.TITLE_TEAM + ' : ';
    for(var index = 0; index < teamList.length; index++) {
      toolbarDiv.innerHTML += teamList[index];
      toolbarDiv.appendChild(createInputElement('checkbox', STR.AUTHOR_TEAM, teamList[index], 'renderCurrentVersion()'));
    }
  }
  if(toolbarDiv == null) {
    toolbarDiv = createToolbarDiv();
    toolbarDiv.innerHTML += STR.TITLE_NO_MODIFICATION;
  }
  $('.page-metadata').prepend(toolbarDiv);
}