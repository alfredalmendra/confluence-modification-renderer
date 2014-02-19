function renderVersion(renderedVersion) {
  $('div').each(function(index, element) {
    var modifAction = $(this).attr('modificationAction');
    var modifVersion = $(this).attr('modificationVersion');
    if( (modifAction == 'add' && modifVersion > renderedVersion)
        || (modifAction == 'delete' && modifVersion <= renderedVersion) ) {
      $(this).attr('renderStyle', 'hidden');
      $(this).attr('hidden', true);
    } else if(modifAction !== undefined && modifVersion !== undefined) {
      $(this).attr('renderStyle', 'visible');
      $(this).attr('hidden', false);
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
    $("body").prepend(toolbarDiv);
  }
}