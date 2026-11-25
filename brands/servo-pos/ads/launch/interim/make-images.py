import subprocess,os
from PIL import Image
OUT="/home/user/servo-pos/ads/launch/interim"; SH="file:///home/user/servo-pos/docs/posts/shots/"
BG={"a":"linear-gradient(135deg,#7A1F0A,#D9480F 70%,#FF8A3D)","b":"linear-gradient(135deg,#0f3d2e,#16a06b)","c":"linear-gradient(135deg,#7a2a10,#e0622a)","d":"linear-gradient(135deg,#0B2A5B,#1F6FEB)"}
def tk(c,a,b):return f'<div class="tk {c}"><b>{a}</b>{b}</div>'
def phone(img,w=290,h=470):return f'<div class=ph style="width:{w}px;height:{h}px"><img src="{SH}{img}" style="width:{w}px"></div>'
def dev(w,h,r=18,cols=3):
    sq="".join('<i></i>' for _ in range(cols*3))
    return f'<div class=dev style="width:{w}px;height:{h}px;border-radius:{r}px"><div class=mg style="grid-template-columns:repeat({cols},1fr)">{sq}</div><div class=cart><u></u><u></u><u></u><s>Pay E153</s></div></div>'
V={}
V["i02"]=f'''<div class=two><div class=slipwrap><div class=slip>Tbl 5<br>chikn stew ??<br><s>pap</s> beef<br>2 x tea</div><p class=cap>Lost. Unclear. Late.</p></div>
<div class=board><div class=bh>KITCHEN · LIVE</div>{tk("","Table 5 · new","Chicken stew, Pap &amp; beef, Iced tea x2")}{tk("o","Table 2 · cooking","Peri-peri chicken")}{tk("g","Table 8 · ready","Veg curry")}<p class=cap2>Clear. Live. On time.</p></div></div>'''
V["i03"]=f'<div class=row3>{phone("classic-home.png",270,470)}{phone("midnight-home.png",270,470)}<div class=chips><span>Your name</span><span>Your logo</span><span>Your colours</span><span>Your tabs</span></div></div>'
bars="".join(f'<div class=bar style="height:{h}%"></div>' for h in [38,52,45,66,58,82,100])
V["i04"]=f'<div class=two><div class="card wide"><div class=lbl>Today\'s sales (demo)</div><div class=big>E8,420</div><div class=bars>{bars}</div><div class=lbl2>Mon · Tue · Wed · Thu · Fri · Sat · Sun</div></div><div class=stack><div class=card><div class=lbl>Orders</div><div class=big2>126</div></div><div class=card><div class=lbl>Best seller</div><div class=big3>Chicken stew</div></div></div></div>'
tiles=[("Cashier","Cash &amp; card"),("Kitchen screen","Live tickets"),("QR ordering","At the table"),("Stock","Alerts &amp; POs"),("Reports","Sales &amp; hours"),("Your own app","Your brand")]
V["i05"]='<div class=grid3>'+"".join(f'<div class=tile><b>{a}</b><span>{b}</span></div>' for a,b in tiles)+'</div>'
V["i06"]=f'<div class=devs>{dev(150,300,26,2)}{dev(300,230,18,3)}{dev(380,250,10,4)}</div>'
rows=""
for d,vals in [("Mon",[1,1,1,2,2]),("Tue",[1,1,1,1,2]),("Wed",[1,2,1,2,2]),("Thu",[1,2,2,3,3]),("Fri",[2,2,3,4,5]),("Sat",[2,3,4,5,5]),("Sun",[1,3,3,3,2])]:
    rows+=f'<div class=hr><span>{d}</span>'+"".join(f'<i class="h{v}"></i>' for v in vals)+'</div>'
V["i07"]=f'<div class=card style="width:100%"><div class=lbl>Busy hours (example data)</div><div class=hhead><span></span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span></div>{rows}</div>'
V["i08"]='''<div class=steps><div class=stp><em>1</em><b>Take the order</b><div class=mini><u>Chicken stew</u><u>Pap &amp; beef</u><s>Send</s></div></div><div class=arr>&rarr;</div>
<div class=stp><em>2</em><b>Kitchen sees it</b><div class=mini>'''+tk("","Table 5 · new","Chicken stew")+'''</div></div><div class=arr>&rarr;</div><div class=stp><em>3</em><b>Marked ready</b><div class=mini>'''+tk("g","Table 5 · ready","Serve now")+'</div></div></div>'
V["i09"]='''<div class=two><div class="card ref"><div class=lbl>Refer a restaurant</div><div class=big>+2 months</div><div class=lbl>for each restaurant that starts taking orders</div><div class=code>SV-K7QM2 <small>(example code)</small></div><div class=btn>Share your code</div></div>
<div class=stack><div class="card slim"><b>Restaurant 1</b><span class=ok>+2 months</span></div><div class="card slim"><b>Restaurant 2</b><span class=ok>+2 months</span></div><div class="card slim"><b>Restaurant 3</b><span class=pd>Waiting for first order</span></div></div></div>'''
V["i10"]=f'''<div class=two><div class="card ref"><div class=lbl>Rewards settings</div><div class=tg><b>Double points</b><span>Tuesdays</span><i class=on></i></div><div class=tg><b>Points per E10 spent</b><span>1 point</span><i class=on></i></div><div class=tg><b>Free dessert</b><span>300 pts</span><i class=on></i></div><div class=tg><b>Programme name</b><span>Mama's Club</span></div></div>{phone("bistro-rewards.png",290,470)}</div>'''
V["i11"]=f'''<div class=two><div class="card ref"><div class=lbl>Your customer app builder</div><div class=sw><i style="background:#8a3a22"></i><i style="background:#16a06b"></i><i style="background:#3a2fa0"></i><i style="background:#e0a82a"></i></div><div class=tabs><span>Home</span><span>Menu</span><span>Book</span><span>Rewards</span></div><div class=btn>Publish</div></div>{phone("bistro-home.png",290,470)}</div>'''
feat=["Your own customer app","Table QR ordering","Kitchen display screen","Stock &amp; purchase orders","Shifts &amp; timesheets","Live sales analytics"]
V["i12"]='<div class=two><div class="card ref"><div class=lbl>Standard</div><div class=big>E750<small> /month</small></div><div class=big3 style="color:#5b3fd6">about E25 a day</div><div class=btn>Month to month</div></div><div class="card ref">'+"".join(f'<div class=ck>&#10003; {f}</div>' for f in feat)+'</div></div>'
V["i13"]=f'''<div class=two><div class=tent><div class=tn>Mama's Kitchen</div><div class=qr>{"".join(f'<i class="q{(i*7+i//5*3)%3}"></i>' for i in range(100))}</div><div class=tn2>Scan to order · Table 5</div></div>{phone("bistro-menu.png",290,470)}</div>'''
V["i14"]='''<div class="card" style="width:100%"><div class=lbl>How to work it out (example)</div><div class=fm>Food cost % = ingredients &divide; sales &times; 100</div><div class=ex><span>Ingredients this week</span><b>E2,600</b></div><div class=ex><span>Sales this week</span><b>E8,400</b></div><div class=ex><span>Food cost</span><b style="color:#16a06b">31%</b></div></div>'''
P=[("i02-paper-or-screen","a","QUICK POLL","Paper slips or a kitchen screen?","Comment A for paper slips, B for a kitchen screen.","Comment A or B"),
("i03-app-name","d","YOUR TURN","What would you name your app?","Your name, logo and colours on your guests' phones.","Drop it below"),
("i04-guess-sales","c","NO PEEKING","Guess last week's sales.","Servo shows sales, orders and best sellers in one tap.","Comment your guess"),
("i05-today","a","TODAY","Servo POS goes live today.","Everything a restaurant runs on, in one app. Post lands 15:30.","Follow the page"),
("i06-myth-hardware","b","MYTH BUSTED","No fancy hardware needed.","Same app on a phone, tablet or computer you already own.","Try the demo"),
("i07-busiest-day","d","QUICK POLL","Your busiest day: Fri, Sat or Sun?","See your busy hours at a glance and staff for them.","Comment below"),
("i08-challenge","c","30-SECOND CHALLENGE","Take an order. Watch it hit the kitchen.","Try it in the live demo, screenshot it and tag us.","Open the demo"),
("i09-tag-owner","a","TAG AN OWNER","Know an owner who needs this?","Refer a restaurant and earn 2 free months each.","Tag them now"),
("i10-tip-double-points","b","OWNER TIP","Quiet Tuesday? Run double points.","You set the days, the points and the rewards.","See rewards"),
("i11-myth-app-cost","d","MYTH BUSTED","Your own app costs a fortune?","Pick a look, set colours and tabs, press Publish.","Join now"),
("i12-per-day","c","DO THE MATH","About E25 a day.","Servo POS Standard: everything below for E750 a month.","See the plans"),
("i13-favourite-spot","a","SHOUT-OUT","Which local restaurant do you love?","Tell us and tag them. Table QR ordering is one scan away.","Tag them"),
("i14-food-cost","b","QUICK POLL","Know your food cost?","Comment YES, NO or WHAT'S THAT?","Comment below")]
CSS='''*{box-sizing:border-box;margin:0}body{width:1080px;height:1080px;font-family:Inter,Helvetica,Arial,sans-serif;color:#fff;position:relative;overflow:hidden}
.glow{position:absolute;right:-200px;top:-160px;width:800px;height:800px;border-radius:50%;background:rgba(255,255,255,.07)}
.lab{position:absolute;left:80px;top:60px;background:#ffd84a;color:#7A1F0A;font-weight:800;letter-spacing:.14em;font-size:22px;padding:10px 22px;border-radius:999px}
h1{position:absolute;left:80px;top:130px;width:900px;font-size:68px;line-height:1.05;font-weight:800;letter-spacing:-.02em}
.s{position:absolute;left:80px;top:330px;width:900px;font-size:30px;line-height:1.3;color:#FFF1E0}
.b{position:absolute;left:80px;bottom:52px;letter-spacing:.28em;font-weight:700;font-size:24px;color:#FFE3C2}
.p{position:absolute;right:80px;bottom:40px;background:#ffd84a;color:#7A1F0A;font-weight:800;font-size:30px;padding:16px 32px;border-radius:999px}
.v{position:absolute;left:80px;right:80px;top:420px;height:540px;display:flex;align-items:center;justify-content:center}
.two{display:flex;gap:28px;width:100%;align-items:center;justify-content:center}.two>*{flex:1}
.card{background:#fff;color:#2A1A10;border-radius:24px;padding:24px 28px}.card.ref{min-height:400px}.wide{flex:1.4}
.lbl{font-size:22px;color:#7A6652;font-weight:600}.lbl2{font-size:15px;color:#9A8670;margin-top:6px}.big{font-size:70px;font-weight:800;letter-spacing:-.02em}.big small{font-size:28px;color:#7A6652}.big2{font-size:56px;font-weight:800}.big3{font-size:34px;font-weight:800}
.stack{display:flex;flex-direction:column;gap:20px}
.bars{display:flex;align-items:flex-end;gap:12px;height:190px;margin-top:12px}.bar{flex:1;background:#F5A300;border-radius:8px 8px 0 0}.bar:last-child{background:#ffb800}
.tk{background:#23232d;color:#fff;border-radius:12px;padding:12px 16px;margin-bottom:10px;border-left:6px solid #ffd84a;font-size:19px;text-align:left}.tk b{display:block;font-size:21px;margin-bottom:3px}.tk.g{border-color:#4ade80}.tk.o{border-color:#fb923c}
.board{background:#16161d;border-radius:24px;padding:20px;border:8px solid #0c0c10}.bh{color:#ffd84a;font-weight:800;margin-bottom:12px;font-size:20px}
.slip{background:#f3ecd2;color:#3a3a3a;font-family:"Comic Sans MS",cursive,sans-serif;font-size:30px;line-height:1.3;padding:34px;border-radius:6px;transform:rotate(-4deg);box-shadow:0 8px 20px rgba(0,0,0,.3)}.slipwrap{text-align:center}
.cap{margin-top:26px;font-size:28px;font-weight:700;color:#ffd0c0}.cap2{text-align:center;font-weight:800;color:#9df0b8;font-size:22px;margin-top:6px}
.ph{border-radius:36px;overflow:hidden;flex:none}.ph img{display:block}.row3{display:flex;gap:26px;align-items:center}
.chips{display:flex;flex-direction:column;gap:14px}.chips span{background:rgba(255,255,255,.14);border-radius:999px;padding:14px 26px;font-size:26px;font-weight:700}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;width:100%}.tile{background:#fff;color:#2A1A10;border-radius:22px;padding:34px 24px;border-top:10px solid #F5A300}.tile:nth-child(2n){border-color:#ffb800}.tile:nth-child(3n){border-color:#16a06b}.tile b{display:block;font-size:30px;margin-bottom:8px}.tile span{font-size:22px;color:#7A6652}
.devs{display:flex;gap:24px;align-items:flex-end}.dev{background:#fff;border:8px solid #111;display:flex;flex-direction:column;overflow:hidden;color:#2A1A10}.mg{display:grid;gap:8px;padding:10px;flex:1}.mg i{background:#FFF1E0;border-radius:8px}.cart{padding:8px 10px;background:#f6f4ff}.cart u{display:block;height:8px;background:#FFE3C2;border-radius:4px;margin:6px 0}.cart s{display:block;text-decoration:none;background:#F5A300;color:#fff;text-align:center;padding:8px;border-radius:8px;font-weight:800;font-size:15px}
.hhead,.hr{display:grid;grid-template-columns:70px repeat(5,1fr);gap:8px;margin-top:8px;align-items:center;font-size:18px;color:#7A6652;font-weight:700}.hr i{height:38px;border-radius:8px}.h1{background:#FFF1E0}.h2{background:#cfc4ff}.h3{background:#a995ff}.h4{background:#7c5cf0}.h5{background:#ffb800}
.steps{display:flex;align-items:center;gap:14px;width:100%}.stp{flex:1;text-align:center}.stp em{display:inline-block;background:#ffd84a;color:#7A1F0A;font-style:normal;font-weight:800;border-radius:50%;width:44px;height:44px;line-height:44px;font-size:24px}.stp b{display:block;font-size:26px;margin:10px 0 14px}.mini{background:#fff;color:#2A1A10;border-radius:20px;padding:16px;min-height:190px;display:flex;flex-direction:column;justify-content:center}.mini .tk{margin:0}.mini u{text-decoration:none;display:block;text-align:left;padding:10px;border-bottom:1px solid #eee;font-size:20px}.mini s{text-decoration:none;display:block;background:#F5A300;color:#fff;border-radius:10px;padding:10px;font-weight:800;margin-top:10px}.arr{font-size:44px;color:#ffd84a;font-weight:800}
.code{font-size:44px;font-weight:800;letter-spacing:.06em;background:#FFF3DC;border-radius:14px;padding:12px 18px;margin:18px 0}.code small{font-size:16px;letter-spacing:0;color:#7A6652}.btn{background:#F5A300;color:#fff;border-radius:14px;padding:16px;text-align:center;font-weight:800;font-size:24px;margin-top:14px}
.slim{display:flex;justify-content:space-between;align-items:center;font-size:24px}.ok{color:#16a06b;font-weight:800;font-size:22px}.pd{color:#e0622a;font-weight:700;font-size:18px}
.tg{display:grid;grid-template-columns:1fr auto 46px;gap:10px;align-items:center;padding:16px 0;border-bottom:1px solid #eee;font-size:22px}.tg span{color:#7A6652}.tg i{width:46px;height:26px;border-radius:13px;background:#FFE3C2;display:block}.tg i.on{background:#16a06b}
.sw{display:flex;gap:14px;margin:20px 0}.sw i{width:56px;height:56px;border-radius:50%;display:block}.tabs{display:flex;flex-wrap:wrap;gap:10px}.tabs span{background:#FFF3DC;border-radius:999px;padding:10px 20px;font-weight:700;font-size:22px}
.ck{font-size:26px;padding:12px 0;border-bottom:1px solid #eee;font-weight:600}.tent{background:#fff;color:#2A1A10;border-radius:24px;padding:28px;text-align:center}.tn{font-size:34px;font-weight:800}.tn2{font-size:24px;font-weight:700;margin-top:10px}.qr{display:grid;grid-template-columns:repeat(10,1fr);width:260px;height:260px;margin:18px auto 0;gap:2px}.qr i{background:#fff;display:block}.qr i.q0{background:#111}.qr i.q1{background:#111}
.fm{font-size:34px;font-weight:800;margin:18px 0;background:#FFF3DC;border-radius:14px;padding:18px}.ex{display:flex;justify-content:space-between;font-size:30px;padding:12px 4px;border-bottom:1px solid #eee}'''
CH="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
for n,bg,lab,h,sub,cta in P:
    k=n[:3]
    html=f'<!doctype html><meta charset=utf-8><style>{CSS}body{{background:{BG[bg]}}}</style><body><div class=glow></div><div class=lab>{lab}</div><h1>{h}</h1><div class=s>{sub}</div><div class=v>{V[k]}</div><div class=b>SERVO POS</div><div class=p>{cta}</div></body>'
    open(f"/tmp/_j_{n}.html","w").write(html)
    subprocess.run([CH,"--headless","--no-sandbox","--disable-gpu","--allow-file-access-from-files",f"--screenshot={OUT}/{n}.png","--window-size=1080,1167",f"file:///tmp/_j_{n}.html"],capture_output=True)
    Image.open(f"{OUT}/{n}.png").crop((0,0,1080,1080)).save(f"{OUT}/{n}.png")
