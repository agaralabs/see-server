#!/bin/bash

SRCDIR=$(dirname $(cd ${0%/*} 2>>/dev/null ; echo `pwd`/${0##*/})) 
PROJECTDIR="${SRCDIR}/.."
. ${PROJECTDIR}/.bin/util.sh

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

echo_and_eval "rsync -r --delete \
    --exclude=dist --exclude=node_modules --exclude=*.md --exclude=.* --exclude=tests --exclude=data-processor \
    ${SERVERDIR}/ ${SERVERDIR}/dist"

print_task_name "Build data processor jar"
echo_and_eval "cd ${SERVERDIR}/data-processor"
echo_and_eval "mvn package"

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Build"
echo_and_eval "NODE_ENV=production npm run build"

## Copy all dists to dist/
print_task_name "Make artifacts"
echo_and_eval "rm -rf ${PROJECTDIR}/dist"
echo_and_eval "mkdir -p ${PROJECTDIR}/dist"
echo_and_eval "cp -R ${SERVERDIR}/dist ${PROJECTDIR}/dist/dist-server"
echo_and_eval "cp -R ${SERVERDIR}/data-processor/target/*.jar ${PROJECTDIR}/dist"
echo_and_eval "cp -R ${CLIENTDIR}/dist ${PROJECTDIR}/dist/dist-dashboard"

print_task_name "Build complete"
