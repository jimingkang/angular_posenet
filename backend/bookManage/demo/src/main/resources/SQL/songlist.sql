
drop table songlist;
CREATE TABLE songlist(
   id            bigint  NOT NULL PRIMARY KEY ,
   pid bigint
  ,fee           bigint  NOT NULL
  ,payed         BIT  NOT NULL
  ,st            bigint  NOT NULL
  ,pl            bigint  NOT NULL
  ,dl            bigint  NOT NULL
  ,sp            bigint  NOT NULL
  ,cp            BIT  NOT NULL
  ,subp          BIT  NOT NULL
  ,cs            VARCHAR(5) NOT NULL
  ,maxbr         bigint  NOT NULL
  ,fl            bigint  NOT NULL
  ,toast         VARCHAR(5) NOT NULL
  ,flag          bigint  NOT NULL
  ,preSell       VARCHAR(5) NOT NULL
  ,playMaxbr     bigint  NOT NULL
  ,downloadMaxbr bigint  NOT NULL
  ,name        varchar(20) 
);
INSERT INTO songlist(id,pid,fee,payed,st,pl,dl,sp,cp,subp,cs,maxbr,fl,toast,flag,preSell,playMaxbr,downloadMaxbr,name) VALUES (454698657,5092808871,0,0,-100,0,0,7,1,1,'false',320000,0,'false',68,'false',320000,320000,"Astonga ,Rhode Island");
INSERT INTO songlist(id,pid,fee,payed,st,pl,dl,sp,cp,subp,cs,maxbr,fl,toast,flag,preSell,playMaxbr,downloadMaxbr,name) VALUES (554241732,5092808871,8,0,0,128000,0,7,1,1,'false',999000,128000,'false',256,'false',999000,999000, "Prati ,Rhode Island");

select * from songlist;


















{
   "code": 200,
   "relatedVideos": null,
   "songlist": {
      
      "subscribed": false,
      "creator": {
         "defaultAvatar": false,
         "province": 430000,
         "authStatus": 0,
         "followed": false,
         "avatarUrl": "http://p1.music.126.net/9Jj84kI5S5LZ1FK_pBG8jQ==/109951164987173056.jpg",
         "accountStatus": 0,
         "gender": 1,
         "city": 433100,
         "birthday": -2209017600000,
         "userId": 305003351,
         "userType": 200,
         "nickname": "后原",
         "signature": "聋子瞎子还有哑巴",
         "description": "",
         "detailDescription": "",
         "avatarImgId": 109951164987173060,
         "backgroundImgId": 109951164449620780,
         "backgroundUrl": "http://p1.music.126.net/7ccHbtNJzskhio55yfXJAw==/109951164449620781.jpg",
         "authority": 0,
         "mutual": false,
         "expertTags": [
            "华语",
            "流行",
            "欧美"
         ],
         "experts": null,
         "djStatus": 0,
         "vipType": 0,
         "remarkName": null,
         "avatarImgIdStr": "109951164987173056",
         "backgroundImgIdStr": "109951164449620781",
         "avatarImgId_str": "109951164987173056"
      },
      "tracks": [
         {
            "name": "迷途羔羊",
            "id": 454698657,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 6453,
                  "name": "张震岳",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 16,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 35120848,
               "name": "天兵",
               "picUrl": "http://p1.music.126.net/b1eSBbx2Yia0k89ocfOnjQ==/18677404023325159.jpg",
               "tns": [],
               "pic_str": "18677404023325159",
               "pic": 18677404023325160
            },
            "dt": 271386,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 10856533,
               "vd": -17500
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 6513937,
               "vd": -14800
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 4342639,
               "vd": -13200
            },
            "a": null,
            "cd": "1",
            "no": 2,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 8192,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 684010,
            "mv": 0,
            "publishTime": 1453910400000
         },
         {
            "name": "我的名字",
            "id": 554241732,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 12084229,
                  "name": "焦迈奇",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 18,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 78720135,
               "name": "我的名字",
               "picUrl": "http://p1.music.126.net/a_rb8pgC5R_hO-lfm7acSw==/109951164019567772.jpg",
               "tns": [],
               "pic_str": "109951164019567772",
               "pic": 109951164019567780
            },
            "dt": 251518,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 10063456,
               "vd": 31
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 6038091,
               "vd": -2
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 4025408,
               "vd": -2
            },
            "a": null,
            "cd": "01",
            "no": 10,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 0,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 1416476,
            "mv": 10865838,
            "publishTime": 1524758400007
         },
         {
            "name": "渺小却伟大",
            "id": 548651034,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 3765,
                  "name": "李易峰",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 4,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 38084019,
               "name": "渺小却伟大",
               "picUrl": "http://p1.music.126.net/kBBM3mWbLOc0cKlSgYlJpA==/109951163213762913.jpg",
               "tns": [],
               "pic_str": "109951163213762913",
               "pic": 109951163213762910
            },
            "dt": 209626,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 8387440,
               "vd": -27800
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 5032481,
               "vd": -25100
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 3355002,
               "vd": -24000
            },
            "a": null,
            "cd": "01",
            "no": 0,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 0,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 403012,
            "mv": 0,
            "publishTime": 1522512000007
         },
         {
            "name": "如约而至",
            "id": 573384240,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 5771,
                  "name": "许嵩",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 12,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 71747023,
               "name": "寻宝游戏",
               "picUrl": "http://p1.music.126.net/BUFZLieG5a6E3ZVpkHP6fA==/109951163402069754.jpg",
               "tns": [],
               "pic_str": "109951163402069754",
               "pic": 109951163402069760
            },
            "dt": 255708,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 10230640,
               "vd": -18400
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 6138401,
               "vd": -15599
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 4092282,
               "vd": -14400
            },
            "a": null,
            "cd": "1",
            "no": 8,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mark": 8192,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 14026,
            "mv": 5917878,
            "publishTime": 1528732800007
         },
         {
            "name": "这一路走来",
            "id": 26075553,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 6066,
                  "name": "杨宗纬",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "600902000007905805",
            "fee": 8,
            "v": 27,
            "crbt": "5efccfcb2cc3fa68a0f13edc45fb7463",
            "cf": "",
            "al": {
               "id": 2321001,
               "name": "初·爱",
               "picUrl": "http://p1.music.126.net/DxQeZM26qjkQsyZulBdw6A==/109951163314294843.jpg",
               "tns": [],
               "pic_str": "109951163314294843",
               "pic": 109951163314294850
            },
            "dt": 257000,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 10320627,
               "vd": -2.97
            },
            "m": {
               "br": 160000,
               "fid": 0,
               "size": 5160399,
               "vd": -2.54
            },
            "l": {
               "br": 96000,
               "fid": 0,
               "size": 3096308,
               "vd": -2.56
            },
            "a": null,
            "cd": "1",
            "no": 10,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mark": 8192,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 7003,
            "mv": 454139,
            "publishTime": 1364486400007
         },
         {
            "name": "野子",
            "id": 36229051,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 1193259,
                  "name": "苏运莹",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 39,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 3392011,
               "name": "第二季中国好歌曲十大金曲",
               "picUrl": "http://p1.music.126.net/LWmhB3XX8szN3V9TU-A5UA==/3390893862255408.jpg",
               "tns": [],
               "pic": 3390893862255408
            },
            "dt": 268000,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 10722786,
               "vd": -8100
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 6433688,
               "vd": -5500
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 4289140,
               "vd": -4000
            },
            "a": null,
            "cd": "1",
            "no": 3,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 512,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 21001,
            "mv": 0,
            "publishTime": 1449744390214
         },
         {
            "name": "致，孤勇如你",
            "id": 481846435,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 12084608,
                  "name": "情桑",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 0,
            "v": 11,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 35564629,
               "name": "致，孤勇如你",
               "picUrl": "http://p1.music.126.net/4WWdff1oiOZuScAsKLgMBw==/109951162946259703.jpg",
               "tns": [],
               "pic_str": "109951162946259703",
               "pic": 109951162946259700
            },
            "dt": 210102,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 8405203,
               "vd": -12000
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 5043139,
               "vd": -9400
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 3362107,
               "vd": -7600
            },
            "a": null,
            "cd": "1",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 0,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "publishTime": 1496285001443
         },
         {
            "name": "夹缝中的人",
            "id": 1459921229,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 2331,
                  "name": "陈翔",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 4,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 91883503,
               "name": "夹缝中的人",
               "picUrl": "http://p1.music.126.net/B6ADQgUmjvsd11unBfX2zQ==/109951165107163925.jpg",
               "tns": [],
               "pic_str": "109951165107163925",
               "pic": 109951165107163920
            },
            "dt": 230051,
            "h": {
               "br": 320002,
               "fid": 0,
               "size": 9204525,
               "vd": -43536
            },
            "m": {
               "br": 192002,
               "fid": 0,
               "size": 5522733,
               "vd": -41021
            },
            "l": {
               "br": 128002,
               "fid": 0,
               "size": 3681837,
               "vd": -39634
            },
            "a": null,
            "cd": "01",
            "no": 0,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 8192,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 636011,
            "mv": 10946821,
            "publishTime": 0
         },
         {
            "name": "梦想天空分外蓝",
            "id": 25638273,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 2116,
                  "name": "陈奕迅",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 0,
            "v": 77,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 2261091,
               "name": "梦想天空分外蓝",
               "picUrl": "http://p1.music.126.net/y1hkRJZ5UpNj_K2NLO8AKg==/831230790638810.jpg",
               "tns": [],
               "pic": 831230790638810
            },
            "dt": 200385,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 8016501,
               "vd": 0
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 4809918,
               "vd": 0
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 3206626,
               "vd": 0
            },
            "a": null,
            "cd": "1",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mark": 0,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 984,
            "publishTime": 1346601600007
         },
         {
            "name": "银河赴约",
            "id": 1453907054,
            "pst": 0,
            "t": 0,
            "ar": [
               {
                  "id": 12957090,
                  "name": "网易云音乐校园",
                  "tns": [],
                  "alias": []
               },
               {
                  "id": 12157336,
                  "name": "CMJ",
                  "tns": [],
                  "alias": []
               }
            ],
            "alia": [
               "网易云音乐助力高考自制曲目"
            ],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 9,
            "crbt": null,
            "cf": "",
            "al": {
               "id": 90520512,
               "name": "银河赴约",
               "picUrl": "http://p1.music.126.net/cT-C9b6B01PMVbgdEUbYJw==/109951165105399250.jpg",
               "tns": [],
               "pic_str": "109951165105399250",
               "pic": 109951165105399250
            },
            "dt": 203500,
            "h": {
               "br": 320000,
               "fid": 0,
               "size": 8142933,
               "vd": 29663
            },
            "m": {
               "br": 192000,
               "fid": 0,
               "size": 4885777,
               "vd": 32299
            },
            "l": {
               "br": 128000,
               "fid": 0,
               "size": 3257199,
               "vd": 34019
            },
            "a": null,
            "cd": "01",
            "no": 0,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mark": 128,
            "originCoverType": 0,
            "noCopyrightRcmd": null,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "publishTime": 0
         }
      ],
      "trackIds": [
         {
            "id": 454698657,
            "v": 16,
            "at": 1593997087611,
            "alg": null
         },
         {
            "id": 554241732,
            "v": 18,
            "at": 1593751527404,
            "alg": null
         },
         {
            "id": 548651034,
            "v": 4,
            "at": 1593997329071,
            "alg": null
         },
         {
            "id": 573384240,
            "v": 12,
            "at": 1593751442672,
            "alg": null
         },
         {
            "id": 26075553,
            "v": 27,
            "at": 1593823696389,
            "alg": null
         },
         {
            "id": 36229051,
            "v": 39,
            "at": 1593999332086,
            "alg": null
         },
         {
            "id": 481846435,
            "v": 11,
            "at": 1593997259778,
            "alg": null
         },
         {
            "id": 1459921229,
            "v": 4,
            "at": 1594008411919,
            "alg": null
         },
         {
            "id": 25638273,
            "v": 77,
            "at": 1593751190391,
            "alg": null
         },
         {
            "id": 1453907054,
            "v": 9,
            "at": 1593777689173,
            "alg": null
         },
         {
            "id": 1459686430,
            "v": 3,
            "at": 1593999234089,
            "alg": null
         },
         {
            "id": 33418784,
            "v": 11,
            "at": 1593997247589,
            "alg": null
         },
         {
            "id": 33756016,
            "v": 707,
            "at": 1593997234275,
            "alg": null
         },
         {
            "id": 31445772,
            "v": 152,
            "at": 1593997223559,
            "alg": null
         },
         {
            "id": 31273305,
            "v": 18,
            "at": 1593997213832,
            "alg": null
         },
         {
            "id": 1344340338,
            "v": 49,
            "at": 1593997206012,
            "alg": null
         },
         {
            "id": 411213090,
            "v": 7,
            "at": 1593997280942,
            "alg": null
         },
         {
            "id": 191024,
            "v": 206,
            "at": 1593997182479,
            "alg": null
         },
         {
            "id": 440241201,
            "v": 26,
            "at": 1593997106507,
            "alg": null
         },
         {
            "id": 386040,
            "v": 52,
            "at": 1593997173805,
            "alg": null
         },
         {
            "id": 1331905523,
            "v": 3,
            "at": 1593997292976,
            "alg": null
         },
         {
            "id": 176403,
            "v": 36,
            "at": 1593997128750,
            "alg": null
         },
         {
            "id": 25713022,
            "v": 63,
            "at": 1593751673500,
            "alg": null
         },
         {
            "id": 25694525,
            "v": 26,
            "at": 1593751627061,
            "alg": null
         },
         {
            "id": 168091,
            "v": 157,
            "at": 1593751634250,
            "alg": null
         },
         {
            "id": 408277841,
            "v": 10,
            "at": 1593751616497,
            "alg": null
         },
         {
            "id": 38576323,
            "v": 102,
            "at": 1593751604408,
            "alg": null
         },
         {
            "id": 25986155,
            "v": 21,
            "at": 1593751589373,
            "alg": null
         },
         {
            "id": 29567193,
            "v": 42,
            "at": 1593751580640,
            "alg": null
         },
         {
            "id": 27836173,
            "v": 12,
            "at": 1593751568081,
            "alg": null
         },
         {
            "id": 36229053,
            "v": 22,
            "at": 1593751555848,
            "alg": null
         },
         {
            "id": 415086030,
            "v": 84,
            "at": 1593751545250,
            "alg": null
         },
         {
            "id": 408814900,
            "v": 46,
            "at": 1593751536811,
            "alg": null
         },
         {
            "id": 156050,
            "v": 33,
            "at": 1593751479982,
            "alg": null
         },
         {
            "id": 25706282,
            "v": 94,
            "at": 1593751460797,
            "alg": null
         },
         {
            "id": 139357,
            "v": 17,
            "at": 1593751423788,
            "alg": null
         },
         {
            "id": 423015580,
            "v": 32,
            "at": 1593751454723,
            "alg": null
         },
         {
            "id": 1338737882,
            "v": 6,
            "at": 1593751448769,
            "alg": null
         },
         {
            "id": 355992,
            "v": 591,
            "at": 1593751418180,
            "alg": null
         },
         {
            "id": 28283346,
            "v": 34,
            "at": 1593751400838,
            "alg": null
         },
         {
            "id": 287057,
            "v": 40,
            "at": 1593751393256,
            "alg": null
         },
         {
            "id": 29004400,
            "v": 228,
            "at": 1593751216522,
            "alg": null
         },
         {
            "id": 1306112195,
            "v": 105,
            "at": 1593751367740,
            "alg": null
         },
         {
            "id": 108406,
            "v": 45,
            "at": 1593751357495,
            "alg": null
         },
         {
            "id": 374910,
            "v": 61,
            "at": 1593751348967,
            "alg": null
         },
         {
            "id": 25642119,
            "v": 22,
            "at": 1593751337855,
            "alg": null
         },
         {
            "id": 354557,
            "v": 48,
            "at": 1593751314986,
            "alg": null
         },
         {
            "id": 108138,
            "v": 99,
            "at": 1593751306944,
            "alg": null
         },
         {
            "id": 408332757,
            "v": 380,
            "at": 1593751172329,
            "alg": null
         },
         {
            "id": 1407551413,
            "v": 5,
            "at": 1593751300717,
            "alg": null
         },
         {
            "id": 1380905486,
            "v": 4,
            "at": 1593751238559,
            "alg": null
         },
         {
            "id": 29567189,
            "v": 36,
            "at": 1593751258901,
            "alg": null
         },
         {
            "id": 463157222,
            "v": 50,
            "at": 1593751251260,
            "alg": null
         },
         {
            "id": 191278,
            "v": 88,
            "at": 1593751201900,
            "alg": null
         },
         {
            "id": 28892408,
            "v": 68,
            "at": 1593751157452,
            "alg": null
         },
         {
            "id": 108557,
            "v": 134,
            "at": 1593751033155,
            "alg": null
         },
         {
            "id": 569212211,
            "v": 93,
            "at": 1593750906898,
            "alg": null
         },
         {
            "id": 1449782341,
            "v": 9,
            "at": 1593750891461,
            "alg": null
         }
      ],
      "updateFrequency": null,
      "backgroundCoverId": 0,
      "backgroundCoverUrl": null,
      "titleImage": 0,
      "titleImageUrl": null,
      "englishTitle": null,
      "opRecommend": false,
      "adType": 0,
      "trackNumberUpdateTime": 1594008411921,
      "subscribedCount": 40155,
      "cloudTrackCount": 0,
      "userId": 305003351,
      "createTime": 1593750361164,
      "highQuality": false,
      "updateTime": 1594008436628,
      "coverImgId": 109951165114585020,
      "newImported": false,
      "specialType": 0,
      "commentThreadId": "A_PL_0_5092808871",
      "coverImgUrl": "http://p2.music.126.net/wrhvYn7qGztoXFTKrT8SHA==/109951165114585025.jpg",
      "privacy": 0,
      "trackUpdateTime": 1595568464841,
      "trackCount": 58,
      "playCount": 4162174,
      "ordered": true,
      "description": "奋斗拼搏了那么久，期待盼望了那么久，你所有的付出都将会在这个季节得到你应有的回报。满意的分数，梦想的大学，向往的城市，还有想见的人，希望一切都顺顺利利的进行着，你一定可以金榜题名！你们的微笑都会被写在脸上，当双手捧起录取通知书看见自己名字的那一刻，这将会是这一整个夏天最值得、最耀眼和最美好的时刻！\n考得上/你可以/我们更高处见",
      "tags": [
         "华语",
         "流行",
         "学习"
      ],
      "status": 0,
      "name": "你的名字这么好听一定会出现在录取通知书上",
      "id": 5092808871,
      "shareCount": 506,
      "coverImgId_str": "109951165114585025",
      "commentCount": 1803
   },
   "urls": null,
   "privileges": [
      {
         "id": 454698657,
         "fee": 0,
         "payed": 0,
         "st": -100,
         "pl": 0,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 320000,
         "fl": 0,
         "toast": false,
         "flag": 68,
         "preSell": false,
         "playMaxbr": 320000,
         "downloadMaxbr": 320000
      },
      {
         "id": 554241732,
         "fee": 8,
         "payed": 0,
         "st": 0,
         "pl": 128000,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 128000,
         "toast": false,
         "flag": 256,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 548651034,
         "fee": 8,
         "payed": 0,
         "st": 0,
         "pl": 128000,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 128000,
         "toast": false,
         "flag": 64,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 573384240,
         "fee": 8,
         "payed": 0,
         "st": 0,
         "pl": 128000,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 128000,
         "toast": false,
         "flag": 4,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 26075553,
         "fee": 0,
         "payed": 0,
         "st": -100,
         "pl": 0,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 0,
         "toast": false,
         "flag": 260,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 36229051,
         "fee": 0,
         "payed": 0,
         "st": -100,
         "pl": 0,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 0,
         "toast": false,
         "flag": 0,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 481846435,
         "fee": 0,
         "payed": 0,
         "st": 0,
         "pl": 320000,
         "dl": 320000,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 320000,
         "fl": 320000,
         "toast": false,
         "flag": 128,
         "preSell": false,
         "playMaxbr": 320000,
         "downloadMaxbr": 320000
      },
      {
         "id": 1459921229,
         "fee": 8,
         "payed": 0,
         "st": 0,
         "pl": 128000,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 128000,
         "toast": false,
         "flag": 68,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      },
      {
         "id": 25638273,
         "fee": 0,
         "payed": 0,
         "st": 0,
         "pl": 320000,
         "dl": 320000,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 320000,
         "fl": 320000,
         "toast": false,
         "flag": 256,
         "preSell": false,
         "playMaxbr": 320000,
         "downloadMaxbr": 320000
      },
      {
         "id": 1453907054,
         "fee": 8,
         "payed": 0,
         "st": 0,
         "pl": 128000,
         "dl": 0,
         "sp": 7,
         "cp": 1,
         "subp": 1,
         "cs": false,
         "maxbr": 999000,
         "fl": 128000,
         "toast": false,
         "flag": 65,
         "preSell": false,
         "playMaxbr": 999000,
         "downloadMaxbr": 999000
      }
   ]
}