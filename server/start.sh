#! /bin/bash

nodemon \
    --ext       'py' \
    --watch     server \
    --quiet \
    --exec 'python server/app.py'