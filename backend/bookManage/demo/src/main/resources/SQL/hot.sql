drop table playlist_hot;
CREATE TABLE playlist_hot(
   playlistTagid              INTEGER  NOT NULL PRIMARY KEY AUTO_INCREMENT
  ,playlistTagname            VARCHAR(25) NOT NULL
  ,playlistTagcategory        INTEGER  NOT NULL
  ,playlistTagusedCount       INTEGER  NOT NULL
  ,playlistTagtype            BIT  NOT NULL
  ,playlistTagposition        INTEGER  NOT NULL
  ,playlistTagcreateTime     varchar(20)
  ,playlistTaghighQuality     BIT  NOT NULL
  ,playlistTaghighQualityPos  INTEGER  NOT NULL
  ,playlistTagofficialPos     INTEGER  NOT NULL
  ,activity                   VARCHAR(5) NOT NULL
  ,hot                        VARCHAR(4) NOT NULL
  ,position                   INTEGER  NOT NULL
  ,category                   INTEGER  NOT NULL
  ,usedCount                  INTEGER  NOT NULL
  ,createTime                 varchar(20)  
  ,name                       VARCHAR(25) NOT NULL
  ,id                         INTEGER  NOT NULL
  ,type                       BIT  NOT NULL
);

select * from playlist_hot;
INSERT INTO playlist_hot(
playlistTagid,
playlistTagname,
playlistTagcategory,
playlistTagusedCount,
playlistTagtype,
playlistTagposition,
playlistTagcreateTime,
playlistTaghighQuality,
playlistTaghighQualityPos,
playlistTagofficialPos,
activity,
hot,
position,
category,
usedCount,
createTime,
name,id,type) VALUES
 (5001,
 'Astanga',
 0,
 6603465,
 0,
 1,1378707544870,1,1,1,'false','true',1,0,6603465,1378707544870,'Astanga',5001,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (1,'AntiGravity',1,6019342,0,2,1378707567870,1,17,1,'false','true',2,1,6019342,1378707567870,'AntiGravity',1,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (2,'Power',1,2441639,0,3,1378707568870,1,19,2,'false','true',3,1,2441639,1378707568870,'Power',2,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (1001,'Pilates',1,2661275,0,4,1378707569870,1,23,3,'false','true',4,1,2661275,1378707569870,'Pilates',1001,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (2004,'Hatha',1,3476491,0,5,1378707570870,1,37,4,'false','true',5,1,3476491,1378707570870,'Hatha',2004,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (10001,'Iyengar',1,1843664,0,6,1387441492331,1,6,20,'false','true',6,1,1843664,1387441492331,'Iyengar',10001,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (2008,'FLOW',1,3030622,0,7,1378707572870,1,36,7,'false','true',7,1,3030622,1378707572870,'FLOW',2008,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (4099180,'yinyoga',4,4890,0,8,1586400155889,0,0,0,'false','true',8,4,4890,1586400155889,'yinyoga',4099180,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (9001,'Vinyasa',4,1950317,0,9,1378707598870,1,16,1,'false','true',9,4,1950317,1378707598870,'Vinyasa',9001,1);
INSERT INTO playlist_hot(playlistTagid,playlistTagname,playlistTagcategory,playlistTagusedCount,playlistTagtype,playlistTagposition,playlistTagcreateTime,playlistTaghighQuality,playlistTaghighQualityPos,playlistTagofficialPos,activity,hot,position,category,usedCount,createTime,name,id,type) VALUES (11002,'Anusara',4,2115324,0,10,1387779676260,1,14,2,'false','true',10,4,2115324,1387779676260,'Anusara',11002,1);
/*

{
   "tags": [
      {
         "playlistTag": {
            "id": 5001,
            "name": "华语",
            "category": 0,
            "usedCount": 6603465,
            "type": 0,
            "position": 1,
            "createTime": 1378707544870,
            "highQuality": 1,
            "highQualityPos": 1,
            "officialPos": 1
         },
         "activity": false,
         "hot": true,
         "position": 1,
         "category": 0,
         "usedCount": 6603465,
         "createTime": 1378707544870,
         "name": "华语",
         "id": 5001,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 1,
            "name": "流行",
            "category": 1,
            "usedCount": 6019342,
            "type": 0,
            "position": 2,
            "createTime": 1378707567870,
            "highQuality": 1,
            "highQualityPos": 17,
            "officialPos": 1
         },
         "activity": false,
         "hot": true,
         "position": 2,
         "category": 1,
         "usedCount": 6019342,
         "createTime": 1378707567870,
         "name": "流行",
         "id": 1,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 2,
            "name": "摇滚",
            "category": 1,
            "usedCount": 2441639,
            "type": 0,
            "position": 3,
            "createTime": 1378707568870,
            "highQuality": 1,
            "highQualityPos": 19,
            "officialPos": 2
         },
         "activity": false,
         "hot": true,
         "position": 3,
         "category": 1,
         "usedCount": 2441639,
         "createTime": 1378707568870,
         "name": "摇滚",
         "id": 2,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 1001,
            "name": "民谣",
            "category": 1,
            "usedCount": 2661275,
            "type": 0,
            "position": 4,
            "createTime": 1378707569870,
            "highQuality": 1,
            "highQualityPos": 23,
            "officialPos": 3
         },
         "activity": false,
         "hot": true,
         "position": 4,
         "category": 1,
         "usedCount": 2661275,
         "createTime": 1378707569870,
         "name": "民谣",
         "id": 1001,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 2004,
            "name": "电子",
            "category": 1,
            "usedCount": 3476491,
            "type": 0,
            "position": 5,
            "createTime": 1378707570870,
            "highQuality": 1,
            "highQualityPos": 37,
            "officialPos": 4
         },
         "activity": false,
         "hot": true,
         "position": 5,
         "category": 1,
         "usedCount": 3476491,
         "createTime": 1378707570870,
         "name": "电子",
         "id": 2004,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 10001,
            "name": "另类/独立",
            "category": 1,
            "usedCount": 1843664,
            "type": 0,
            "position": 6,
            "createTime": 1387441492331,
            "highQuality": 1,
            "highQualityPos": 6,
            "officialPos": 20
         },
         "activity": false,
         "hot": true,
         "position": 6,
         "category": 1,
         "usedCount": 1843664,
         "createTime": 1387441492331,
         "name": "另类/独立",
         "id": 10001,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 2008,
            "name": "轻音乐",
            "category": 1,
            "usedCount": 3030622,
            "type": 0,
            "position": 7,
            "createTime": 1378707572870,
            "highQuality": 1,
            "highQualityPos": 36,
            "officialPos": 7
         },
         "activity": false,
         "hot": true,
         "position": 7,
         "category": 1,
         "usedCount": 3030622,
         "createTime": 1378707572870,
         "name": "轻音乐",
         "id": 2008,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 4099180,
            "name": "综艺",
            "category": 4,
            "usedCount": 4890,
            "type": 0,
            "position": 8,
            "createTime": 1586400155889,
            "highQuality": 0,
            "highQualityPos": 0,
            "officialPos": 0
         },
         "activity": false,
         "hot": true,
         "position": 8,
         "category": 4,
         "usedCount": 4890,
         "createTime": 1586400155889,
         "name": "综艺",
         "id": 4099180,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 9001,
            "name": "影视原声",
            "category": 4,
            "usedCount": 1950317,
            "type": 0,
            "position": 9,
            "createTime": 1378707598870,
            "highQuality": 1,
            "highQualityPos": 16,
            "officialPos": 1
         },
         "activity": false,
         "hot": true,
         "position": 9,
         "category": 4,
         "usedCount": 1950317,
         "createTime": 1378707598870,
         "name": "影视原声",
         "id": 9001,
         "type": 1
      },
      {
         "playlistTag": {
            "id": 11002,
            "name": "ACG",
            "category": 4,
            "usedCount": 2115324,
            "type": 0,
            "position": 10,
            "createTime": 1387779676260,
            "highQuality": 1,
            "highQualityPos": 14,
            "officialPos": 2
         },
         "activity": false,
         "hot": true,
         "position": 10,
         "category": 4,
         "usedCount": 2115324,
         "createTime": 1387779676260,
         "name": "ACG",
         "id": 11002,
         "type": 1
      }
   ],
   "code": 200
}
*/