DISK_ID="/dev/disk/by-id/google-core-data-disk"
MNT_DIR="/mnt/data"

mkdir -p $MNT_DIR
mount -o discard,defaults $DISK_ID $MNT_DIR

sudo chgrp docker /mnt/data