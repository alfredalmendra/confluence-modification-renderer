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
  return {
    isEmpty: function() {
      return this.length() == 0;
    },
    length: function() {
      return versionList.length;
    },
    versions: function() {
      return versionList;
    }
  };
}