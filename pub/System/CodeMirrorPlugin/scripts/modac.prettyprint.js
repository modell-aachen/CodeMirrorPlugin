CodeMirror.prototype.prettyPrint = function( options ) {
  var defaults = {
    selectionOnly: true,
    indent_size: 2,
    brace_style: 'expand'
  };

  $.extend( defaults, options );
  var selectionOnly = defaults.selectionOnly;

  var ugly;
  if ( selectionOnly ) {
    ugly = this.getSelection();
  } else {
    ugly = this.getValue();
  }

  if ( typeof ugly !== 'undefined ' ) {
    var pretty = style_html( ugly, defaults );
    if ( selectionOnly ) {
      this.replaceSelection( pretty, ugly );
    } else {
      this.setValue( pretty );
    }
  }
};
