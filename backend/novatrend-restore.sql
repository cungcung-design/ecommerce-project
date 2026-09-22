--
-- PostgreSQL database dump
--

\restrict 9k5V9TcC7nI0uuYqkNy3vKjZzSG8uVwCiWYTlIAAcaVtpET7WHhDimPjgsIWwwv

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES (1, 'Admin', 'admin@example.com', '$2b$10$OoxavldSOUPZWvazYZ121evUsBlcKYEscEDb431rcx60AZwCrHC3q', 'ADMIN', '2026-08-12 10:38:12.171', '2026-08-12 10:38:12.171', true);
INSERT INTO public."User" VALUES (2, 'Test Customer 1786543670097', 'test1786543670097@example.com', '$2b$12$NHq0DNWlIxhVgCfkG35Zeu6rwTFctCaztthVpgn9EDB8b4.oXa7DS', 'CUSTOMER', '2026-08-12 14:07:50.369', '2026-08-12 14:07:50.369', true);
INSERT INTO public."User" VALUES (3, 'Order Test', 'order1786544328629@test.com', '$2b$12$3lZG6Ew.qP1TN1ftdL7ODeNs2qjbFEQRjk02afDh5JslZPVZnwp/i', 'CUSTOMER', '2026-08-12 14:18:48.996', '2026-08-12 14:18:48.996', true);
INSERT INTO public."User" VALUES (4, 'Order Test', 'order1786544542289@test.com', '$2b$12$PNaiID7rtWOTLP.X/jeEu.7x0ak8YzUTv50vwYWHDIzSf0nkqljRi', 'CUSTOMER', '2026-08-12 14:22:22.653', '2026-08-12 14:22:22.653', true);
INSERT INTO public."User" VALUES (5, 'Order Test', 'order1786544568730@test.com', '$2b$12$9N9b6SbWr8glCMHqNP0gXufdDc2adplNvwY96lItrz2PWCAapDO/S', 'CUSTOMER', '2026-08-12 14:22:48.982', '2026-08-12 14:23:09.026', true);


--
-- Data for Name: Cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Cart" VALUES (1, 4, '2026-08-12 14:22:22.75', '2026-08-12 14:22:22.75');
INSERT INTO public."Cart" VALUES (2, 5, '2026-08-12 14:22:49.085', '2026-08-12 14:22:49.085');
INSERT INTO public."Cart" VALUES (3, 1, '2026-08-13 10:15:19.859', '2026-08-13 10:15:19.859');


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Category" VALUES (1, 'Electronics', '2026-08-12 10:38:12.302', '2026-08-12 10:38:12.302', true);
INSERT INTO public."Category" VALUES (2, 'Fashion', '2026-08-12 10:38:12.315', '2026-08-12 10:38:12.315', true);
INSERT INTO public."Category" VALUES (3, 'Smart Watch', '2026-08-12 10:46:35.398', '2026-08-12 10:46:35.398', true);
INSERT INTO public."Category" VALUES (5, 'Beauty', '2026-08-13 07:51:46.106', '2026-08-13 07:51:46.106', true);
INSERT INTO public."Category" VALUES (6, 'Fitness', '2026-08-13 07:52:01.505', '2026-08-13 07:52:01.505', true);
INSERT INTO public."Category" VALUES (8, 'Accessories', '2026-08-13 07:52:51.538', '2026-08-13 07:52:51.538', true);
INSERT INTO public."Category" VALUES (7, 'Home Decor', '2026-08-13 07:52:22.555', '2026-08-13 10:05:10.657', true);


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Product" VALUES (21, 'Power Bank', 'High-capacity 30W fast-charging power bank with an LED display and built-in cable', 10.00, 8, 1, '2026-08-13 08:23:11.814', '2026-08-13 08:23:11.814', 'ecommerce/products/v81vwxmp0w12moa58bvx', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609395/ecommerce/products/v81vwxmp0w12moa58bvx.jpg', true);
INSERT INTO public."Product" VALUES (22, 'Phone Stand', 'Foldable desktop stand with an adjustable height and angle for hands-free viewing', 4.00, 5, 1, '2026-08-13 08:24:48.264', '2026-08-13 08:24:48.264', 'ecommerce/products/mh8ke9idmhpwag9qq4n3', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609491/ecommerce/products/mh8ke9idmhpwag9qq4n3.jpg', true);
INSERT INTO public."Product" VALUES (23, 'Phone Charger', 'Fast-charging wall adapter with a USB-C to Lightning cable', 8.00, 4, 1, '2026-08-13 08:26:57.431', '2026-08-13 08:26:57.431', 'ecommerce/products/a4ux6uii20newz7luc71', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609621/ecommerce/products/a4ux6uii20newz7luc71.jpg', true);
INSERT INTO public."Product" VALUES (25, 'Wireless Speaker', 'Compact Bluetooth speaker with a fabric mesh design and active bass radiators, available in multiple colors', 8.00, 9, 1, '2026-08-13 08:31:46.379', '2026-08-13 08:31:46.379', 'ecommerce/products/yoevitiwv5orhcpnzci7', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609910/ecommerce/products/yoevitiwv5orhcpnzci7.jpg', true);
INSERT INTO public."Product" VALUES (20, 'Wireless Headphones', 'Sleek black wireless over-ear headphones delivering immersive sound and all-day comfort', 5.00, 5, 1, '2026-08-13 08:20:17.09', '2026-08-13 08:32:02.189', 'ecommerce/products/zllbohk2kfys0gmphdsu', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609221/ecommerce/products/zllbohk2kfys0gmphdsu.jpg', true);
INSERT INTO public."Product" VALUES (26, 'Toothbrush', 'Ergonomic toothbrush designed for effective daily oral care', 2.00, 15, 5, '2026-08-13 08:40:13.897', '2026-08-13 08:40:13.897', 'ecommerce/products/vlakzgttdqvkfz6fmjvj', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610417/ecommerce/products/vlakzgttdqvkfz6fmjvj.jpg', true);
INSERT INTO public."Product" VALUES (27, 'Toothpaste', 'Fluoride toothpaste infused with cooling crystals for long-lasting fresh breath', 2.00, 18, 5, '2026-08-13 08:40:57.303', '2026-08-13 08:40:57.303', 'ecommerce/products/gzn1mpr7m4ldcvsvgcuh', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610461/ecommerce/products/gzn1mpr7m4ldcvsvgcuh.jpg', true);
INSERT INTO public."Product" VALUES (6, 'ecommerce-db', 'hell ob apnafbsbsbsfsfssv', 200.00, 2, 3, '2026-08-12 10:51:48.057', '2026-08-13 07:31:11.46', 'ecommerce/products/nplvasxev0iibsdzi2b8', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786606275/ecommerce/products/nplvasxev0iibsdzi2b8.png', true);
INSERT INTO public."Product" VALUES (14, 'Casual White Shirt & Jeans Set', 'A classic, comfortable smart-casual outfit featuring a crisp white button-down shirt and light-wash denim jeans.', 5.00, 10, 2, '2026-08-13 07:59:29.658', '2026-08-13 07:59:29.658', 'ecommerce/products/rn8vktgeozsftjgddnty', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786607973/ecommerce/products/rn8vktgeozsftjgddnty.jpg', true);
INSERT INTO public."Product" VALUES (15, 'Yellow Button-Down Shirt & Black Jeans Set', 'A vibrant yellow long-sleeve shirt paired with classic black denim jeans for a smart-casual contrast', 5.00, 7, 2, '2026-08-13 08:05:40.545', '2026-08-13 08:05:40.545', 'ecommerce/products/r4yl0upmbf5rotgnxwjh', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786608344/ecommerce/products/r4yl0upmbf5rotgnxwjh.jpg', true);
INSERT INTO public."Product" VALUES (16, 'Mustard Overshirt', 'A layered casual outfit featuring a rich mustard', 4.00, 7, 2, '2026-08-13 08:06:44.301', '2026-08-13 08:06:44.301', 'ecommerce/products/oh9ybkulm8vqbp4rftzk', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786608408/ecommerce/products/oh9ybkulm8vqbp4rftzk.jpg', true);
INSERT INTO public."Product" VALUES (29, 'Parfum', 'Luxury men''s fragrance featuring rich, fresh, and woody aromatic notes', 12.00, 42, 5, '2026-08-13 08:43:07.974', '2026-08-13 08:43:07.974', 'ecommerce/products/tob0sizxbwsqhxypcwxh', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610591/ecommerce/products/tob0sizxbwsqhxypcwxh.jpg', true);
INSERT INTO public."Product" VALUES (17, 'Blue Striped Overshirt', 'A layered casual outfit featuring a blue and white striped button-up overshirt paired with a basic white t-shirt', 4.00, 8, 2, '2026-08-13 08:09:35.708', '2026-08-13 08:09:35.708', 'ecommerce/products/tisuw1krsdiju2qor2dy', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786608579/ecommerce/products/tisuw1krsdiju2qor2dy.jpg', true);
INSERT INTO public."Product" VALUES (30, 'Roll-On', '48-hour deodorant roll-on infused with Nivea Creme ingredients for gentle skin protection', 4.00, 12, 5, '2026-08-13 08:44:16.486', '2026-08-13 08:44:16.486', 'ecommerce/products/bqplapi0qaokaan2nl8y', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610660/ecommerce/products/bqplapi0qaokaan2nl8y.jpg', true);
INSERT INTO public."Product" VALUES (18, 'Light Blue Button-Down Shirt', 'A clean, classic solid light blue long-sleeve shirt with a front chest pocket', 4.00, 7, 2, '2026-08-13 08:10:20.377', '2026-08-13 08:12:53.472', 'ecommerce/products/m4me5xobsja3lv69iziz', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786608776/ecommerce/products/m4me5xobsja3lv69iziz.jpg', true);
INSERT INTO public."Product" VALUES (19, 'Black Overshirt', 'A stylish layered look featuring a versatile long-sleeve black button-up overshirt worn open over a basic white t-shirt', 3.00, 8, 2, '2026-08-13 08:12:36.622', '2026-08-13 08:13:12.325', 'ecommerce/products/g3fe7wp6wj2al30s2vwc', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786608796/ecommerce/products/g3fe7wp6wj2al30s2vwc.jpg', true);
INSERT INTO public."Product" VALUES (31, 'Face Wash', 'Anti-pollution face wash enriched with black charcoal and icy clay complex for deep cleansing', 4.00, 20, 5, '2026-08-13 08:44:54.785', '2026-08-13 08:44:54.785', 'ecommerce/products/oz1jr7r0gab6uoainpuo', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610698/ecommerce/products/oz1jr7r0gab6uoainpuo.jpg', true);
INSERT INTO public."Product" VALUES (28, 'Body Wash', 'Body wash formulated with an Activ Silver+ formula to eliminate germs and protect against bacteria and viruses', 3.00, 10, 5, '2026-08-13 08:41:57.048', '2026-08-13 08:45:49.613', 'ecommerce/products/vf6udrtmmxpbeegqitgi', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610520/ecommerce/products/vf6udrtmmxpbeegqitgi.jpg', true);
INSERT INTO public."Product" VALUES (32, 'Duffel Bag', 'Spacious black sports duffel bag featuring durable handles', 12.00, 5, 6, '2026-08-13 08:49:32.291', '2026-08-13 08:49:32.291', 'ecommerce/products/mqm9daibydm0wpf16kls', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786610976/ecommerce/products/mqm9daibydm0wpf16kls.jpg', true);
INSERT INTO public."Product" VALUES (33, 'Boxing Punching Bag', 'Durable black heavy-duty training bag designed for striking and martial arts workouts', 12.00, 8, 6, '2026-08-13 08:50:31.391', '2026-08-13 08:50:31.391', 'ecommerce/products/qhix8bpupk1fp32khggr', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786611035/ecommerce/products/qhix8bpupk1fp32khggr.jpg', true);
INSERT INTO public."Product" VALUES (34, 'Hex Rubber Dumbbells', 'Pair of 5kg hexagonal dumbbells with textured metal handles for secure weight training', 8.00, 6, 6, '2026-08-13 08:51:16.947', '2026-08-13 08:51:16.947', 'ecommerce/products/hfvbfy6nlsuv0zbmlgvu', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786611080/ecommerce/products/hfvbfy6nlsuv0zbmlgvu.jpg', true);
INSERT INTO public."Product" VALUES (35, 'Jump Rope', 'Speed skipping rope featuring ergonomic foam-padded handles for a comfortable grip', 4.00, 8, 6, '2026-08-13 08:52:00.567', '2026-08-13 08:52:00.567', 'ecommerce/products/syoszgdpljtvquirdyox', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786611124/ecommerce/products/syoszgdpljtvquirdyox.jpg', true);
INSERT INTO public."Product" VALUES (36, 'Workout Gloves', 'Fingerless training gloves with wrist support wraps and anti-slip padded palms', 4.00, 5, 6, '2026-08-13 08:52:51.261', '2026-08-13 08:52:51.261', 'ecommerce/products/ip7owtywuekaegsk0bku', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786611175/ecommerce/products/ip7owtywuekaegsk0bku.jpg', true);
INSERT INTO public."Product" VALUES (37, 'Refrigerator', 'Modern frost-free top-freezer refrigerator in a sleek dark finish', 50.00, 4, 7, '2026-08-13 09:07:54.857', '2026-08-13 09:07:54.857', 'ecommerce/products/xtfdfawqru95nymgv2mg', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612078/ecommerce/products/xtfdfawqru95nymgv2mg.jpg', true);
INSERT INTO public."Product" VALUES (38, 'Electric Kettle', 'Fast-boiling cordless electric kettle with a sleek brushed metal finish', 12.00, 7, 7, '2026-08-13 09:08:56.425', '2026-08-13 09:08:56.425', 'ecommerce/products/nvbgn0tucoyrflqeozct', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612140/ecommerce/products/nvbgn0tucoyrflqeozct.jpg', true);
INSERT INTO public."Product" VALUES (39, 'Washing Machine', 'Semi-automatic dual-tub washing machine with separate wash and spin compartments', 30.00, 12, 7, '2026-08-13 09:10:27.258', '2026-08-13 09:10:27.258', 'ecommerce/products/t9axv1rcy3fwdweoyzhp', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612231/ecommerce/products/t9axv1rcy3fwdweoyzhp.jpg', true);
INSERT INTO public."Product" VALUES (40, 'Plastic Utility Bucket', 'Sturdy round cleaning bucket equipped with a metal handle', 10.00, 7, 7, '2026-08-13 09:11:05.41', '2026-08-13 09:11:05.41', 'ecommerce/products/jzbpkvjvzsnyzxegsfxb', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612269/ecommerce/products/jzbpkvjvzsnyzxegsfxb.jpg', true);
INSERT INTO public."Product" VALUES (41, 'Broom and Dustpan Set', 'Long-handled blue cleaning set featuring an upright dustpan and an angled broom', 15.00, 10, 7, '2026-08-13 09:11:39.705', '2026-08-13 09:11:39.705', 'ecommerce/products/ods0l4k4gtyl43epfzob', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612303/ecommerce/products/ods0l4k4gtyl43epfzob.jpg', true);
INSERT INTO public."Product" VALUES (42, 'Bucket', 'Sturdy round cleaning bucket equipped with a metal handle', 8.00, 15, 7, '2026-08-13 09:12:22.34', '2026-08-13 09:12:22.34', 'ecommerce/products/vzbklc4vvtx68e8fdcnp', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612346/ecommerce/products/vzbklc4vvtx68e8fdcnp.jpg', true);
INSERT INTO public."Product" VALUES (43, 'Plastic Swing-Top Trash Can', 'Durable grey plastic waste bin with a convenient swinging lid', 8.00, 18, 7, '2026-08-13 09:13:03.708', '2026-08-13 09:13:03.708', 'ecommerce/products/a53au3by0y3woh0a2avp', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786612385/ecommerce/products/a53au3by0y3woh0a2avp.jpg', true);
INSERT INTO public."Product" VALUES (44, 'Silver Chain Necklaces Set', ': Assorted collection of sterling silver chains in various thicknesses and link styles', 12.00, 20, 8, '2026-08-13 09:25:52.39', '2026-08-13 09:25:52.39', 'ecommerce/products/cdjy8jnrs2jvy5jpoubs', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786613156/ecommerce/products/cdjy8jnrs2jvy5jpoubs.jpg', true);
INSERT INTO public."Product" VALUES (45, 'Men''s Signet Rings Tray', 'Assortment of classic silver and gold-tone signet rings featuring geometric and engraved details', 12.00, 8, 8, '2026-08-13 09:26:31.992', '2026-08-13 09:26:31.992', 'ecommerce/products/ga9ckuyvhqrh57te2oki', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786613195/ecommerce/products/ga9ckuyvhqrh57te2oki.jpg', true);
INSERT INTO public."Product" VALUES (46, 'Stainless Steel Lord''s Prayer Cross Necklace', 'Inspirational cross pendant necklace featuring inscribed scripture on matching box chains, available in silver, black, and gold finishes', 12.00, 7, 8, '2026-08-13 09:29:06.491', '2026-08-13 09:29:06.491', 'ecommerce/products/qk42ymbyjlybskjokqya', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786613350/ecommerce/products/qk42ymbyjlybskjokqya.avif', true);
INSERT INTO public."Product" VALUES (47, 'Punk Gothic Vintage Rings Set', 'Assorted set of statement rings featuring edgy designs like playing cards, a skull jester, skeletal hands', 16.00, 16, 8, '2026-08-13 09:29:46.38', '2026-08-13 09:29:46.38', 'ecommerce/products/o6sjt8n16d44ckxeffy0', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786613390/ecommerce/products/o6sjt8n16d44ckxeffy0.webp', true);
INSERT INTO public."Product" VALUES (24, 'Digital Camera', 'A vibrant yellow compact mirrorless camera featuring an interchangeable lens and a retro design', 15.00, 3, 1, '2026-08-13 08:29:29.668', '2026-08-13 10:56:22.859', 'ecommerce/products/aho24rciell64yad3luv', 'https://res.cloudinary.com/kznj0kgt/image/upload/v1786609773/ecommerce/products/aho24rciell64yad3luv.jpg', true);


--
-- Data for Name: CartItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."CartItem" VALUES (1, 1, 6, 1, '2026-08-12 14:22:22.769', '2026-08-12 14:22:22.769');


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Order" VALUES (1, 5, 200.00, 'PROCESSING', '2026-08-12 14:22:49.211', '2026-08-12 15:15:43.578', '123 Main St', 'NYC', '10001', 'Test User', '123456', NULL, 'PENDING', 'COD');
INSERT INTO public."Order" VALUES (2, 1, 25.00, 'PENDING', '2026-08-13 10:56:22.789', '2026-08-13 10:56:22.789', 'Desa palma', 'nilai', '71800', 'Ngun Cung', '+601121432584', NULL, 'PENDING', 'ONLINE');


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."OrderItem" VALUES (1, 1, 6, 1, 200.00);
INSERT INTO public."OrderItem" VALUES (2, 2, 24, 1, 15.00);


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Payment" VALUES (1, 1, 200.00, 'COD', 'PENDING', NULL, '2026-08-12 14:22:49.231', '2026-08-12 14:22:49.231');
INSERT INTO public."Payment" VALUES (2, 2, 25.00, 'ONLINE', 'PENDING', NULL, '2026-08-13 10:56:22.837', '2026-08-13 10:56:22.837');


--
-- Data for Name: RefreshToken; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."RefreshToken" VALUES (19, 'feefd495747c1ea37b06d43cdc158cb48856cb61fac47577d1d0a1034c7cca23', 2, '2026-08-19 14:07:50.377', '2026-08-12 14:07:50.377');
INSERT INTO public."RefreshToken" VALUES (25, '5dda74346456f556fed442c73bfbdba45ee442d86a1118f9cb28fb142bafab6e', 3, '2026-08-19 14:18:49.039', '2026-08-12 14:18:49.039');
INSERT INTO public."RefreshToken" VALUES (27, '3d863faee71d7b08251ed51125367d63c35470b4896feac9f51b850c15ce9d0d', 4, '2026-08-19 14:22:22.662', '2026-08-12 14:22:22.663');
INSERT INTO public."RefreshToken" VALUES (29, 'dde7e4f2d467e1ce682c938935742b853a6b5de1ae2d39eb94615082301153f4', 5, '2026-08-19 14:22:49.024', '2026-08-12 14:22:49.025');
INSERT INTO public."RefreshToken" VALUES (93, 'b88447cdf29705b04aa99a843fdba8451ce9667dc32f669acfc4d5273fe82ef0', 1, '2026-08-20 10:57:16.37', '2026-08-13 10:57:16.371');


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: CartItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."CartItem_id_seq"', 15, true);


--
-- Name: Cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Cart_id_seq"', 3, true);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Category_id_seq"', 8, true);


--
-- Name: OrderItem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."OrderItem_id_seq"', 2, true);


--
-- Name: Order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Order_id_seq"', 2, true);


--
-- Name: Payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payment_id_seq"', 2, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Product_id_seq"', 47, true);


--
-- Name: RefreshToken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."RefreshToken_id_seq"', 93, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."User_id_seq"', 5, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 9k5V9TcC7nI0uuYqkNy3vKjZzSG8uVwCiWYTlIAAcaVtpET7WHhDimPjgsIWwwv

