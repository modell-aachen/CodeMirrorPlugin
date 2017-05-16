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

  my $plugin = '%PUBURLPATH%/%SYSTEMWEB%/CodeMirrorPlugin';
  my $style = <<STYLE;
<link rel="stylesheet" type="text/css" media="all" href="$plugin/styles/modac.codemirror.min.css?version=$RELEASE" />
STYLE

  my $cm = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/codemirror.min.js?version=$RELEASE"></script>
SCRIPT

  my $script = <<SCRIPT;
<script type="text/javascript" src="$plugin/scripts/modac.prettyprint.min.js?version=$RELEASE"></script>
<script type="text/javascript" src="$plugin/scripts/modac.codemirror.min.js?version=$RELEASE"></script>
SCRIPT

  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::SCRIPTS', $cm, 'JQUERYPLUGIN' );
  Foswiki::Func::addToZone( 'head', 'CODEMIRRORPLUGIN::STYLES', $style );
  Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::CODEMIRROR', $script, 'CODEMIRRORPLUGIN::SCRIPTS' );

  if ( $raw ) {
    my $inline = <<INLINE;
(function(\$) {
  \$(document).ready( function() {
    if ( CodeMirror && CodeMirror.currentInstance ) {
      CodeMirror.currentInstance.setOption('readOnly', true);
    }
  });
})(jQuery);
INLINE

    if ( Foswiki::Func::getContext()->{SafeWikiSignable} ) {
      Foswiki::Plugins::SafeWikiPlugin::Signatures::permitInlineCode($inline);
    }

    Foswiki::Func::addToZone( 'script', 'CODEMIRRORPLUGIN::CODEMIRROR::READONLY', <<SCRIPT, 'CODEMIRRORPLUGIN::CODEMIRROR' );
<literal>
<script>
$inline
</script>
</literal>
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
