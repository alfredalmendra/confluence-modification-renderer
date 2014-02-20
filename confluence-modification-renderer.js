function getRadioValue(theRadioGroup) {
  var elements = document.getElementsByName(theRadioGroup);
  for (var index = 0, len = elements.length; index < len; index++) {
    if (elements[index].checked) {
      return elements[index].value;
    }
  }
}
function renderCurrentVersion() {
  renderVersion(getRadioValue('modificationDisplayedVersion'));
}
function renderVersion(renderedVersion) {
  $('div').each(function(index, element) {
    var modifAction = $(this).attr('modificationAction');
    var modifVersion = $(this).attr('modificationVersion');
    var versionCheckbox = document.getElementById('modificationModifiedVersion' + modifVersion);
    if(versionCheckbox != null && versionCheckbox.checked) {
      $(this).attr('renderStyle', 'hightlighted');
      $(this).attr('hidden', false);
      $(this).css('background-color', 'rgb(224, 238, 224)');
      //$(this).css('border-color', 'rgb(48, 187, 48)');
    } else if( (modifAction == 'add' && modifVersion > renderedVersion)
        || (modifAction == 'delete' && modifVersion <= renderedVersion) ) {
      $(this).attr('renderStyle', 'hidden');
      $(this).attr('hidden', true);
      $(this).css('background-color', 'transparent');
      //$(this).css('border-color', '');
    } else if(modifAction !== undefined && modifVersion !== undefined) {
      $(this).attr('renderStyle', 'visible');
      $(this).attr('hidden', false);
      $(this).css('background-color', 'transparent');
      //$(this).css('border-color', '');
    }
  });
}
function renderToolbar() {
  var versionList = [];
  $('div').each(function(index, element) {
    var modifVersion = $(this).attr('modificationVersion');
    if(modifVersion !== undefined && modifVersion != null && modifVersion != '') {
      versionList.push(modifVersion);
    }
  });
  if(versionList.length > 0) {
    versionList = _.uniq(versionList);
    versionList.sort();
    var toolbarDiv = document.createElement('div');
    toolbarDiv.setAttribute('id', 'modificationToolbarDiv');
    toolbarDiv.innerHTML += 'Current version : ';
    var minVersion = versionList[0] - 1;
    var maxVersion = versionList[versionList.length - 1];
    for(var version = minVersion; version <= maxVersion; version++) {
      if(_.contains(versionList, version) || _.contains(versionList, '' + version)) {
        toolbarDiv.innerHTML += '<b>' + version + '</b>';
      } else {
        toolbarDiv.innerHTML += version;
      }
      var input = document.createElement('input')
      input.setAttribute('type', 'radio');
      input.setAttribute('name', 'modificationDisplayedVersion');
      input.setAttribute('value', version);
      input.setAttribute('onclick', 'renderVersion(' + version + ')');
      toolbarDiv.appendChild(input);
    }
    toolbarDiv.innerHTML += ' - Highlight modifications : ';
    for(var index = 0; index < versionList.length; index++) {
      toolbarDiv.innerHTML += versionList[index];
      var input = document.createElement('input')
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', 'modificationModifiedVersion' + versionList[index]);
      input.setAttribute('name', 'modificationModifiedVersion');
      input.setAttribute('value', versionList[index]);
      input.setAttribute('onclick', 'renderCurrentVersion()');
      toolbarDiv.appendChild(input);
    }
    $("body").prepend(toolbarDiv);
  }
}