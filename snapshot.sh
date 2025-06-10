#!/bin/bash

BACKUP_DIR="./snapshots"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SNAPSHOT_FILE="$BACKUP_DIR/iot_snapshot_$TIMESTAMP.db"

# Faire une copie cohérente avec sqlite3
sqlite3 iot.db ".backup $SNAPSHOT_FILE"

echo "Snapshot créé : $SNAPSHOT_FILE"
