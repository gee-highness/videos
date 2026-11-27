# es04 media (big): large Commons videos only (use Wi-Fi). Paste the whole block into Termux (needs: pkg install python zip ffmpeg curl; pip install yt-dlp).
# Send back Downloads/es04-media-big.zip
mkdir -p ~/storage/downloads/es04-media-big/img ~/storage/downloads/es04-media-big/vid && cd ~/storage/downloads/es04-media-big
UA='TributeVideoMaker/1.0'
# 67 MB, 3:08, 1080p: use Wi-Fi; features him
[ -s vid/wikipedia-things-come-together.webm ] || curl -sL -m 900 -A "$UA" -o vid/wikipedia-things-come-together.webm 'https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Things_come_together.webm'
cd .. && rm -f es04-media-big.zip && zip -qr es04-media-big.zip es04-media-big && du -sh es04-media-big.zip && echo 'Done: Downloads/es04-media-big.zip'
