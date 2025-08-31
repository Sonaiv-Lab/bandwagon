#!/bin/bash

if [ "$1" = "ssh" ]; then
  URI="$(gcloud compute instance-groups managed list-instances spot-regional-mig --region=asia-east1 --uri --limit=1)"

  gcloud compute ssh $URI

else
  gcloud compute instance-groups managed list-instances spot-regional-mig --region=asia-east1
fi
