const productos = [

    {
		"id" : 232,
		"nombre" : "ASRock B450 Steel Legend",
		"stock" : 100,
		"precio" : 120.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base de alto rendimiento",
		"img" : "/img/PlacaBase/ASRock B450 Steel Legend.PNG"
	},
	{
		"id" : 233,
		"nombre" : "ASRock B550 Phantom Gaming",
		"stock" : 80,
		"precio" : 150.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base gaming de calidad premium",
		"img" : "/img/PlacaBase/ASRock B550 Phantom Gaming.PNG"
	},
	{
		"id" : 234,
		"nombre" : "ASRock Z490 Taichi",
		"stock" : 60,
		"precio" : 280.50,
		"id_categoria" : 1,
		"descripcion" : "Placa base para overclocking avanzado",
		"img" : "/img/PlacaBase/ASRock Z490 Taichi.PNG"
	},
	{
		"id" : 235,
		"nombre" : "ASUS Prime B450M-A",
		"stock" : 120,
		"precio" : 110.75,
		"id_categoria" : 1,
		"descripcion" : "Placa base confiable y económica",
		"img" : "/img/PlacaBase/ASUS Prime B450M-A.PNG"
	},
	{
		"id" : 236,
		"nombre" : "ASUS ROG Crosshair VIII Hero",
		"stock" : 40,
		"precio" : 360.00,
		"id_categoria" : 1,
		"descripcion" : "Placa base de alta gama para gamers",
		"img" : "/img/PlacaBase/ASUS ROG Crosshair VIII Hero.PNG"
	},
	{
		"id" : 237,
		"nombre" : "ASUS ROG Strix B550-F",
		"stock" : 50,
		"precio" : 230.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base con excelentes características",
		"img" : "/img/PlacaBase/ASUS ROG Strix B550-F.PNG"
	},
	{
		"id" : 238,
		"nombre" : "ASUS TUF Gaming B550M-PLUS",
		"stock" : 90,
		"precio" : 170.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base duradera para juegos intensos",
		"img" : "/img/PlacaBase/ASUS TUF Gaming B550M-PLUS.PNG"
	},
	{
		"id" : 239,
		"nombre" : "Gigabyte B550 AORUS Elite",
		"stock" : 85,
		"precio" : 140.89,
		"id_categoria" : 1,
		"descripcion" : "Placa base de diseño elegante y potente",
		"img" : "/img/PlacaBase/Gigabyte B550 AORUS Elite.PNG"
	},
	{
		"id" : 240,
		"nombre" : "Gigabyte X570 AORUS Elite",
		"stock" : 75,
		"precio" : 220.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base ideal para PC de gama alta",
		"img" : "/img/PlacaBase/Gigabyte X570 AORUS Elite.PNG"
	},
	{
		"id" : 241,
		"nombre" : "Gigabyte Z590 AORUS Elite",
		"stock" : 55,
		"precio" : 290.45,
		"id_categoria" : 1,
		"descripcion" : "Placa base avanzada con soporte para última generación",
		"img" : "/img/PlacaBase/Gigabyte Z590 AORUS Elite.PNG"
	},
	{
		"id" : 242,
		"nombre" : "MSI B450 TOMAHAWK MAX",
		"stock" : 100,
		"precio" : 130.00,
		"id_categoria" : 1,
		"descripcion" : "Placa base robusta y confiable",
		"img" : "/img/PlacaBase/MSI B450 TOMAHAWK MAX.PNG"
	},
	{
		"id" : 243,
		"nombre" : "MSI MAG B550 TOMAHAWK",
		"stock" : 70,
		"precio" : 160.00,
		"id_categoria" : 1,
		"descripcion" : "Placa base gaming de gran rendimiento",
		"img" : "/img/PlacaBase/MSI MAG B550 TOMAHAWK.PNG"
	},
	{
		"id" : 244,
		"nombre" : "MSI MEG X570 Unify",
		"stock" : 45,
		"precio" : 300.00,
		"id_categoria" : 1,
		"descripcion" : "Placa base de alta gama sin iluminación RGB",
		"img" : "/img/PlacaBase/MSI MEG X570 Unify.PNG"
	},
	{
		"id" : 245,
		"nombre" : "MSI MPG Z490 Gaming Edge",
		"stock" : 65,
		"precio" : 250.99,
		"id_categoria" : 1,
		"descripcion" : "Placa base diseñada para entusiastas",
		"img" : "/img/PlacaBase/MSI MPG Z490 Gaming Edge.PNG"
	},
	{
		"id" : 246,
		"nombre" : "AMD Ryzen 5 5600X",
		"stock" : 120,
		"precio" : 200.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de 6 núcleos y 12 hilos para alto rendimiento en juegos",
		"img" : "/img/Procesadores/AMD Ryzen 5 5600X.PNG"
	},
	{
		"id" : 247,
		"nombre" : "AMD Ryzen 5 7600X",
		"stock" : 100,
		"precio" : 250.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de última generación con tecnología avanzada",
		"img" : "/img/Procesadores/AMD Ryzen 5 7600X.PNG"
	},
	{
		"id" : 248,
		"nombre" : "AMD Ryzen 7 7700X",
		"stock" : 90,
		"precio" : 350.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de 8 núcleos ideal para multitarea y juegos intensos",
		"img" : "/img/Procesadores/AMD Ryzen 7 7700X.PNG"
	},
	{
		"id" : 249,
		"nombre" : "AMD Ryzen 9 5900X",
		"stock" : 80,
		"precio" : 400.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de 12 núcleos y 24 hilos para creadores de contenido",
		"img" : "/img/Procesadores/AMD Ryzen 9 5900X.PNG"
	},
	{
		"id" : 250,
		"nombre" : "AMD Ryzen 9 7950X",
		"stock" : 50,
		"precio" : 700.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de gama alta con 16 núcleos y rendimiento extremo",
		"img" : "/img/Procesadores/AMD Ryzen 9 7950X.PNG"
	},
	{
		"id" : 251,
		"nombre" : "Intel Core i5-13600K",
		"stock" : 110,
		"precio" : 300.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de gama media-alta con gran eficiencia energética",
		"img" : "/img/Procesadores/Intel Core i5-13600K.PNG"
	},
	{
		"id" : 252,
		"nombre" : "Intel Core i7-11700K",
		"stock" : 95,
		"precio" : 320.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de alto rendimiento para tareas exigentes",
		"img" : "/img/Procesadores/Intel Core i7-11700K.PNG"
	},
	{
		"id" : 253,
		"nombre" : "Intel Core i7-12700K",
		"stock" : 85,
		"precio" : 400.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador con tecnología híbrida de última generación",
		"img" : "/img/Procesadores/Intel Core i7-12700K.PNG"
	},
	{
		"id" : 254,
		"nombre" : "Intel Core i9-12900K",
		"stock" : 60,
		"precio" : 600.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador premium con 16 núcleos para entusiastas y profesionales",
		"img" : "/img/Procesadores/Intel Core i9-12900K.PNG"
	},
	{
		"id" : 255,
		"nombre" : "Intel Core i9-13900K",
		"stock" : 40,
		"precio" : 700.00,
		"id_categoria" : 2,
		"descripcion" : "Procesador de última generación con rendimiento líder en su clase",
		"img" : "/img/Procesadores/Intel Core i9-13900K.PNG"
	},
	{
		"id" : 256,
		"nombre" : "ADATA XPG Gammix D30",
		"stock" : 150,
		"precio" : 60.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 diseñada para rendimiento gaming",
		"img" : "/img/RAM/ADATA XPG Gammix D30.PNG"
	},
	{
		"id" : 257,
		"nombre" : "Acer vesta DDR5 6000",
		"stock" : 120,
		"precio" : 120.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR5 de alta velocidad para sistemas modernos",
		"img" : "/img/RAM/Acer vesta DDR5 6000.JPG"
	},
	{
		"id" : 258,
		"nombre" : "Corsair DDR5 6000",
		"stock" : 100,
		"precio" : 140.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria DDR5 optimizada para overclocking y estabilidad",
		"img" : "/img/RAM/Corsair DDR5 6000.JPG"
	},
	{
		"id" : 259,
		"nombre" : "Corsair Vengeance LPX 16GB",
		"stock" : 140,
		"precio" : 80.00,
		"id_categoria" : 3,
		"descripcion" : "Kit de memoria RAM DDR4 compacto y confiable",
		"img" : "/img/RAM/Corsair Vengeance LPX 16GB.PNG"
	},
	{
		"id" : 260,
		"nombre" : "Corsair Vengeance LPX",
		"stock" : 120,
		"precio" : 75.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 diseñada para alto rendimiento",
		"img" : "/img/RAM/Corsair Vengeance LPX.PNG"
	},
	{
		"id" : 261,
		"nombre" : "Crucial Ballistix",
		"stock" : 110,
		"precio" : 65.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 de gran calidad y rendimiento",
		"img" : "/img/RAM/Crucial Ballistix.PNG"
	},
	{
		"id" : 262,
		"nombre" : "Crucial Ballistix MAX",
		"stock" : 80,
		"precio" : 95.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM de alto rendimiento para overclockers",
		"img" : "/img/RAM/Crucial Ballistix MAX.PNG"
	},
	{
		"id" : 263,
		"nombre" : "G.SKILL Ripjaws V",
		"stock" : 90,
		"precio" : 70.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 confiable y compatible con múltiples plataformas",
		"img" : "/img/RAM/G.SKILL Ripjaws V.PNG"
	},
	{
		"id" : 264,
		"nombre" : "Kingston DDR4 3200",
		"stock" : 130,
		"precio" : 60.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 con excelente relación calidad-precio",
		"img" : "/img/RAM/Kingston DDR4 3200.JPG"
	},
	{
		"id" : 265,
		"nombre" : "Kingston HyperX Fury",
		"stock" : 110,
		"precio" : 70.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 de alto rendimiento y diseño llamativo",
		"img" : "/img/RAM/Kingston HyperX Fury.PNG"
	},
	{
		"id" : 266,
		"nombre" : "Kingston HyperX Predator",
		"stock" : 100,
		"precio" : 85.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM premium para gaming y aplicaciones exigentes",
		"img" : "/img/RAM/Kingston HyperX Predator.PNG"
	},
	{
		"id" : 267,
		"nombre" : "Team T-Force Vulcan Z",
		"stock" : 125,
		"precio" : 65.00,
		"id_categoria" : 3,
		"descripcion" : "Memoria RAM DDR4 con diseño compacto y gran eficiencia",
		"img" : "/img/RAM/Team T-Force Vulcan Z.PNG"
	},
	{
		"id" : 268,
		"nombre" : "AMD Radeon RX 6600 XT",
		"stock" : 100,
		"precio" : 300.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica ideal para gaming en 1080p",
		"img" : "/img/TarjetaGrafica/AMD Radeon RX 6600 XT.PNG"
	},
	{
		"id" : 269,
		"nombre" : "AMD Radeon RX 7700 XT",
		"stock" : 90,
		"precio" : 450.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica optimizada para gaming en 1440p",
		"img" : "/img/TarjetaGrafica/AMD Radeon RX 7700 XT.PNG"
	},
	{
		"id" : 270,
		"nombre" : "AMD Radeon RX 7800 XT",
		"stock" : 80,
		"precio" : 550.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica potente para juegos en 4K",
		"img" : "/img/TarjetaGrafica/AMD Radeon RX 7800 XT.PNG"
	},
	{
		"id" : 271,
		"nombre" : "AMD Radeon RX 7900 XT",
		"stock" : 70,
		"precio" : 800.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica de alto rendimiento para gamers y creadores",
		"img" : "/img/TarjetaGrafica/AMD Radeon RX 7900 XT.PNG"
	},
	{
		"id" : 272,
		"nombre" : "AMD Radeon RX 7900 XTX",
		"stock" : 60,
		"precio" : 1000.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica de gama alta con capacidades extremas",
		"img" : "/img/TarjetaGrafica/AMD Radeon RX 7900 XTX.PNG"
	},
	{
		"id" : 273,
		"nombre" : "Gigabyte RTX 4060",
		"stock" : 120,
		"precio" : 350.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica compacta con excelente rendimiento en 1080p",
		"img" : "/img/TarjetaGrafica/Gigabyte rtx 4060.JPG"
	},
	{
		"id" : 274,
		"nombre" : "MSI RTX 4070",
		"stock" : 110,
		"precio" : 600.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica eficiente para gaming en 1440p",
		"img" : "/img/TarjetaGrafica/MSI rtx 4070.JPG"
	},
	{
		"id" : 275,
		"nombre" : "Radeon RX 7900 GRE",
		"stock" : 50,
		"precio" : 950.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica avanzada para entusiastas",
		"img" : "/img/TarjetaGrafica/Radeon rx 7900gre.JPG"
	},
	{
		"id" : 276,
		"nombre" : "NVIDIA GeForce GTX 1660 Super",
		"stock" : 140,
		"precio" : 200.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica económica con buen rendimiento",
		"img" : "/img/TarjetaGrafica/NVIDIA GeForce GTX 1660 Super.PNG"
	},
	{
		"id" : 277,
		"nombre" : "NVIDIA GeForce RTX 4060 Ti",
		"stock" : 100,
		"precio" : 400.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica para juegos fluidos en 1080p y 1440p",
		"img" : "/img/TarjetaGrafica/NVIDIA GeForce RTX 4060 Ti.PNG"
	},
	{
		"id" : 278,
		"nombre" : "NVIDIA GeForce RTX 4070 Ti",
		"stock" : 80,
		"precio" : 700.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica de gama media-alta para gaming avanzado",
		"img" : "/img/TarjetaGrafica/NVIDIA GeForce RTX 4070 Ti.PNG"
	},
	{
		"id" : 279,
		"nombre" : "NVIDIA GeForce RTX 4080",
		"stock" : 60,
		"precio" : 1200.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica de gama alta para gaming y tareas creativas",
		"img" : "/img/TarjetaGrafica/NVIDIA GeForce RTX 4080.PNG"
	},
	{
		"id" : 280,
		"nombre" : "NVIDIA GeForce RTX 4090",
		"stock" : 40,
		"precio" : 1600.00,
		"id_categoria" : 4,
		"descripcion" : "Tarjeta gráfica tope de gama con rendimiento extremo",
		"img" : "/img/TarjetaGrafica/NVIDIA GeForce RTX 4090.PNG"
	},
	{
		"id" : 281,
		"nombre" : "Antec DF700 Flux",
		"stock" : 100,
		"precio" : 90.00,
		"id_categoria" : 5,
		"descripcion" : "Caja para PC con excelente flujo de aire y diseño moderno",
		"img" : "/img/Torres/Antec DF700 Flux.PNG"
	},
	{
		"id" : 282,
		"nombre" : "Cooler Master MasterBox TD500",
		"stock" : 80,
		"precio" : 120.00,
		"id_categoria" : 5,
		"descripcion" : "Caja para PC con diseño elegante y panel lateral de cristal templado",
		"img" : "/img/Torres/Cooler Master MasterBox TD500.PNG"
	},
	{
		"id" : 283,
		"nombre" : "Corsair iCUE 4000X RGB",
		"stock" : 70,
		"precio" : 150.00,
		"id_categoria" : 5,
		"descripcion" : "Torre con iluminación RGB y opciones de gran flujo de aire",
		"img" : "/img/Torres/Corsair iCUE 4000X RGB.PNG"
	},
	{
		"id" : 284,
		"nombre" : "Forgeon Arcanite ARGB",
		"stock" : 90,
		"precio" : 110.00,
		"id_categoria" : 5,
		"descripcion" : "Caja para PC con iluminación ARGB personalizable",
		"img" : "/img/Torres/Forgeon arcanite argb.JPG"
	},
	{
		"id" : 285,
		"nombre" : "Fractal Design Meshify C",
		"stock" : 85,
		"precio" : 100.00,
		"id_categoria" : 5,
		"descripcion" : "Caja compacta con un diseño optimizado para flujo de aire",
		"img" : "/img/Torres/Fractal Design Meshify C.PNG"
	},
	{
		"id" : 286,
		"nombre" : "Lian Li Lancool II Mesh",
		"stock" : 60,
		"precio" : 130.00,
		"id_categoria" : 5,
		"descripcion" : "Torre de alta calidad con excelente ventilación y diseño modular",
		"img" : "/img/Torres/Lian Li Lancool II Mesh.PNG"
	},
	{
		"id" : 287,
		"nombre" : "NZXT H510",
		"stock" : 90,
		"precio" : 80.00,
		"id_categoria" : 5,
		"descripcion" : "Caja minimalista y moderna con gestión de cables avanzada",
		"img" : "/img/Torres/NZXT H510.PNG"
	},
	{
		"id" : 288,
		"nombre" : "Nox Hummer Astra",
		"stock" : 110,
		"precio" : 70.00,
		"id_categoria" : 5,
		"descripcion" : "Caja para PC económica con diseño gaming",
		"img" : "/img/Torres/Nox hummer astra.JPG"
	},
	{
		"id" : 289,
		"nombre" : "Phanteks Eclipse P400A",
		"stock" : 75,
		"precio" : 90.00,
		"id_categoria" : 5,
		"descripcion" : "Torre con excelente flujo de aire y diseño elegante",
		"img" : "/img/Torres/Phanteks Eclipse P400A.PNG"
	},
	{
		"id" : 290,
		"nombre" : "SilverStone FARA R1",
		"stock" : 95,
		"precio" : 85.00,
		"id_categoria" : 5,
		"descripcion" : "Caja para PC compacta con diseño limpio y eficiente",
		"img" : "/img/Torres/SilverStone FARA R1.PNG"
	},
	{
		"id" : 291,
		"nombre" : "Tempest Umbra RGB",
		"stock" : 100,
		"precio" : 95.00,
		"id_categoria" : 5,
		"descripcion" : "Torre con iluminación RGB para configuraciones gaming",
		"img" : "/img/Torres/Tempest umbra rgb.JPG"
	},
	{
		"id" : 292,
		"nombre" : "Thermaltake V200 Tempered Glass",
		"stock" : 80,
		"precio" : 100.00,
		"id_categoria" : 5,
		"descripcion" : "Caja con panel lateral de cristal templado y diseño RGB",
		"img" : "/img/Torres/Thermaltake V200 Tempered Glass.PNG"
	},
	{
		"id" : 293,
		"nombre" : "be quiet! Pure Base 500DX",
		"stock" : 70,
		"precio" : 140.00,
		"id_categoria" : 5,
		"descripcion" : "Torre silenciosa con gran flujo de aire y diseño premium",
		"img" : "/img/Torres/be quiet! Pure Base 500DX.PNG"
	},
	{
		"id" : 294,
		"nombre" : "Cooler Master MWE Gold 650 V2",
		"stock" : 120,
		"precio" : 95.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación de 650W con certificación 80+ Gold",
		"img" : "/img/fuente de alimentacion/Cooler Master MWE Gold 650 V2.PNG"
	},
	{
		"id" : 295,
		"nombre" : "Corsair CV550",
		"stock" : 100,
		"precio" : 60.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación de 550W con certificación 80+ Bronze",
		"img" : "/img/fuente de alimentacion/Corsair CV550.PNG"
	},
	{
		"id" : 296,
		"nombre" : "Corsair RM750x",
		"stock" : 80,
		"precio" : 130.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de 750W con certificación 80+ Gold y diseño modular",
		"img" : "/img/fuente de alimentacion/Corsair RM750x.PNG"
	},
	{
		"id" : 297,
		"nombre" : "EVGA SuperNOVA 650 G5",
		"stock" : 90,
		"precio" : 110.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación premium de 650W con certificación 80+ Gold",
		"img" : "/img/fuente de alimentacion/EVGA SuperNOVA 650 G5.PNG"
	},
	{
		"id" : 298,
		"nombre" : "Gigabyte P650B",
		"stock" : 110,
		"precio" : 70.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación confiable de 650W con certificación 80+ Bronze",
		"img" : "/img/fuente de alimentacion/Gigabyte P650B.PNG"
	},
	{
		"id" : 299,
		"nombre" : "NZXT C750",
		"stock" : 75,
		"precio" : 125.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación modular de 750W con certificación 80+ Gold",
		"img" : "/img/fuente de alimentacion/NZXT C750.PNG"
	},
	{
		"id" : 300,
		"nombre" : "Seasonic Focus GX-750",
		"stock" : 70,
		"precio" : 140.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación de 750W con certificación 80+ Gold y diseño compacto",
		"img" : "/img/fuente de alimentacion/Seasonic Focus GX-750.PNG"
	},
	{
		"id" : 301,
		"nombre" : "SilverStone ST75F-GS",
		"stock" : 85,
		"precio" : 120.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de 750W modular con diseño compacto y eficiencia 80+ Gold",
		"img" : "/img/fuente de alimentacion/SilverStone ST75F-GS.PNG"
	},
	{
		"id" : 302,
		"nombre" : "Thermaltake Toughpower GF1 850W",
		"stock" : 60,
		"precio" : 160.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de alimentación de 850W con certificación 80+ Gold y diseño modular",
		"img" : "/img/fuente de alimentacion/Thermaltake Toughpower GF1 850W.PNG"
	},
	{
		"id" : 303,
		"nombre" : "be quiet! Straight Power 11 750W",
		"stock" : 65,
		"precio" : 150.00,
		"id_categoria" : 6,
		"descripcion" : "Fuente de 750W con diseño silencioso y certificación 80+ Platinum",
		"img" : "/img/fuente de alimentacion/be quiet! Straight Power 11 750W.PNG"
	},
	{
		"id" : 304,
		"nombre" : "ASUS ROG Strix GA15",
		"stock" : 50,
		"precio" : 1200.00,
		"id_categoria" : 7,
		"descripcion" : "PC gaming de alto rendimiento con diseño RGB y potencia avanzada",
		"img" : "/img/sobremesa/ASUS ROG Strix GA15.PNG"
	},
	{
		"id" : 305,
		"nombre" : "Acer Aspire TC-895-UA91",
		"stock" : 70,
		"precio" : 600.00,
		"id_categoria" : 7,
		"descripcion" : "PC de sobremesa compacto ideal para tareas de oficina y uso diario",
		"img" : "/img/sobremesa/Acer Aspire TC-895-UA91.PNG"
	},
	{
		"id" : 306,
		"nombre" : "Acer Predator Orion 3000",
		"stock" : 45,
		"precio" : 1500.00,
		"id_categoria" : 7,
		"descripcion" : "Ordenador gaming con diseño futurista y hardware de última generación",
		"img" : "/img/sobremesa/Acer Predator Orion 3000.PNG"
	},
	{
		"id" : 307,
		"nombre" : "Apple Mac Mini M",
		"stock" : 60,
		"precio" : 800.00,
		"id_categoria" : 7,
		"descripcion" : "PC compacto de Apple con chip M para un rendimiento excelente",
		"img" : "/img/sobremesa/Apple Mac Mini M.PNG"
	},
	{
		"id" : 308,
		"nombre" : "CyberPowerPC Gamer Xtreme 1",
		"stock" : 40,
		"precio" : 1300.00,
		"id_categoria" : 7,
		"descripcion" : "PC gaming con gran rendimiento gráfico y diseño RGB personalizado",
		"img" : "/img/sobremesa/CyberPowerPC Gamer Xtreme 1.PNG"
	},
	{
		"id" : 309,
		"nombre" : "Dell Inspiron Desktop 3880",
		"stock" : 80,
		"precio" : 500.00,
		"id_categoria" : 7,
		"descripcion" : "PC de sobremesa confiable para uso personal y profesional",
		"img" : "/img/sobremesa/Dell Inspiron Desktop 3880.PNG"
	},
	{
		"id" : 310,
		"nombre" : "HP EliteDesk 800 G5",
		"stock" : 65,
		"precio" : 700.00,
		"id_categoria" : 7,
		"descripcion" : "PC empresarial con diseño compacto y alto rendimiento",
		"img" : "/img/sobremesa/HP EliteDesk 800 G5.PNG"
	},
	{
		"id" : 311,
		"nombre" : "HP Pavilion Gaming Desktop",
		"stock" : 55,
		"precio" : 1000.00,
		"id_categoria" : 7,
		"descripcion" : "Ordenador gaming con excelente relación calidad-precio",
		"img" : "/img/sobremesa/HP Pavilion Gaming Desktop.PNG"
	},
	{
		"id" : 312,
		"nombre" : "Lenovo IdeaCentre 3",
		"stock" : 75,
		"precio" : 450.00,
		"id_categoria" : 7,
		"descripcion" : "PC compacto ideal para tareas diarias con diseño moderno",
		"img" : "/img/sobremesa/Lenovo IdeaCentre 3.PNG"
	},
	{
		"id" : 313,
		"nombre" : "MSI Trident 3",
		"stock" : 50,
		"precio" : 1100.00,
		"id_categoria" : 7,
		"descripcion" : "PC gaming compacto con gran potencia y diseño atractivo",
		"img" : "/img/sobremesa/MSI Trident 3.PNG"
	},
	{
		"id" : 314,
		"nombre" : "ASUS ZenBook 14",
		"stock" : 60,
		"precio" : 900.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil ultradelgado y potente con pantalla Full HD",
		"img" : "/img/portatiles/ASUS ZenBook 14.PNG"
	},
	{
		"id" : 315,
		"nombre" : "Acer Aspire 5",
		"stock" : 80,
		"precio" : 600.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil económico ideal para tareas diarias y trabajo de oficina",
		"img" : "/img/portatiles/Acer Aspire 5.PNG"
	},
	{
		"id" : 316,
		"nombre" : "Apple MacBook Air M1",
		"stock" : 50,
		"precio" : 1200.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil ultradelgado con chip M1 de Apple para un rendimiento excepcional",
		"img" : "/img/portatiles/Apple MacBook Air M1.PNG"
	},
	{
		"id" : 317,
		"nombre" : "Dell XPS 13",
		"stock" : 45,
		"precio" : 1300.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil compacto de alto rendimiento con pantalla InfinityEdge",
		"img" : "/img/portatiles/Dell XPS 13.PNG"
	},
	{
		"id" : 318,
		"nombre" : "HP Pavilion 15",
		"stock" : 75,
		"precio" : 750.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil versátil y potente con buena relación calidad-precio",
		"img" : "/img/portatiles/HP Pavilion 15.PNG"
	},
	{
		"id" : 319,
		"nombre" : "Lenovo IdeaPad 3",
		"stock" : 90,
		"precio" : 500.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil económico para tareas de oficina y uso personal",
		"img" : "/img/portatiles/Lenovo IdeaPad 3.PNG"
	},
	{
		"id" : 320,
		"nombre" : "Microsoft Surface Laptop 4",
		"stock" : 40,
		"precio" : 1500.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil premium con pantalla táctil y rendimiento rápido",
		"img" : "/img/portatiles/Microsoft Surface Laptop 4.PNG"
	},
	{
		"id" : 321,
		"nombre" : "MSI GF63 Thin",
		"stock" : 55,
		"precio" : 850.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil gaming de alto rendimiento con diseño delgado y ligero",
		"img" : "/img/portatiles/MSI GF63 Thin.PNG"
	},
	{
		"id" : 322,
		"nombre" : "Razer Blade 15",
		"stock" : 35,
		"precio" : 1600.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil gaming de gama alta con pantalla Full HD y gráficos potentes",
		"img" : "/img/portatiles/Razer Blade 15.PNG"
	},
	{
		"id" : 323,
		"nombre" : "Samsung Galaxy Book Pro",
		"stock" : 50,
		"precio" : 1000.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil ultradelgado con excelente rendimiento y pantalla AMOLED",
		"img" : "/img/portatiles/Samsung Galaxy Book Pro.PNG"
	},
	{
		"id" : 324,
		"nombre" : "Lenovo IdeaPad 3",
		"stock" : 80,
		"precio" : 550.00,
		"id_categoria" : 8,
		"descripcion" : "Portátil con buen rendimiento para uso diario y oficina",
		"img" : "/img/portatiles/Lenovo IdeaPad 3.PNG"
	},
	{
		"id" : 365,
		"nombre" : "ADATA XPG SX8200 Pro 1TB",
		"stock" : 50,
		"precio" : 150.00,
		"id_categoria" : 9,
		"descripcion" : "SSD de alto rendimiento para gaming y tareas intensivas.",
		"img" : "/img/ssd/ADATA XPG SX8200 Pro 1TB.PNG"
	},
	{
		"id" : 366,
		"nombre" : "Corsair MP600 1TB",
		"stock" : 50,
		"precio" : 170.00,
		"id_categoria" : 9,
		"descripcion" : "SSD NVMe con gran velocidad y durabilidad.",
		"img" : "/img/ssd/Corsair MP600 1TB.PNG"
	},
	{
		"id" : 367,
		"nombre" : "Crucial MX500 1TB",
		"stock" : 50,
		"precio" : 120.00,
		"id_categoria" : 9,
		"descripcion" : "SSD confiable y económico, ideal para almacenamiento general.",
		"img" : "/img/ssd/Crucial MX500 1TB.PNG"
	},
	{
		"id" : 368,
		"nombre" : "Kingston A2000 250GB",
		"stock" : 50,
		"precio" : 60.00,
		"id_categoria" : 9,
		"descripcion" : "SSD compacto y eficiente para laptops y PCs.",
		"img" : "/img/ssd/Kingston A2000 250GB.PNG"
	},
	{
		"id" : 369,
		"nombre" : "PNY XLR8 CS3030 1TB",
		"stock" : 50,
		"precio" : 140.00,
		"id_categoria" : 9,
		"descripcion" : "SSD NVMe con alta velocidad de lectura y escritura.",
		"img" : "/img/ssd/PNY XLR8 CS3030 1TB.PNG"
	},
	{
		"id" : 370,
		"nombre" : "Samsung 970 EVO Plus 500GB",
		"stock" : 50,
		"precio" : 130.00,
		"id_categoria" : 9,
		"descripcion" : "SSD con rendimiento superior y fiabilidad Samsung.",
		"img" : "/img/ssd/Samsung 970 EVO Plus 500GB.PNG"
	},
	{
		"id" : 371,
		"nombre" : "Samsung 980 PRO 500GB",
		"stock" : 50,
		"precio" : 180.00,
		"id_categoria" : 9,
		"descripcion" : "SSD de última generación con velocidades impresionantes.",
		"img" : "/img/ssd/Samsung 980 PRO 500GB.PNG"
	},
	{
		"id" : 372,
		"nombre" : "SanDisk Extreme PRO 500GB",
		"stock" : 50,
		"precio" : 140.00,
		"id_categoria" : 9,
		"descripcion" : "SSD portátil con alta resistencia y velocidad.",
		"img" : "/img/ssd/SanDisk Extreme PRO 500GB.PNG"
	},
	{
		"id" : 373,
		"nombre" : "Seagate FireCuda 530 500GB",
		"stock" : 50,
		"precio" : 160.00,
		"id_categoria" : 9,
		"descripcion" : "SSD NVMe diseñado para gaming de alto nivel.",
		"img" : "/img/ssd/Seagate FireCuda 530 500GB.PNG"
	},
	{
		"id" : 374,
		"nombre" : "WD Black SN850 1TB",
		"stock" : 50,
		"precio" : 190.00,
		"id_categoria" : 9,
		"descripcion" : "SSD premium para gaming y aplicaciones pesadas.",
		"img" : "/img/ssd/WD Black SN850 1TB.PNG"
	},
	{
		"id" : 375,
		"nombre" : "HGST Deskstar 2TB",
		"stock" : 50,
		"precio" : 90.00,
		"id_categoria" : 10,
		"descripcion" : "Disco duro de alto rendimiento con 2TB de capacidad.",
		"img" : "/img/hdd/HGST Deskstar 2TB.PNG"
	},
	{
		"id" : 376,
		"nombre" : "Hitachi Ultrastar 10TB",
		"stock" : 50,
		"precio" : 300.00,
		"id_categoria" : 10,
		"descripcion" : "Disco duro confiable para almacenamiento masivo.",
		"img" : "/img/hdd/Hitachi Ultrastar 10TB.PNG"
	},
	{
		"id" : 377,
		"nombre" : "Seagate Barracuda 2TB",
		"stock" : 50,
		"precio" : 80.00,
		"id_categoria" : 10,
		"descripcion" : "Disco duro versátil para PCs de escritorio.",
		"img" : "/img/hdd/Seagate Barracuda 2TB.PNG"
	},
	{
		"id" : 378,
		"nombre" : "Seagate IronWolf 6TB",
		"stock" : 50,
		"precio" : 200.00,
		"id_categoria" : 10,
		"descripcion" : "Diseñado para NAS, con 6TB y alta fiabilidad.",
		"img" : "/img/hdd/Seagate IronWolf 6TB.PNG"
	},
	{
		"id" : 379,
		"nombre" : "Seagate SkyHawk 8TB",
		"stock" : 50,
		"precio" : 250.00,
		"id_categoria" : 10,
		"descripcion" : "Optimizado para videovigilancia con 8TB.",
		"img" : "/img/hdd/Seagate SkyHawk 8TB.PNG"
	},
	{
		"id" : 380,
		"nombre" : "Toshiba P300 1TB",
		"stock" : 50,
		"precio" : 50.00,
		"id_categoria" : 10,
		"descripcion" : "Disco duro de 1TB, ideal para uso diario.",
		"img" : "/img/hdd/Toshiba P300 1TB.PNG"
	},
	{
		"id" : 381,
		"nombre" : "Toshiba X300 4TB",
		"stock" : 50,
		"precio" : 150.00,
		"id_categoria" : 10,
		"descripcion" : "Alto rendimiento con 4TB de capacidad.",
		"img" : "/img/hdd/Toshiba X300 4TB.PNG"
	},
	{
		"id" : 382,
		"nombre" : "WD Black 1TB",
		"stock" : 50,
		"precio" : 75.00,
		"id_categoria" : 10,
		"descripcion" : "Rendimiento superior para tareas exigentes.",
		"img" : "/img/hdd/WD Black 1TB.PNG"
	},
	{
		"id" : 383,
		"nombre" : "WD Red 3TB",
		"stock" : 50,
		"precio" : 120.00,
		"id_categoria" : 10,
		"descripcion" : "Diseñado para sistemas NAS con 3TB.",
		"img" : "/img/hdd/WD Red 3TB.PNG"
	},
	{
		"id" : 384,
		"nombre" : "Western Digital Blue 4TB",
		"stock" : 50,
		"precio" : 110.00,
		"id_categoria" : 10,
		"descripcion" : "Disco confiable y económico para uso general.",
		"img" : "/img/hdd/Western Digital Blue 4TB.PNG"
	}


];

export {
    productos
}
