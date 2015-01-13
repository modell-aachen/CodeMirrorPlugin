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

    local $| = 1;
    print "Fetching dependencies:\n";
    print $this->sys_action( qw(npm install) ) . "\n";
    print "Done!\n";

    print "Updating components:\n";
    print $this->sys_action( qw(bower update) ) . "\n";
    print "Done!\n";

    print "Building...\n";
    print $this->sys_action( qw(grunt build) ) . "\n";
    print "Done!\n";
}

package main;
my $build = new CodeMirrorPluginBuild();
$build->build( $build->{target} );

