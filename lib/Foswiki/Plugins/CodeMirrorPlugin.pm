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

  my $context = Foswiki::Func::getContext();
  return 1 unless $context->{edit};

  my $query = Foswiki::Func::getRequestObject();
  my $param = $query->{param};
  return 1 unless $param;

  my $nowysiwyg = $param->{nowysiwyg};
  return 1 unless $nowysiwyg || @$nowysiwyg[0] ne 1;

  my $nocm = $param->{nocm};
  return 1 if $nocm && @$nocm[0] eq 1;

  my $pref = Foswiki::Func::getPreferencesValue( "NOCM" );
  return 1 if $pref;

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
<script type="text/javascript" src="$plugin/bower/codemirror/addon/display/rulers.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/hint/show-hint.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/addon/hint/anyword-hint.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror/keymap/vim.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/bower/codemirror-emmet/dist/emmet.js?version=$RELEASE"></script>
SCRIPT
  } else {
    $cm = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/codemirror.min.js?version=$RELEASE"></script>
SCRIPT
  }

  my $script = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/modac.codemirror$suffix.js?version=$RELEASE"></script>
SCRIPT

  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::SCRIPTS', $cm );
  Foswiki::Func::addToZone( 'head', 'CODEMIRRORPLUGIN::STYLES', $style );
  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::CODEMIRROR', $script, 'CODEMIRRORPLUGIN::SCRIPTS' );

  return 1;
}

1;

__END__
Foswiki - The Free and Open Source Wiki, http://foswiki.org/

Author: Sven Meyer <meyer@modell-aachen.de>

Copyright (C) 2008-2015 Foswiki Contributors. Foswiki Contributors
are listed in the AUTHORS file in the root of this distribution.
NOTE: Please extend that file, not this notice.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version. For
more details read LICENSE in the root of this distribution.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

As per the GPL, removal of this notice is prohibited.
