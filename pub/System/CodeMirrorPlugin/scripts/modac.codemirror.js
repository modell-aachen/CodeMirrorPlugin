(function($) {
  $(document).ready( function() {
    var $topic = $('#topic');
    if ( $topic.length === 0 ) {
      return;
    }

    var states = {
      // The start state contains the rules that are intially used
      start: [
        {regex: /%\{/, token: "comment", next: "comment"},
        {regex: /^(?:\s{3}\*\s(Set|Local)\s)/, token: "set", next: "set"},
        {regex: /(Set|Local).+/, token: "set-invalid"},
        {regex: /\*[^\s].*[^\s]\*/, token: "bold"},
        {regex: /_{2}[^\s].*[^\s]_{2}/, token: "bold-italic"},
        {regex: /={2}[^\s].*[^\s]={2}/, token: "bold-fixed"},
        {regex: /_[^\s].*[^\s]_/, token: "italic"},
        {regex: /={2}[^\s].*[^\s]={2}/, token: "fixed"},
        {regex: /^---\+{1,6}(!!)?\s.*/, token: "heading"},
        {regex: /^---\+{6}\++(!!)?\s.*/, token: "invalid-heading"},
        {regex: /^(\s{3})+\*\s.*/, token: "bullet-list"},
        {regex: /^(\s{3})+[1aAiI]\.?\s.*/, token: "numbered-list"},
        {regex: /^(\s{3})+\$\s.*/, token: "definition-list"},
        {regex: /%[A-Z]+%(\.[A-Z].*)+/, token: "link"},
        {regex: /\[\[.*\]\]/, token: "wiki-link"},
        {regex: /(?:%AQUA%)/, token: "color-aqua", next: "aqua"},
        {regex: /(?:%BLACK%)/, token: "color-black", next: "black"},
        {regex: /(?:%BLUE%)/, token: "color-blue", next: "blue"},
        {regex: /(?:%BROWN%)/, token: "color-brown", next: "brown"},
        {regex: /(?:%GRAY%)/, token: "color-gray", next: "gray"},
        {regex: /(?:%GREEN%)/, token: "color-green", next: "green"},
        {regex: /(?:%LIME%)/, token: "color-lime", next: "lime"},
        {regex: /(?:%MAROON%)/, token: "color-maroon", next: "maroon"},
        {regex: /(?:%NAVY%)/, token: "color-navy", next: "navy"},
        {regex: /(?:%OLIVE%)/, token: "color-olive", next: "olive"},
        {regex: /(?:%ORANGE%)/, token: "color-orange", next: "orange"},
        {regex: /(?:%PINK%)/, token: "color-pink", next: "pink"},
        {regex: /(?:%PURPLE%)/, token: "color-purple", next: "purple"},
        {regex: /(?:%RED%)/, token: "color-red", next: "red"},
        {regex: /(?:%SILVER%)/, token: "color-silver", next: "silver"},
        {regex: /(?:%TEAL%)/, token: "color-teal", next: "teal"},
        {regex: /(?:%WHITE%)/, token: "color-white", next: "white"},
        {regex: /(?:%YELLOW%)/, token: "color-yellow", next: "yellow"},
        {regex: /(?:%TMPL:)/, token: "tmpl", next: "tmpl"},
        {regex: /^#.*/, token: "anchor"},
        {regex: /%[A-Z]+/, token: "macro", next: "macro"},
        {regex: /^---/, token: "hr"},
        {regex: /\|.+\|/, token: "table"},
        {regex: /\|.+\\/, token: "table-split"},
        {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
         token: "number"},
        {regex: /[a-z$][\w$]*/, token: "variable"},
        {regex: /</, token: "tag", mode: {spec: "html", end: />/}}
      ],
      set: [
        {regex: /[^\s=]+/, token: "set-other"},
        {regex: /=/, token: "set-assign", next: "start"},
      ],
      tmpl: [
        {regex: /\}%/, token: "tmpl", next: "start"},
        {regex: /DEF\{/, token: "tmpl", next: "tmpl"},
        {regex: /END%/, token: "tmpl", next: "start"},
        {regex: /PREV%/, token: "tmpl", next: "start"},
        {regex: /P\{/, token: "tmpl", next: "tmpl"},
        {regex: /INCLUDE\{/, token: "tmpl", next: "tmpl"},
        {regex: /".+"/, token: "string", next: "tmpl"},
        {regex: /.+(?==")/, token: "parameter"}
      ],
      macro: [
        {regex: /\{/, token: "macro"},
        {regex: /"[^"]*"/, token: "string"},
        {regex: /[^"]+(?==")/, token: "parameter"},
        {regex: /\}%/, token: "macro", next: "start"},
        {regex: /(?:%)/, token: "macro", next: "start"}
      ],
      comment: [
        {regex: /.*?}%/, token: "comment", next: "start"},
        {regex: /.*/, token: "comment"}
      ],
      aqua: [
        {regex: /.*%ENDCOLOR%/, token: "color-aqua", next: "start"},
        {regex: /.*/, token: "color-aqua"}
      ],
      black: [
        {regex: /.*%ENDCOLOR%/, token: "color-black", next: "start"},
        {regex: /.*/, token: "color-black"}
      ],
      blue: [
        {regex: /.*%ENDCOLOR%/, token: "color-blue", next: "start"},
        {regex: /.*/, token: "color-blue"}
      ],
      brown: [
        {regex: /.*%ENDCOLOR%/, token: "color-brown", next: "start"},
        {regex: /.*/, token: "color-brown"}
      ],
      gray: [
        {regex: /.*%ENDCOLOR%/, token: "color-gray", next: "start"},
        {regex: /.*/, token: "color-gray"}
      ],
      green: [
        {regex: /.*%ENDCOLOR%/, token: "color-green", next: "start"},
        {regex: /.*/, token: "color-green"}
      ],
      lime: [
        {regex: /.*%ENDCOLOR%/, token: "color-lime", next: "start"},
        {regex: /.*/, token: "color-lime"}
      ],
      maroon: [
        {regex: /.*%ENDCOLOR%/, token: "color-maroon", next: "start"},
        {regex: /.*/, token: "color-maroon"}
      ],
      navy: [
        {regex: /.*%ENDCOLOR%/, token: "color-navy", next: "start"},
        {regex: /.*/, token: "color-navy"}
      ],
      olive: [
        {regex: /.*%ENDCOLOR%/, token: "color-olive", next: "start"},
        {regex: /.*/, token: "color-olive"}
      ],
      orange: [
        {regex: /.*%ENDCOLOR%/, token: "color-orange", next: "start"},
        {regex: /.*/, token: "color-orange"}
      ],
      pink: [
        {regex: /.*%ENDCOLOR%/, token: "color-pink", next: "start"},
        {regex: /.*/, token: "color-pink"}
      ],
      purple: [
        {regex: /.*%ENDCOLOR%/, token: "color-purple", next: "start"},
        {regex: /.*/, token: "color-purple"}
      ],
      red: [
        {regex: /.*%ENDCOLOR%/, token: "color-red", next: "start"},
        {regex: /.*/, token: "color-red"}
      ],
      silver: [
        {regex: /.*%ENDCOLOR%/, token: "color-silver", next: "start"},
        {regex: /.*/, token: "color-silver"}
      ],
      teal: [
        {regex: /.*%ENDCOLOR%/, token: "color-teal", next: "start"},
        {regex: /.*/, token: "color-teal"}
      ],
      white: [
        {regex: /.*%ENDCOLOR%/, token: "color-white", next: "start"},
        {regex: /.*/, token: "color-white"}
      ],
      yellow: [
        {regex: /.*%ENDCOLOR%/, token: "color-yellow", next: "start"},
        {regex: /.*/, token: "color-yellow"}
      ]
    };

    CodeMirror.defineSimpleMode( 'tml', states );
    CodeMirror.defineMIME( 'text/tml', 'tml' );

    CodeMirror.defineMode( "tmloverlay", function( config, parserConfig ) {
      var tml = CodeMirror.getMode( config, "text/tml" );
      var html = CodeMirror.getMode( config, "text/html" );
      return CodeMirror.overlayMode( html, tml, true );
    });

    var whitespaceOverlay = {
      token: function( stream ) {
        if ( stream.eatWhile( /\S/ ) ) {
          return null;
        }

        stream.next();
        return "whitespace";
      }
    };

    var opts = {
      theme: 'modac',
      lineNumbers: true,
      lineWrapping: true,
      styleSelectedText: true,
      styleActiveLine: true,
      showTrailingspace: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      autoCloseTags: true,
      matchTags: true,
      mode: 'tmloverlay',
      profile: 'xhtml',
      rulers: [80,120],
      vimMode: false,
      flattenSpans : false,
      extraKeys: {"Ctrl-Space": "autocomplete"},
      highlightSelectionMatches: {showToken: /\w/}
    };

    var cm = CodeMirror.fromTextArea( $topic[0], opts );
    cm.addOverlay( whitespaceOverlay );
  });
})(jQuery);
