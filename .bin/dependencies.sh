#!/bin/bash
# if [ "$BASH" != "/bin/bash" ] ; then echo "Bash Only"; exit 1; fi

PROJECTDIR="$( cd "$( dirname "$( dirname "${BASH_SOURCE[0]}" )" )" && pwd )"
DISTDIR="${PROJECTDIR}/dist"
. ${PROJECTDIR}/.bin/util.sh

# If true, then do not build data processor
WITHOUT_DATAPROC=${WITHOUT_DATAPROC:-0}
# If not true, do not build demo
WITH_DEMO=${WITH_DEMO:-0}

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

print_task_name "Install Server dependencies"
echo_and_eval "npm install"

if [[ "${WITHOUT_DATAPROC}" -eq "0" ]]; then
    print_task_name "Install java dependencies"
    echo_and_eval "cd ${SERVERDIR}/data-processor"
    echo_and_eval "mvn dependency:go-offline"
fi

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Install Client dependencies"
echo_and_eval "npm install"

## Demo dependencies
if [[ "${WITH_DEMO}" -eq "1" ]]; then
    cd ${DEMODIR}
    npm install
fi
