package Foswiki::Plugins::CodeMirrorPlugin;

use strict;
use warnings;

use Foswiki::Func ();
use Foswiki::Plugins ();

use version;
our $VERSION = version->declare( '1.0.0' );
our $RELEASE = '1.0.0';
our $NO_PREFS_IN_TOPIC = 1;
our $SHORTDESCRIPTION = 'Syntax highlighting for Foswiki';

sub initPlugin {
  my ( $topic, $web, $user, $installWeb ) = @_;

  if ( $Foswiki::Plugins::VERSION < 2.0 ) {
      Foswiki::Func::writeWarning( 'Version mismatch between ',
          __PACKAGE__, ' and Plugins.pm' );
      return 0;
  }

  my $ctx = Foswiki::Func::getContext();
  my $query = Foswiki::Func::getRequestObject();
  my $param = $query->{param};

  my $nocm = $param->{nocm} if $param;
  my $pref = Foswiki::Func::getPreferencesValue( "NOCM" );
  if ( $pref || ($nocm && @$nocm[0] eq 1) ) {
    $ctx->{'NOCM'} = 1;
    return 1;
  }

  my $raw = $param->{raw} if $param;
  unless ( $raw ) {
    return 1 unless $ctx->{edit};
    return 1 unless $ctx->{'NOWYSIWYG'};
    return 1 if $ctx->{'WYSIWYG_TEXT'};
  }

  my $debug = $Foswiki::cfg{Plugins}{CodeMirrorPlugin}{Debug} || 0;
  my $suffix = $debug ? '' : '.min';

  my $plugin = '%PUBURLPATH%/%SYSTEMWEB%/CodeMirrorPlugin';
  my $style = <<STYLE;
<link rel="stylesheet" type="text/css" media="all" href="$plugin/styles/modac.codemirror$suffix.css?version=$RELEASE" />
STYLE

  my $cm = '';
  if ( $debug ) {
    $cm = <<SCRIPT;
<script type="text/javascript" src="$plugin/bower/codemirror/lib/codemirror.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/mode/xml/xml.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/mode/javascript/javascript.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/mode/css/css.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/mode/htmlmixed/htmlmixed.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/mode/javascript/javascript.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/selection/active-line.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/selection/mark-selection.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/mode/simple.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/mode/overlay.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/edit/closebrackets.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/edit/matchbrackets.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/edit/closetag.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/edit/matchtags.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/fold/xml-fold.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/display/fullscreen.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/display/panel.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/display/rulers.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/dialog/dialog.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/search/searchcursor.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/search/search.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/search/matchesonscrollbar.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/scroll/annotatescrollbar.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/hint/show-hint.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/hint/anyword-hint.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/keymap/vim.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror-emmet/dist/emmet.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/scripts/html.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/scripts/goto-line.js?version=$RELEASE"></script>
SCRIPT
  } else {
    $cm = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/codemirror.min.js?version=$RELEASE"></script>
SCRIPT
  }

  my $script = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/modac.prettyprint$suffix.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/scripts/modac.codemirror$suffix.js?version=$RELEASE"></script>
SCRIPT

  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::SCRIPTS', $cm );
  Foswiki::Func::addToZone( 'head', 'CODEMIRRORPLUGIN::STYLES', $style );
  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::CODEMIRROR', $script, 'CODEMIRRORPLUGIN::SCRIPTS' );

  if ( $raw ) {
    Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::CODEMIRROR::READONLY', <<SCRIPT, 'CODEMIRRORPLUGIN::CODEMIRROR' );
<script>
(function(\$) {
  \$(document).ready( function() {
    if ( CodeMirror && CodeMirror.currentInstance ) {
      CodeMirror.currentInstance.setOption('readOnly', true);
    }
  });
})(jQuery);
</script>
SCRIPT
  }

  return 1;
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Sven Meyer <meyer@modell-aachen.de>

The MIT License (MIT)

Copyright (c) 2015 Modell Aachen GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
