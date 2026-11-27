# es04 media (small): images and 25-second YouTube snippets (about 200 MB at most). Paste the whole block into Termux (needs: pkg install python zip ffmpeg curl; pip install yt-dlp).
# Send back Downloads/es04-media-small.zip
mkdir -p ~/storage/downloads/es04-media-small/img ~/storage/downloads/es04-media-small/vid && cd ~/storage/downloads/es04-media-small
UA='TributeVideoMaker/1.0'
g(){ [ -s "img/$1" ] || { curl -sL -m 120 -A "$UA" -o "img/$1" "https://commons.wikimedia.org/wiki/Special:FilePath/$2?width=2400"; sleep 2; }; }
g 01-pete-portrait.jpg 'Pete-edochie.jpg'
g 02-pete-unroyal.jpg 'Kingsley_Abasili_and_Pete_Edochie_(Unroyal).jpg'
g 03-pete-wikipedia-ad.png 'Wikipedia_Okonwo_video_ad_still.png'
g 04-achebe.jpg 'Chinua_Achebe_-_Buffalo_25Sep2008.jpg'
g 05-book.jpg 'Things_Fall_Apart_books_02.jpg'
g 06-nollywood-set.jpg 'A_film_set_in_Nollywood_Awka.jpg'
g 07-masquerade1.jpg 'Igbo_Masquerade.jpg'
g 08-masquerade2.jpg 'Display_of_some_Igbo_masquerades.jpg'
g 09-masquerade3.jpg 'Mmanwu_nd%E1%BB%8B_Igbo_02.jpg'
g 10-enugu.jpg 'Enugu_Nigeria.jpg'
g 11-enugu-falls.jpg 'Awhum_Water_Fall_Enugu%2C_Nigeria.jpg'
g 12-umueri.jpg 'Chinua_Achebe_International_Airport%2C_Umueri.jpg'
g 13-flag1.jpg 'Nigerian_flag_landscape.jpg'
g 14-flag2.jpg 'Nigerian_flags_landscape.jpg'
g 15-lagos1.jpg 'Lagos_skyline.jpg'
g 16-lagos2.jpg 'Lagos_skyline_with_marina.jpg'
g 17-kolanut.jpg 'A_calabash_containing_kola_nut_from_the_badagry_slave_trade_museum.jpg'
g 18-clapper1.jpg 'Clapperboard%2C_O2_film%2C_September_2008.jpg'
g 19-clapper2.jpg 'Clpbrd.jpg'
g 20-projector.jpg 'Cinema_projector_Everyman_Theatre%2C_Muswell_Hill.jpg'
g 21-nollywood-lion.jpg 'Filming_a_nollywood_movie_titled_the_lion.jpg'
# YouTube snippets: only 25 s from the given start (default 15 s in), at most 480p and 25 MB, 1 per search; an .info.json keeps the title and uploader for the credit
y(){ yt-dlp -q --no-warnings -f "bv*[height<=480]+ba/b[height<=480]" --merge-output-format mp4 --match-filter 'duration<=900' --max-filesize 25M --max-downloads 1 --restrict-filenames --write-info-json --download-sections "*$3-$(( $3 + 25 ))" --force-keyframes-at-cuts -o "vid/$1-%(id)s.%(ext)s" "ytsearch6:$2"; }
y things-fall-apart 'Pete Edochie Things Fall Apart 1987 Okonkwo NTA' 20
y lionheart 'Pete Edochie Lionheart official trailer Netflix' 30
y wikipedia-ad 'Pete Edochie Wikipedia advert Things Come Together' 40
y interview 'Pete Edochie interview proverbs' 30
y tribute-news 'Pete Edochie dies tribute Channels Television' 10
y igodo 'Pete Edochie Igodo clip' 60
y rituals 'Pete Edochie Rituals Nollywood clip' 60
y unroyal 'Pete Edochie Unroyal trailer' 20
cd .. && rm -f es04-media-small.zip && zip -qr es04-media-small.zip es04-media-small && du -sh es04-media-small.zip && echo 'Done: Downloads/es04-media-small.zip'

# es04 media (big): large Commons videos only (use Wi-Fi). Paste the whole block into Termux (needs: pkg install python zip ffmpeg curl; pip install yt-dlp).
# Send back Downloads/es04-media-big.zip
mkdir -p ~/storage/downloads/es04-media-big/img ~/storage/downloads/es04-media-big/vid && cd ~/storage/downloads/es04-media-big
UA='TributeVideoMaker/1.0'
# 67 MB, 3:08, 1080p: use Wi-Fi; features him
[ -s vid/wikipedia-things-come-together.webm ] || curl -sL -m 900 -A "$UA" -o vid/wikipedia-things-come-together.webm 'https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Things_come_together.webm'
cd .. && rm -f es04-media-big.zip && zip -qr es04-media-big.zip es04-media-big && du -sh es04-media-big.zip && echo 'Done: Downloads/es04-media-big.zip'
