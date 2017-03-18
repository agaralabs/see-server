#!/bin/bash

SRCDIR=$(dirname $(cd ${0%/*} 2>>/dev/null ; echo `pwd`/${0##*/})) 
PROJECTDIR="${SRCDIR}/.."

SERVERDIR="${PROJECTDIR}/dashboard/server"
CLIENTDIR="${PROJECTDIR}/dashboard/client"
DEMODIR="${PROJECTDIR}/demo"
DISTDIR="${PROJECTDIR}/dist"
 
function print_task_name() {
    echo ""
    echo "---"
    echo "[$(date +"%T")] > $1"
}
 
function echo_and_eval() {
    echo "[$(date +"%T")] $ $1"
    eval "${1}"
}
 
set -e
