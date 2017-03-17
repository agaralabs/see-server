#!/bin/bash
# if [ "$BASH" != "/bin/bash" ] ; then echo "Bash Only"; exit 1; fi

PROJECTDIR="$( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )" && pwd )"
DISTDIR="${PROJECTDIR}/dist"
. ${PROJECTDIR}/.bin/util.sh

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

print_task_name "Install Server dependencies"
echo_and_eval "npm install"

print_task_name "Install java dependencies"
echo_and_eval "cd ${SERVERDIR}/data-processor"
echo_and_eval "mvn dependency:go-offline"

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Install Client dependencies"
echo_and_eval "npm install"
