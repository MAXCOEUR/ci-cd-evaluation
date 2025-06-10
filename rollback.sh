#!/bin/bash

SNAPSHOT_DIR="./snapshots"

echo "Snapshots disponibles :"
ls -1 $SNAPSHOT_DIR

echo "Entrez le nom du snapshot à restaurer :"
read SNAPSHOT_NAME

SNAPSHOT_PATH="$SNAPSHOT_DIR/$SNAPSHOT_NAME"

if [ ! -f "$SNAPSHOT_PATH" ]; then
  echo "Snapshot introuvable !"
  exit 1
fi

cp "$SNAPSHOT_PATH" ./iot.db

echo "Rollback effectué à partir de $SNAPSHOT_NAME"
