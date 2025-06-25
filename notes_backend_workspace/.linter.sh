#!/bin/bash
cd /home/kavia/workspace/code-generation/notemaster-33488-5fbb2cf3/notes_backend_workspace/notes_backend
source venv/bin/activate
flake8 .
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

