#!/bin/bash

SRCDIR=$(dirname $(cd ${0%/*} 2>>/dev/null ; echo `pwd`/${0##*/})) 
PROJECTDIR="${SRCDIR}/.."
. ${PROJECTDIR}/.bin/util.sh

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

echo_and_eval "rsync -r --delete --exclude=dist --exclude=node_modules --exclude=README.md --exclude=.* --exclude=tests ${PROJECTDIR}/ ${DISTDIR}"

print_task_name "Build data processor jar"
echo_and_eval "cd ${SERVERDIR}/data-processor"
echo_and_eval "mvn package"

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Build"
echo_and_eval "NODE_ENV=production npm run build"

print_task_name "Build complete"

