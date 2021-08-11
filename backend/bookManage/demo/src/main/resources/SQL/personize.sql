drop table personize;
CREATE TABLE personize(
   id                    bigint  NOT NULL PRIMARY KEY AUTO_INCREMENT
  ,type                  BIT  NOT NULL
  ,name                  VARCHAR(25) NOT NULL
  ,copywriter            VARCHAR(27) NOT NULL
  ,picurl                VARCHAR(72) NOT NULL
  ,candislike            VARCHAR(5) NOT NULL
  ,tracknumberupdatetime bigint  NOT NULL
  ,playcount             INTEGER  NOT NULL
  ,trackcount            INTEGER  NOT NULL
  ,highquality           VARCHAR(5) NOT NULL
  ,alg                   VARCHAR(16) NOT NULL
);
INSERT INTO personize(id,type,name,copywriter,picurl,candislike,tracknumberupdatetime,playcount,trackcount,highquality,alg) VALUES (5092808871,0,'I am the One','nice to try','https://p2.music.126.net/wrhvYn7qGztoXFTKrT8SHA==/109951165114585025.jpg','false',1594008411921,3101937,58,'false','featured');
INSERT INTO personize(id,type,name,copywriter,picurl,candislike,tracknumberupdatetime,playcount,trackcount,highquality,alg) VALUES (5073556824,0,' Kiling COVID-19','worth to learn ','https://p2.music.126.net/VjFPFF7FtDXOTiJJHQub6g==/109951165115322622.jpg','false',1595420365466,232745,33,'false','featured');

