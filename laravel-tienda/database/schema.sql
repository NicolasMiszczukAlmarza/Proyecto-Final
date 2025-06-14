PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "migrations" ("id" integer not null primary key autoincrement, "migration" varchar not null, "batch" integer not null);
INSERT INTO migrations VALUES(10,'2019_12_14_000001_create_personal_access_tokens_table',1);
INSERT INTO migrations VALUES(11,'2025_02_06_163043_create_users_table',1);
INSERT INTO migrations VALUES(12,'2025_02_23_151521_create_categorias_table',1);
CREATE TABLE IF NOT EXISTS "personal_access_tokens" ("id" integer not null primary key autoincrement, "tokenable_type" varchar not null, "tokenable_id" integer not null, "name" varchar not null, "token" varchar not null, "abilities" text, "last_used_at" datetime, "expires_at" datetime, "created_at" datetime, "updated_at" datetime);
CREATE TABLE IF NOT EXISTS "users" ("id" integer not null primary key autoincrement, "name" varchar not null, "last_name" varchar not null, "email" varchar not null, "password" varchar not null, "address" varchar not null, "roles" varchar not null default 'normal', "remember_token" varchar, "created_at" datetime, "updated_at" datetime);
INSERT INTO users VALUES(1,'John','Doe','john@example.com','$2y$10$DJYCd6F/5DrJk9al/emHFewjS4b4sKz.Zc2WV64YF0kndfZ6mosqe','123 Fake St','normal',NULL,'2025-02-26 18:53:07','2025-02-26 18:53:07');
INSERT INTO users VALUES(2,'nicobueno','nicobueno','nicobueno@nico.com','$2y$10$Zfjt8XOTowV/lGmNwuSQqe7MAZHyrIAs9YsfU7tvHsICXQi8uTEhC','nicobueno','normal','cMkv3zMjSM3Q6dng7f1dYrjBiB80O2BOOTTxrjVzysVPwugDcmTHzSmRWoPO','2025-02-27 12:49:56','2025-02-27 12:49:56');
INSERT INTO users VALUES(3,'owin','owin','owin@owin.com','$2y$10$4lkw9cer3aRrbPjtJu0Qi.2RUzZT1aUokeL1V3AvMq32/4JHWGX3.','owin','normal','QWMNKuywIFM8yUe64G5D7n5lTjT9KxjHRoPEE7c509uhAUHbTryXrAg99OFq','2025-02-28 19:02:10','2025-02-28 19:02:10');
INSERT INTO users VALUES(5,'nicoprueba@nicoprueba.com','nicoprueba@nicoprueba.com','nicoprueba@nicoprueba.com','$2y$10$mkKhCubIwBbaQ40byNawJeZTutPu.k90ZUYff1hTTAmzCKGwXkbne','nicoprueba@nicoprueba.com','normal','ee1SnkyhGNXgNgd7HQ3CYNcM3BT13U4X9jn0jdz2fkjBw41POgUZjq6C8cjC','2025-03-21 16:18:57','2025-03-21 16:18:57');
CREATE TABLE IF NOT EXISTS "categorias" ("id" integer not null primary key autoincrement, "nombre" varchar not null, "img" varchar not null, "created_at" datetime, "updated_at" datetime);
INSERT INTO categorias VALUES(1,'Placa base','/img/icono/placa.PNG',NULL,NULL);
INSERT INTO categorias VALUES(2,'Procesadores','/img/icono/AMD Ryzen 5 5600X.PNG',NULL,NULL);
INSERT INTO categorias VALUES(3,'RAM','/img/icono/Acer vesta DDR5 6000.JPG',NULL,NULL);
INSERT INTO categorias VALUES(4,'Tarjetas graficas','/img/icono/AMD Radeon RX 6600 XT.PNG',NULL,NULL);
INSERT INTO categorias VALUES(5,'Torres','/img/icono/Antec DF700 Flux.PNG',NULL,NULL);
INSERT INTO categorias VALUES(6,'Fuente de alimentacion','/img/icono/be quiet! Straight Power 11 750W.PNG',NULL,NULL);
INSERT INTO categorias VALUES(7,'Sobremesa','/img/icono/Acer Aspire TC-895-UA91.PNG',NULL,NULL);
INSERT INTO categorias VALUES(8,'Portatiles','/img/icono/Acer Aspire 5.PNG',NULL,NULL);
INSERT INTO categorias VALUES(9,'SSD','/img/icono/ssd.PNG',NULL,NULL);
INSERT INTO categorias VALUES(10,'Discos duros HDD','/img/icono/hdd.PNG',NULL,NULL);
CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    stock INTEGER,
    precio REAL,
    id_categoria INTEGER,
    descripcion TEXT,
    img TEXT,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);
INSERT INTO productos VALUES(232,'ASRock B450 Steel Legend',100,120.9899999999999949,1,'Placa base de alto rendimiento','img/PlacaBase/ASRock B450 Steel Legend.PNG');
INSERT INTO productos VALUES(233,'ASRock B550 Phantom Gaming',80,150.990000000000009,1,'Placa base gaming de calidad premium','img/PlacaBase/ASRock B550 Phantom Gaming.PNG');
INSERT INTO productos VALUES(234,'ASRock Z490 Taichi',60,280.5,1,'Placa base para overclocking avanzado','img/PlacaBase/ASRock Z490 Taichi.PNG');
INSERT INTO productos VALUES(235,'ASUS Prime B450M-A',120,110.75,1,'Placa base confiable y econ├│mica','img/PlacaBase/ASUS Prime B450M-A.PNG');
INSERT INTO productos VALUES(236,'ASUS ROG Crosshair VIII Hero',40,360.0,1,'Placa base de alta gama para gamers','img/PlacaBase/ASUS ROG Crosshair VIII Hero.PNG');
INSERT INTO productos VALUES(237,'ASUS ROG Strix B550-F',50,230.990000000000009,1,'Placa base con excelentes caracter├¡sticas','img/PlacaBase/ASUS ROG Strix B550-F.PNG');
INSERT INTO productos VALUES(238,'ASUS TUF Gaming B550M-PLUS',90,170.990000000000009,1,'Placa base duradera para juegos intensos','img/PlacaBase/ASUS TUF Gaming B550M-PLUS.PNG');
INSERT INTO productos VALUES(239,'Gigabyte B550 AORUS Elite',85,140.8899999999999863,1,'Placa base de dise├▒o elegante y potente','img/PlacaBase/Gigabyte B550 AORUS Elite.PNG');
INSERT INTO productos VALUES(240,'Gigabyte X570 AORUS Elite',75,220.990000000000009,1,'Placa base ideal para PC de gama alta','img/PlacaBase/Gigabyte X570 AORUS Elite.PNG');
INSERT INTO productos VALUES(241,'Gigabyte Z590 AORUS Elite',55,290.4499999999999887,1,'Placa base avanzada con soporte para ├║ltima generaci├│n','img/PlacaBase/Gigabyte Z590 AORUS Elite.PNG');
INSERT INTO productos VALUES(242,'MSI B450 TOMAHAWK MAX',100,130.0,1,'Placa base robusta y confiable','img/PlacaBase/MSI B450 TOMAHAWK MAX.PNG');
INSERT INTO productos VALUES(243,'MSI MAG B550 TOMAHAWK',70,160.0,1,'Placa base gaming de gran rendimiento','img/PlacaBase/MSI MAG B550 TOMAHAWK.PNG');
INSERT INTO productos VALUES(244,'MSI MEG X570 Unify',45,300.0,1,'Placa base de alta gama sin iluminaci├│n RGB','img/PlacaBase/MSI MEG X570 Unify.PNG');
INSERT INTO productos VALUES(245,'MSI MPG Z490 Gaming Edge',65,250.990000000000009,1,'Placa base dise├▒ada para entusiastas','img/PlacaBase/MSI MPG Z490 Gaming Edge.PNG');
INSERT INTO productos VALUES(246,'AMD Ryzen 5 5600X',120,200.0,2,'Procesador de 6 n├║cleos y 12 hilos para alto rendimiento en juegos','img/Procesadores/AMD Ryzen 5 5600X.PNG');
INSERT INTO productos VALUES(247,'AMD Ryzen 5 7600X',100,250.0,2,'Procesador de ├║ltima generaci├│n con tecnolog├¡a avanzada','img/Procesadores/AMD Ryzen 5 7600X.PNG');
INSERT INTO productos VALUES(248,'AMD Ryzen 7 7700X',90,350.0,2,'Procesador de 8 n├║cleos ideal para multitarea y juegos intensos','img/Procesadores/AMD Ryzen 7 7700X.PNG');
INSERT INTO productos VALUES(249,'AMD Ryzen 9 5900X',80,400.0,2,'Procesador de 12 n├║cleos y 24 hilos para creadores de contenido','img/Procesadores/AMD Ryzen 9 5900X.PNG');
INSERT INTO productos VALUES(250,'AMD Ryzen 9 7950X',50,700.0,2,'Procesador de gama alta con 16 n├║cleos y rendimiento extremo','img/Procesadores/AMD Ryzen 9 7950X.PNG');
INSERT INTO productos VALUES(251,'Intel Core i5-13600K',110,300.0,2,'Procesador de gama media-alta con gran eficiencia energ├®tica','img/Procesadores/Intel Core i5-13600K.PNG');
INSERT INTO productos VALUES(252,'Intel Core i7-11700K',95,320.0,2,'Procesador de alto rendimiento para tareas exigentes','img/Procesadores/Intel Core i7-11700K.PNG');
INSERT INTO productos VALUES(253,'Intel Core i7-12700K',85,400.0,2,'Procesador con tecnolog├¡a h├¡brida de ├║ltima generaci├│n','img/Procesadores/Intel Core i7-12700K.PNG');
INSERT INTO productos VALUES(254,'Intel Core i9-12900K',60,600.0,2,'Procesador premium con 16 n├║cleos para entusiastas y profesionales','img/Procesadores/Intel Core i9-12900K.PNG');
INSERT INTO productos VALUES(255,'Intel Core i9-13900K',40,700.0,2,'Procesador de ├║ltima generaci├│n con rendimiento l├¡der en su clase','img/Procesadores/Intel Core i9-13900K.PNG');
INSERT INTO productos VALUES(256,'ADATA XPG Gammix D30',150,60.0,3,'Memoria RAM DDR4 dise├▒ada para rendimiento gaming','img/RAM/ADATA XPG Gammix D30.PNG');
INSERT INTO productos VALUES(257,'Acer vesta DDR5 6000',120,120.0,3,'Memoria RAM DDR5 de alta velocidad para sistemas modernos','img/RAM/Acer vesta DDR5 6000.JPG');
INSERT INTO productos VALUES(258,'Corsair DDR5 6000',100,140.0,3,'Memoria DDR5 optimizada para overclocking y estabilidad','img/RAM/Corsair DDR5 6000.JPG');
INSERT INTO productos VALUES(259,'Corsair Vengeance LPX 16GB',140,80.0,3,'Kit de memoria RAM DDR4 compacto y confiable','img/RAM/Corsair Vengeance LPX 16GB.PNG');
INSERT INTO productos VALUES(260,'Corsair Vengeance LPX',120,75.0,3,'Memoria RAM DDR4 dise├▒ada para alto rendimiento','img/RAM/Corsair Vengeance LPX.PNG');
INSERT INTO productos VALUES(261,'Crucial Ballistix',110,65.0,3,'Memoria RAM DDR4 de gran calidad y rendimiento','img/RAM/Crucial Ballistix.PNG');
INSERT INTO productos VALUES(262,'Crucial Ballistix MAX',80,95.0,3,'Memoria RAM de alto rendimiento para overclockers','img/RAM/Crucial Ballistix MAX.PNG');
INSERT INTO productos VALUES(263,'G.SKILL Ripjaws V',90,70.0,3,'Memoria RAM DDR4 confiable y compatible con m├║ltiples plataformas','img/RAM/G.SKILL Ripjaws V.PNG');
INSERT INTO productos VALUES(264,'Kingston DDR4 3200',130,60.0,3,'Memoria RAM DDR4 con excelente relaci├│n calidad-precio','img/RAM/Kingston DDR4 3200.JPG');
INSERT INTO productos VALUES(265,'Kingston HyperX Fury',110,70.0,3,'Memoria RAM DDR4 de alto rendimiento y dise├▒o llamativo','img/RAM/Kingston HyperX Fury.PNG');
INSERT INTO productos VALUES(266,'Kingston HyperX Predator',100,85.0,3,'Memoria RAM premium para gaming y aplicaciones exigentes','img/RAM/Kingston HyperX Predator.PNG');
INSERT INTO productos VALUES(267,'Team T-Force Vulcan Z',125,65.0,3,'Memoria RAM DDR4 con dise├▒o compacto y gran eficiencia','img/RAM/Team T-Force Vulcan Z.PNG');
INSERT INTO productos VALUES(268,'AMD Radeon RX 6600 XT',100,300.0,4,'Tarjeta gr├ífica ideal para gaming en 1080p','img/TarjetaGrafica/AMD Radeon RX 6600 XT.PNG');
INSERT INTO productos VALUES(269,'AMD Radeon RX 7700 XT',90,450.0,4,'Tarjeta gr├ífica optimizada para gaming en 1440p','img/TarjetaGrafica/AMD Radeon RX 7700 XT.PNG');
INSERT INTO productos VALUES(270,'AMD Radeon RX 7800 XT',80,550.0,4,'Tarjeta gr├ífica potente para juegos en 4K','img/TarjetaGrafica/AMD Radeon RX 7800 XT.PNG');
INSERT INTO productos VALUES(271,'AMD Radeon RX 7900 XT',70,800.0,4,'Tarjeta gr├ífica de alto rendimiento para gamers y creadores','img/TarjetaGrafica/AMD Radeon RX 7900 XT.PNG');
INSERT INTO productos VALUES(272,'AMD Radeon RX 7900 XTX',60,1000.0,4,'Tarjeta gr├ífica de gama alta con capacidades extremas','img/TarjetaGrafica/AMD Radeon RX 7900 XTX.PNG');
INSERT INTO productos VALUES(273,'Gigabyte RTX 4060',120,350.0,4,'Tarjeta gr├ífica compacta con excelente rendimiento en 1080p','img/TarjetaGrafica/Gigabyte rtx 4060.JPG');
INSERT INTO productos VALUES(274,'MSI RTX 4070',110,600.0,4,'Tarjeta gr├ífica eficiente para gaming en 1440p','img/TarjetaGrafica/MSI rtx 4070.JPG');
INSERT INTO productos VALUES(275,'Radeon RX 7900 GRE',50,950.0,4,'Tarjeta gr├ífica avanzada para entusiastas','img/TarjetaGrafica/Radeon rx 7900gre.JPG');
INSERT INTO productos VALUES(276,'NVIDIA GeForce GTX 1660 Super',140,200.0,4,'Tarjeta gr├ífica econ├│mica con buen rendimiento','img/TarjetaGrafica/NVIDIA GeForce GTX 1660 Super.PNG');
INSERT INTO productos VALUES(277,'NVIDIA GeForce RTX 4060 Ti',100,400.0,4,'Tarjeta gr├ífica para juegos fluidos en 1080p y 1440p','img/TarjetaGrafica/NVIDIA GeForce RTX 4060 Ti.PNG');
INSERT INTO productos VALUES(278,'NVIDIA GeForce RTX 4070 Ti',80,700.0,4,'Tarjeta gr├ífica de gama media-alta para gaming avanzado','img/TarjetaGrafica/NVIDIA GeForce RTX 4070 Ti.PNG');
INSERT INTO productos VALUES(279,'NVIDIA GeForce RTX 4080',60,1200.0,4,'Tarjeta gr├ífica de gama alta para gaming y tareas creativas','img/TarjetaGrafica/NVIDIA GeForce RTX 4080.PNG');
INSERT INTO productos VALUES(280,'NVIDIA GeForce RTX 4090',40,1600.0,4,'Tarjeta gr├ífica tope de gama con rendimiento extremo','img/TarjetaGrafica/NVIDIA GeForce RTX 4090.PNG');
INSERT INTO productos VALUES(281,'Antec DF700 Flux',100,90.0,5,'Caja para PC con excelente flujo de aire y dise├▒o moderno','img/Torres/Antec DF700 Flux.PNG');
INSERT INTO productos VALUES(282,'Cooler Master MasterBox TD500',80,120.0,5,'Caja para PC con dise├▒o elegante y panel lateral de cristal templado','img/Torres/Cooler Master MasterBox TD500.PNG');
INSERT INTO productos VALUES(283,'Corsair iCUE 4000X RGB',70,150.0,5,'Torre con iluminaci├│n RGB y opciones de gran flujo de aire','img/Torres/Corsair iCUE 4000X RGB.PNG');
INSERT INTO productos VALUES(284,'Forgeon Arcanite ARGB',90,110.0,5,'Caja para PC con iluminaci├│n ARGB personalizable','img/Torres/Forgeon arcanite argb.JPG');
INSERT INTO productos VALUES(285,'Fractal Design Meshify C',85,100.0,5,'Caja compacta con un dise├▒o optimizado para flujo de aire','img/Torres/Fractal Design Meshify C.PNG');
INSERT INTO productos VALUES(286,'Lian Li Lancool II Mesh',60,130.0,5,'Torre de alta calidad con excelente ventilaci├│n y dise├▒o modular','img/Torres/Lian Li Lancool II Mesh.PNG');
INSERT INTO productos VALUES(287,'NZXT H510',90,80.0,5,'Caja minimalista y moderna con gesti├│n de cables avanzada','img/Torres/NZXT H510.PNG');
INSERT INTO productos VALUES(288,'Nox Hummer Astra',110,70.0,5,'Caja para PC econ├│mica con dise├▒o gaming','img/Torres/Nox hummer astra.JPG');
INSERT INTO productos VALUES(289,'Phanteks Eclipse P400A',75,90.0,5,'Torre con excelente flujo de aire y dise├▒o elegante','img/Torres/Phanteks Eclipse P400A.PNG');
INSERT INTO productos VALUES(290,'SilverStone FARA R1',95,85.0,5,'Caja para PC compacta con dise├▒o limpio y eficiente','img/Torres/SilverStone FARA R1.PNG');
INSERT INTO productos VALUES(291,'Tempest Umbra RGB',100,95.0,5,'Torre con iluminaci├│n RGB para configuraciones gaming','img/Torres/Tempest umbra rgb.JPG');
INSERT INTO productos VALUES(292,'Thermaltake V200 Tempered Glass',80,100.0,5,'Caja con panel lateral de cristal templado y dise├▒o RGB','img/Torres/Thermaltake V200 Tempered Glass.PNG');
INSERT INTO productos VALUES(293,'be quiet! Pure Base 500DX',70,140.0,5,'Torre silenciosa con gran flujo de aire y dise├▒o premium','img/Torres/be quiet! Pure Base 500DX.PNG');
INSERT INTO productos VALUES(294,'Cooler Master MWE Gold 650 V2',120,95.0,6,'Fuente de alimentaci├│n de 650W con certificaci├│n 80+ Gold','img/fuente de alimentacion/Cooler Master MWE Gold 650 V2.PNG');
INSERT INTO productos VALUES(295,'Corsair CV550',100,60.0,6,'Fuente de alimentaci├│n de 550W con certificaci├│n 80+ Bronze','img/fuente de alimentacion/Corsair CV550.PNG');
INSERT INTO productos VALUES(296,'Corsair RM750x',80,130.0,6,'Fuente de 750W con certificaci├│n 80+ Gold y dise├▒o modular','img/fuente de alimentacion/Corsair RM750x.PNG');
INSERT INTO productos VALUES(297,'EVGA SuperNOVA 650 G5',90,110.0,6,'Fuente de alimentaci├│n premium de 650W con certificaci├│n 80+ Gold','img/fuente de alimentacion/EVGA SuperNOVA 650 G5.PNG');
INSERT INTO productos VALUES(298,'Gigabyte P650B',110,70.0,6,'Fuente de alimentaci├│n confiable de 650W con certificaci├│n 80+ Bronze','img/fuente de alimentacion/Gigabyte P650B.PNG');
INSERT INTO productos VALUES(299,'NZXT C750',75,125.0,6,'Fuente de alimentaci├│n modular de 750W con certificaci├│n 80+ Gold','img/fuente de alimentacion/NZXT C750.PNG');
INSERT INTO productos VALUES(300,'Seasonic Focus GX-750',70,140.0,6,'Fuente de alimentaci├│n de 750W con certificaci├│n 80+ Gold y dise├▒o compacto','img/fuente de alimentacion/Seasonic Focus GX-750.PNG');
INSERT INTO productos VALUES(301,'SilverStone ST75F-GS',85,120.0,6,'Fuente de 750W modular con dise├▒o compacto y eficiencia 80+ Gold','img/fuente de alimentacion/SilverStone ST75F-GS.PNG');
INSERT INTO productos VALUES(302,'Thermaltake Toughpower GF1 850W',60,160.0,6,'Fuente de alimentaci├│n de 850W con certificaci├│n 80+ Gold y dise├▒o modular','img/fuente de alimentacion/Thermaltake Toughpower GF1 850W.PNG');
INSERT INTO productos VALUES(303,'be quiet! Straight Power 11 750W',65,150.0,6,'Fuente de 750W con dise├▒o silencioso y certificaci├│n 80+ Platinum','img/fuente de alimentacion/be quiet! Straight Power 11 750W.PNG');
INSERT INTO productos VALUES(304,'ASUS ROG Strix GA15',50,1200.0,7,'PC gaming de alto rendimiento con dise├▒o RGB y potencia avanzada','img/sobremesa/ASUS ROG Strix GA15.PNG');
INSERT INTO productos VALUES(305,'Acer Aspire TC-895-UA91',70,600.0,7,'PC de sobremesa compacto ideal para tareas de oficina y uso diario','img/sobremesa/Acer Aspire TC-895-UA91.PNG');
INSERT INTO productos VALUES(306,'Acer Predator Orion 3000',45,1500.0,7,'Ordenador gaming con dise├▒o futurista y hardware de ├║ltima generaci├│n','img/sobremesa/Acer Predator Orion 3000.PNG');
INSERT INTO productos VALUES(307,'Apple Mac Mini M',60,800.0,7,'PC compacto de Apple con chip M para un rendimiento excelente','img/sobremesa/Apple Mac Mini M.PNG');
INSERT INTO productos VALUES(308,'CyberPowerPC Gamer Xtreme 1',40,1300.0,7,'PC gaming con gran rendimiento gr├ífico y dise├▒o RGB personalizado','img/sobremesa/CyberPowerPC Gamer Xtreme 1.PNG');
INSERT INTO productos VALUES(309,'Dell Inspiron Desktop 3880',80,500.0,7,'PC de sobremesa confiable para uso personal y profesional','img/sobremesa/Dell Inspiron Desktop 3880.PNG');
INSERT INTO productos VALUES(310,'HP EliteDesk 800 G5',65,700.0,7,'PC empresarial con dise├▒o compacto y alto rendimiento','img/sobremesa/HP EliteDesk 800 G5.PNG');
INSERT INTO productos VALUES(311,'HP Pavilion Gaming Desktop',55,1000.0,7,'Ordenador gaming con excelente relaci├│n calidad-precio','img/sobremesa/HP Pavilion Gaming Desktop.PNG');
INSERT INTO productos VALUES(312,'Lenovo IdeaCentre 3',75,450.0,7,'PC compacto ideal para tareas diarias con dise├▒o moderno','img/sobremesa/Lenovo IdeaCentre 3.PNG');
INSERT INTO productos VALUES(313,'MSI Trident 3',50,1100.0,7,'PC gaming compacto con gran potencia y dise├▒o atractivo','img/sobremesa/MSI Trident 3.PNG');
INSERT INTO productos VALUES(314,'ASUS ZenBook 14',60,900.0,8,'Port├ítil ultradelgado y potente con pantalla Full HD','img/portatiles/ASUS ZenBook 14.PNG');
INSERT INTO productos VALUES(315,'Acer Aspire 5',80,600.0,8,'Port├ítil econ├│mico ideal para tareas diarias y trabajo de oficina','img/portatiles/Acer Aspire 5.PNG');
INSERT INTO productos VALUES(316,'Apple MacBook Air M1',50,1200.0,8,'Port├ítil ultradelgado con chip M1 de Apple para un rendimiento excepcional','img/portatiles/Apple MacBook Air M1.PNG');
INSERT INTO productos VALUES(317,'Dell XPS 13',45,1300.0,8,'Port├ítil compacto de alto rendimiento con pantalla InfinityEdge','img/portatiles/Dell XPS 13.PNG');
INSERT INTO productos VALUES(318,'HP Pavilion 15',75,750.0,8,'Port├ítil vers├ítil y potente con buena relaci├│n calidad-precio','img/portatiles/HP Pavilion 15.PNG');
INSERT INTO productos VALUES(319,'Lenovo IdeaPad 3',90,500.0,8,'Port├ítil econ├│mico para tareas de oficina y uso personal','img/portatiles/Lenovo IdeaPad 3.PNG');
INSERT INTO productos VALUES(320,'Microsoft Surface Laptop 4',40,1500.0,8,'Port├ítil premium con pantalla t├íctil y rendimiento r├ípido','img/portatiles/Microsoft Surface Laptop 4.PNG');
INSERT INTO productos VALUES(321,'MSI GF63 Thin',55,850.0,8,'Port├ítil gaming de alto rendimiento con dise├▒o delgado y ligero','img/portatiles/MSI GF63 Thin.PNG');
INSERT INTO productos VALUES(322,'Razer Blade 15',35,1600.0,8,'Port├ítil gaming de gama alta con pantalla Full HD y gr├íficos potentes','img/portatiles/Razer Blade 15.PNG');
INSERT INTO productos VALUES(323,'Samsung Galaxy Book Pro',50,1000.0,8,'Port├ítil ultradelgado con excelente rendimiento y pantalla AMOLED','img/portatiles/Samsung Galaxy Book Pro.PNG');
INSERT INTO productos VALUES(324,'Lenovo IdeaPad 3',80,550.0,8,'Port├ítil con buen rendimiento para uso diario y oficina','img/portatiles/Lenovo IdeaPad 3.PNG');
INSERT INTO productos VALUES(335,'ADATA XPG SX8200 Pro 1TB',50,120.0,9,'SSD de alto rendimiento con 1TB de almacenamiento y velocidades r├ípidas','img/discos duros solidos/ADATA XPG SX8200 Pro 1TB.PNG');
INSERT INTO productos VALUES(336,'Corsair MP600 1TB',60,150.0,9,'SSD de 1TB con interfaz PCIe Gen4, ideal para aplicaciones de alto rendimiento','img/discos duros solidos/Corsair MP600 1TB.PNG');
INSERT INTO productos VALUES(337,'Crucial MX500 1TB',80,90.0,9,'SSD SATA de 1TB con alta fiabilidad y rendimiento s├│lido','img/discos duros solidos/Crucial MX500 1TB.PNG');
INSERT INTO productos VALUES(338,'Kingston A2000 250GB',70,50.0,9,'SSD NVMe de 250GB ideal para usuarios que buscan una actualizaci├│n r├ípida y econ├│mica','img/discos duros solidos/Kingston A2000 250GB.PNG');
INSERT INTO productos VALUES(339,'PNY XLR8 CS3030 1TB',60,110.0,9,'SSD NVMe de 1TB con gran velocidad de lectura y escritura para alto rendimiento','img/discos duros solidos/PNY XLR8 CS3030 1TB.PNG');
INSERT INTO productos VALUES(340,'Samsung 970 EVO Plus 500GB',50,100.0,9,'SSD NVMe de 500GB con tecnolog├¡a de ├║ltima generaci├│n para un rendimiento superior','img/discos duros solidos/Samsung 970 EVO Plus 500GB.PNG');
INSERT INTO productos VALUES(341,'Samsung 980 PRO 500GB',55,130.0,9,'SSD NVMe Gen 4 de 500GB con velocidades ultrarr├ípidas y fiabilidad superior','img/discos duros solidos/Samsung 980 PRO 500GB.PNG');
INSERT INTO productos VALUES(342,'SanDisk Extreme PRO 500GB',65,85.0,9,'SSD NVMe de 500GB, ideal para tareas de alto rendimiento y aplicaciones de gran demanda','img/discos duros solidos/SanDisk Extreme PRO 500GB.PNG');
INSERT INTO productos VALUES(343,'Seagate FireCuda 530 500GB',45,120.0,9,'SSD NVMe de 500GB dise├▒ado para gamers y entusiastas del rendimiento','img/discos duros solidos/Seagate FireCuda 530 500GB.PNG');
INSERT INTO productos VALUES(344,'WD Black SN850 1TB',50,160.0,9,'SSD NVMe de 1TB con velocidades excepcionales para una experiencia gaming sin interrupciones','img/discos duros solidos/WD Black SN850 1TB.PNG');
INSERT INTO productos VALUES(345,'HGST Deskstar 2TB',50,90.0,10,'Disco duro de 2TB de alta capacidad y fiabilidad para almacenamiento general','img/discos duros/HGST Deskstar 2TB.PNG');
INSERT INTO productos VALUES(346,'Hitachi Ultrastar 10TB',30,250.0,10,'Disco duro de 10TB, ideal para almacenamiento masivo y sistemas de servidor','img/discos duros/Hitachi Ultrastar 10TB.PNG');
INSERT INTO productos VALUES(347,'Seagate Barracuda 2TB',60,80.0,10,'Disco duro de 2TB con gran rendimiento para uso personal y dom├®stico','img/discos duros/Seagate Barracuda 2TB.PNG');
INSERT INTO productos VALUES(348,'Seagate IronWolf 6TB',45,150.0,10,'Disco duro de 6TB dise├▒ado para NAS y almacenamiento en red de alto rendimiento','img/discos duros/Seagate IronWolf 6TB.PNG');
INSERT INTO productos VALUES(349,'Seagate SkyHawk 8TB',40,200.0,10,'Disco duro de 8TB ideal para sistemas de videovigilancia y almacenamiento en alta capacidad','img/discos duros/Seagate SkyHawk 8TB.PNG');
INSERT INTO productos VALUES(350,'Toshiba P300 1TB',80,50.0,10,'Disco duro de 1TB con fiabilidad para almacenamiento de archivos b├ísicos','img/discos duros/Toshiba P300 1TB.PNG');
INSERT INTO productos VALUES(351,'Toshiba X300 4TB',50,120.0,10,'Disco duro de 4TB con altas velocidades de lectura y escritura','img/discos duros/Toshiba X300 4TB.PNG');
INSERT INTO productos VALUES(352,'WD Black 1TB',70,110.0,10,'Disco duro de 1TB ideal para gaming y alto rendimiento','img/discos duros/WD Black 1TB.PNG');
INSERT INTO productos VALUES(353,'WD Red 3TB',60,140.0,10,'Disco duro de 3TB optimizado para NAS y almacenamiento en red','img/discos duros/WD Red 3TB.PNG');
INSERT INTO productos VALUES(354,'Western Digital Blue 4TB',50,110.0,10,'Disco duro de 4TB con fiabilidad y buen rendimiento para uso general','img/discos duros/Western Digital Blue 4TB.PNG');
CREATE TABLE pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    id_producto INTEGER NOT NULL,
    correo TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    precioProducto REAL NOT NULL,
    descuento REAL DEFAULT 0,
    precioTotal REAL NOT NULL,
    fecha TEXT DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO pedidos VALUES(1,'order_67f40d66860d12.69633795',287,'nicobueno@nico.com',1,80.0,0.0,80.0,'2025-04-07 17:37:42');
INSERT INTO pedidos VALUES(2,'order_67f40d66860d12.69633795',288,'nicobueno@nico.com',1,70.0,0.0,70.0,'2025-04-07 17:37:42');
INSERT INTO pedidos VALUES(3,'order_67f40e65a0f734.15287699',286,'nicobueno@nico.com',1,130.0,0.0,130.0,'2025-04-07 17:41:57');
INSERT INTO pedidos VALUES(4,'order_67f40e65a0f734.15287699',290,'nicobueno@nico.com',1,85.0,0.0,85.0,'2025-04-07 17:41:57');
INSERT INTO pedidos VALUES(5,'order_67f40f0aada450.17114871',287,'nicobueno@nico.com',1,80.0,0.0,510.0,'2025-04-07 17:44:42');
INSERT INTO pedidos VALUES(6,'order_67f40f0aada450.17114871',288,'nicobueno@nico.com',1,70.0,0.0,510.0,'2025-04-07 17:44:42');
INSERT INTO pedidos VALUES(7,'order_67f40f0aada450.17114871',289,'nicobueno@nico.com',4,90.0,0.0,510.0,'2025-04-07 17:44:42');
INSERT INTO pedidos VALUES(8,'order_67f40fa804e7e8.18665345',298,'nicobueno@nico.com',1,70.0,0.0,525.0,'2025-04-07 17:47:20');
INSERT INTO pedidos VALUES(9,'order_67f40fa804e7e8.18665345',297,'nicobueno@nico.com',3,330.0,0.0,525.0,'2025-04-07 17:47:20');
INSERT INTO pedidos VALUES(10,'order_67f40fa804e7e8.18665345',299,'nicobueno@nico.com',1,125.0,0.0,525.0,'2025-04-07 17:47:20');
INSERT INTO pedidos VALUES(11,'order_67f410416f1212.84135643',379,'nicobueno@nico.com',4,1000.0,0.0,1485.0,'2025-04-07 17:49:53');
INSERT INTO pedidos VALUES(12,'order_67f410416f1212.84135643',380,'nicobueno@nico.com',3,150.0,0.0,1485.0,'2025-04-07 17:49:53');
INSERT INTO pedidos VALUES(13,'order_67f410416f1212.84135643',378,'nicobueno@nico.com',1,200.0,0.0,1485.0,'2025-04-07 17:49:53');
INSERT INTO pedidos VALUES(14,'order_67f410416f1212.84135643',381,'nicobueno@nico.com',2,300.0,0.0,1485.0,'2025-04-07 17:49:53');
INSERT INTO sqlite_sequence VALUES('migrations',12);
INSERT INTO sqlite_sequence VALUES('users',5);
INSERT INTO sqlite_sequence VALUES('categorias',11);
INSERT INTO sqlite_sequence VALUES('productos',354);
INSERT INTO sqlite_sequence VALUES('pedidos',14);
CREATE INDEX "personal_access_tokens_tokenable_type_tokenable_id_index" on "personal_access_tokens" ("tokenable_type", "tokenable_id");
CREATE UNIQUE INDEX "personal_access_tokens_token_unique" on "personal_access_tokens" ("token");
CREATE UNIQUE INDEX "users_email_unique" on "users" ("email");
COMMIT;
