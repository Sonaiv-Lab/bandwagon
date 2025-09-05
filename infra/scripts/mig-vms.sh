#!/bin/bash

SSH=0

while [ $# -gt 0 ]
do
  # echo "$#"
  case "${1:-}" in
    --ssh) 
        SSH=1
        shift
      ;;
    --)
        shift
        break
      ;;
    *) 
        shift
      ;;
  esac
done

if [ $SSH == 1 ]; then
  URI="$(gcloud compute instance-groups managed list-instances spot-regional-mig --zone=asia-east1-a --uri --limit=1)"

  gcloud compute ssh $URI "$@"
else
  gcloud compute instance-groups managed list-instances spot-regional-mig --zone=asia-east1-a
fi
