# Downloads the clips on your phone, into Downloads/es01-media. Needs: pip install yt-dlp (Termux). Send back Downloads/es01-media.zip
# Check each site's terms and keep to short, credited clips. Re-run is safe: finished files are skipped.
mkdir -p ~/storage/downloads/es01-media && cd ~/storage/downloads/es01-media
[ -s hayu-backstage.mp4 ] || yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o hayu-backstage.mp4 'https://www.youtube.com/watch?v=ZDUS31oI3R4'
[ -s hayu-monologue.mp4 ] || yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o hayu-monologue.mp4 'https://www.youtube.com/shorts/tE1vNwAmj7E'
[ -s hayu-hell.mp4 ] || yt-dlp -f "bv*[height<=1080]+ba/b" --merge-output-format mp4 -o hayu-hell.mp4 'https://www.youtube.com/shorts/-Qegcz91O4s'
cd .. && rm -f es01-media.zip && zip -qr es01-media.zip es01-media && ls -la es01-media
