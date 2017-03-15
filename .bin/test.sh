#!/bin/bash

SRCDIR=$(dirname $(cd ${0%/*} 2>>/dev/null ; echo `pwd`/${0##*/})) 
PROJECTDIR="${SRCDIR}/.."
. ${PROJECTDIR}/.bin/util.sh

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

print_task_name "Run linting"
echo_and_eval "npm run lint"

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Run linting"
echo_and_eval "npm run lint"
echo_and_eval "npm run test"
