#!/usr/bin/perl -w
use strict;

BEGIN {unshift @INC, split( /:/, $ENV{FOSWIKI_LIBS} );}

use Foswiki::Contrib::Build;

package CodeMirrorPluginBuild;
use Foswiki::Contrib::Build;
our @ISA = qw( Foswiki::Contrib::Build );

sub new {
    my $class = shift;
    return bless( $class->SUPER::new("CodeMirrorPlugin"), $class );
}

sub target_build {
    my $this = shift;

    $this->SUPER::target_build();
    # Do other build stuff here
}

package main;
my $build = new CodeMirrorPluginBuild();
$build->build( $build->{target} );

