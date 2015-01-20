(function($) {
  $(document).ready( function() {
    var $topic = $('#topic');
    if ( $topic.length === 0 ) {
      return;
    }

    var states = {
      start: [
        {regex: /%\{/, token: "comment", next: "comment"},
        {regex: /^(?:\s{3}\*\s(Set|Local)\s)/, token: "set", next: "set"},
        {regex: /(Set|Local).+/, token: "set-invalid"},
        {regex: /\*(?!\s)[^\*]+[^\s]\*/, token: "bold"},
        {regex: /_{2}[^\s].*[^\s]_{2}/, token: "bold-italic"},
        {regex: /={2}[^\s].*[^\s]={2}/, token: "bold-fixed"},
        {regex: /_[^\s].*[^\s]_/, token: "italic"},
        {regex: /={2}[^\s].*[^\s]={2}/, token: "fixed"},
        {regex: /^---\+{1,6}(!!)?\s.*/, token: "heading"},
        {regex: /^---\+{6}\++(!!)?\s.*/, token: "invalid-heading"},
        {regex: /^(\s{3})+\*\s/, token: "bullet-list", next: "start"},
        {regex: /^(\s{3})+[1aAiI]\.?\s/, token: "numbered-list", next: "start"},
        {regex: /^(\s{3})+\$\s/, token: "definition-list", next: "start"},
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
        {regex: /\|(?=[^\|\\]*[\|\\])/, token: "table", push: "table"},
        {regex: /(?=[^\|]*)\||\\/, token: "table"},
        {regex: /"(?:[^\\]|\\.)*?"/, token: "string"},
        {regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
        {regex: /[a-z$][\w$]*/, token: "variable"}
      ],
      table: [
        {regex: /\||\\/, pop: true, token: "table2", next: "start"},
        {next: "start"}
      ],
      set: [
        {regex: /[^\s=]+/, token: "set-param"},
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
      fullScreen: false,
      extraKeys: {
        "Ctrl-Space": "autocomplete",
        "Ctrl-F": "find",
        "Shift-Ctrl-F": "clearSearch",
        "Shift-F3": "findPrev",
        "F3": "findNext",
        "Ctrl-G": "gotoLine",
        "Ctrl-H": "replace",
        "Shift-Ctrl-H": "replaceAll",
        "Ctrl-P": function( editor ) {
          editor.prettyPrint();
        },
        "F11": function( editor ) {
          editor.setOption( "fullScreen" , !editor.getOption("fullScreen") );
        },
        "Esc": function( editor ) {
          if ( editor.getOption( "fullScreen" ) ) {
            editor.setOption( "fullScreen", false );
          }
        }
      },
      highlightSelectionMatches: {showToken: /\w/}
    };

    CodeMirror.currentInstance = CodeMirror.fromTextArea( $topic[0], opts );
    var cm = CodeMirror.currentInstance;
    cm.addOverlay( whitespaceOverlay );

    var parent = document.getElementById('cke-toolbar-container');
    if ( !parent ) {
      return;
    }

    var panel = document.createElement("div");
    panel.className = "CodeMirror-toolbar top";

    var names = ['undo', 'redo', 'find', 'replace', 'help'];
    var funcs = {
      undo: function() { CodeMirror.currentInstance.execCommand('undo');},
      redo: function() { CodeMirror.currentInstance.execCommand('redo'); },
      find: function() { CodeMirror.currentInstance.execCommand('find'); },
      replace: function() { CodeMirror.currentInstance.execCommand('replace'); },
      help: function() {
        var p = foswiki.preferences;
        var url = [
          p.SCRIPTURL,
          '/view',
          p.SCRIPTSUFFIX,
          '/',
          p.SYSTEMWEB,
          '/CodeMirrorPlugin#Editor_Shortcuts'
        ];

        window.open( url.join(''), '_blank' );
      }
    };

    var clickHandler = function() {
      var func = this.getAttribute('data-func');
      funcs[func].call();
      return false;
    };

    for( var i in names ) {
      var name = names[i];
      var button = panel.appendChild( document.createElement('a') );
      button.className = 'cm-btn btn-base btn-' + name;
      button.setAttribute( 'data-func', name );
      button.setAttribute( 'title', name );
      CodeMirror.on( button, 'click', clickHandler );
    }

    // cm.addPanel( panel, {position: 'top'} );
    parent.appendChild( panel );
  });
})(jQuery);
