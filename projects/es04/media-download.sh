# es04 media: licensed images and searched videos. Paste the whole block into Termux (needs: pkg install python zip ffmpeg curl; pip install yt-dlp).
# Images come from Wikimedia Commons (credited in image-credits.md). Videos are searched on YouTube and kept short. Send back Downloads/es04-media.zip
mkdir -p ~/storage/downloads/es04-media/img ~/storage/downloads/es04-media/vid && cd ~/storage/downloads/es04-media
UA='TributeVideoMaker/1.0'
g(){ [ -s "img/$1" ] || curl -sL -m 120 -A "$UA" -o "img/$1" "https://commons.wikimedia.org/wiki/Special:FilePath/$2?width=2400"; }
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
# Commons video (67 MB, 3:08, 1080p: use Wi-Fi; features him)
[ -s vid/wikipedia-things-come-together.webm ] || curl -sL -m 900 -A "$UA" -o vid/wikipedia-things-come-together.webm 'https://commons.wikimedia.org/wiki/Special:FilePath/Wikipedia_-_Things_come_together.webm'
# YouTube searches: up to 2 short videos per search (under 15 minutes, 720p), with an .info.json for the credit
y(){ yt-dlp -q --no-warnings -f 'bv*[height<=720]+ba/b[height<=720]' --merge-output-format mp4 --match-filter 'duration<=900' --max-downloads 2 --restrict-filenames --write-info-json -o "vid/$1-%(id)s.%(ext)s" "ytsearch6:$2"; }
y things-fall-apart 'Pete Edochie Things Fall Apart 1987 Okonkwo NTA'
y lionheart 'Pete Edochie Lionheart official trailer Netflix'
y wikipedia-ad 'Pete Edochie Wikipedia advert Things Come Together'
y interview 'Pete Edochie interview proverbs'
y tribute-news 'Pete Edochie dies tribute Channels Television'
y igodo 'Pete Edochie Igodo clip'
y rituals 'Pete Edochie Rituals Nollywood clip'
y unroyal 'Pete Edochie Unroyal trailer'
cd .. && rm -f es04-media.zip && zip -qr es04-media.zip es04-media && ls -la es04-media/img es04-media/vid | tail -40 && echo 'Done: Downloads/es04-media.zip'
