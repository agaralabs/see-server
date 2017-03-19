#!/bin/bash

SRCDIR=$(dirname $(cd ${0%/*} 2>>/dev/null ; echo `pwd`/${0##*/})) 
PROJECTDIR="${SRCDIR}/.."
. ${PROJECTDIR}/.bin/util.sh

# If true, then do not build data processor
WITHOUT_DATAPROC=${WITHOUT_DATAPROC:-0}
# If not true, do not build demo
WITH_DEMO=${WITH_DEMO:-0}

# Default to server/src/config/config.ini if CONFIG_PATH is unset
CONFIG_PATH=${CONFIG_PATH:-"${SERVERDIR}/src/config/config.ini"}

if [[ ! -f ${CONFIG_PATH} ]] ; then
    echo "Missing config file: ${CONFIG_PATH}"
    exit 1
fi

CONFIG_READER="${PROJECTDIR}/.bin/ini_reader ${CONFIG_PATH}"

export API_URL=`${CONFIG_READER} app api_url`

export NODE_ENV=production

# SERVER
print_task_name "Set CWD"
echo_and_eval "cd ${SERVERDIR}"

echo_and_eval "rsync -r --delete \
    --exclude=dist --exclude=node_modules --exclude=*.md --exclude=.* --exclude=tests --exclude=data-processor \
    ${SERVERDIR}/ ${SERVERDIR}/dist"

if [[ "${WITHOUT_DATAPROC}" -eq "0" ]]; then
    print_task_name "Build data processor jar"
    echo_and_eval "cd ${SERVERDIR}/data-processor"
    echo_and_eval "mvn package"
fi

# CLIENT
print_task_name "Set CWD"
echo_and_eval "cd ${CLIENTDIR}"

print_task_name "Build"
echo_and_eval "npm run build"

# DEMO
if [[ "${WITH_DEMO}" -eq "1" ]]; then
    cd ${DEMODIR}
    rm -rf dist
    mkdir dist
    cp app.js package.json demo-data.sql dist
    cp -R public dist
    node_modules/.bin/browserify -t [ envify --API_URL ${API_URL} ] dist/public/main.js -o dist/public/bundle.js
    rm dist/public/main.js
fi


## Copy all dists to dist/
print_task_name "Make artifacts"
echo_and_eval "rm -rf ${PROJECTDIR}/dist"
echo_and_eval "mkdir -p ${PROJECTDIR}/dist"
echo_and_eval "cp -R ${SERVERDIR}/dist ${PROJECTDIR}/dist/server"
echo_and_eval "cp ${CONFIG_PATH} ${PROJECTDIR}/dist/server/src/config/config.ini"
echo_and_eval "cp -R ${CLIENTDIR}/dist ${PROJECTDIR}/dist/dashboard"
if [[ "${WITHOUT_DATAPROC}" -eq "0" ]]; then
    echo_and_eval "cp -R ${SERVERDIR}/data-processor/target/*.jar ${PROJECTDIR}/dist"
fi
if [[ "${WITH_DEMO}" -eq "1" ]]; then
    echo_and_eval "cp -R ${DEMODIR}/dist ${PROJECTDIR}/dist/demo"
fi

print_task_name "Build complete"
