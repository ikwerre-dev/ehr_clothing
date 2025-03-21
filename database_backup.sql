--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

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
-- Name: DiscountType; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."DiscountType" AS ENUM (
    'PERCENTAGE',
    'FIXED'
);


ALTER TYPE public."DiscountType" OWNER TO myuser;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO myuser;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED'
);


ALTER TYPE public."PaymentStatus" OWNER TO myuser;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public."Role" OWNER TO myuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    "userId" text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    "zipCode" text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Address" OWNER TO myuser;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO myuser;

--
-- Name: Coupon; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Coupon" (
    id text NOT NULL,
    code text NOT NULL,
    discount double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "maxUses" integer DEFAULT 100 NOT NULL,
    "minPurchase" double precision DEFAULT 0 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    "usedCount" integer DEFAULT 0 NOT NULL,
    "validFrom" timestamp(3) without time zone NOT NULL,
    "validUntil" timestamp(3) without time zone NOT NULL,
    type text DEFAULT 'percentage'::text NOT NULL
);


ALTER TABLE public."Coupon" OWNER TO myuser;

--
-- Name: CouponUsage; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."CouponUsage" (
    id text NOT NULL,
    "couponId" text NOT NULL,
    "userId" text NOT NULL,
    "orderId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CouponUsage" OWNER TO myuser;

--
-- Name: Order; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "userId" text,
    "addressId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    "customerName" text NOT NULL,
    email text NOT NULL,
    "paymentMethod" text NOT NULL,
    phone text NOT NULL,
    shipping double precision NOT NULL,
    state text NOT NULL,
    subtotal double precision NOT NULL,
    total double precision NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    reference text NOT NULL,
    "couponId" text,
    "totalAmount" double precision DEFAULT 0 NOT NULL,
    "paymentReference" text,
    "paymentStatus" text DEFAULT 'UNPAID'::text NOT NULL
);


ALTER TABLE public."Order" OWNER TO myuser;

--
-- Name: OrderItem; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."OrderItem" (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer NOT NULL,
    color text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    price double precision NOT NULL,
    size text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrderItem" OWNER TO myuser;

--
-- Name: Product; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Product" (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    price double precision NOT NULL,
    images text[],
    "categoryId" text NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO myuser;

--
-- Name: ShippingAddress; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."ShippingAddress" (
    id text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    "orderId" text NOT NULL
);


ALTER TABLE public."ShippingAddress" OWNER TO myuser;

--
-- Name: User; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    phone text,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO myuser;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO myuser;

--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Address" (id, "userId", street, city, state, country, "zipCode", "isDefault", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Category" (id, name, description, "createdAt", "updatedAt") FROM stdin;
cm8hr2v9w00021o05pdy29qf7	Agbada	THis is Agbada Category	2025-03-20 19:34:37.268	2025-03-20 19:34:37.268
cm8hr2i2200011o05kg4vvfrg	Trouser	This is a Trouser Categorys\n	2025-03-20 19:34:20.138	2025-03-21 14:32:43.103
cm8ivqlpr00001ohwjww29f2d	dds	sds	2025-03-21 14:32:49.263	2025-03-21 14:32:49.263
\.


--
-- Data for Name: Coupon; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Coupon" (id, code, discount, "createdAt", "updatedAt", "maxUses", "minPurchase", status, "usedCount", "validFrom", "validUntil", type) FROM stdin;
cm8i2qyh00001ze7uo8xb10nj	WELCOME12	50	2025-03-21 01:01:16.932	2025-03-21 01:18:04.757	50	100	active	1	2025-03-21 00:00:00	2025-03-22 00:00:00	percentage
cm8i2rvrd0002ze7u41pxh6ks	Honour123	23	2025-03-21 01:02:00.074	2025-03-21 01:02:00.074	100	1	active	0	2025-03-21 00:00:00	2025-03-26 00:00:00	fixed
\.


--
-- Data for Name: CouponUsage; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."CouponUsage" (id, "couponId", "userId", "orderId", "createdAt") FROM stdin;
cm8i35sf80004zeduxub4783d	cm8i2qyh00001ze7uo8xb10nj	cm8i35sep0000zeduvou4gh2y	cm8i35sex0001zedutwa45vv5	2025-03-21 01:12:48.932
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Order" (id, "userId", "addressId", "createdAt", address, city, "customerName", email, "paymentMethod", phone, shipping, state, subtotal, total, "updatedAt", status, reference, "couponId", "totalAmount", "paymentReference", "paymentStatus") FROM stdin;
cm8iip2g7000ize3i58andk5s	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:27:42.63	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 09:46:08.82	PROCESSING	EHR-6P54BS	\N	0	\N	PAID
cm8ilnzpj000lze3igo9qowvg	cm8i35sep0000zeduvou4gh2y	\N	2025-03-21 09:50:51.271	uniport	port harcourt	Robinson Honour	pxxlspace@gmail.com	card	09163169949	2500	Rivers	97583	100083	2025-03-21 09:50:51.271	PENDING	EHR-0JJRZK	\N	0	\N	UNPAID
cm8ilohnc000qze3ibwm68wzh	cm8ilog45000pze3i5emvcd81	\N	2025-03-21 09:51:14.521	uniport	port harcourt	Robinson Honour	me@gmail.com	card	123123213	2500	asda	97583	100083	2025-03-21 09:51:14.521	PENDING	EHR-5CZCGE	\N	0	\N	UNPAID
cm8ilqn0r000uze3irchy42k4	cm8i35sep0000zeduvou4gh2y	\N	2025-03-21 09:52:54.795	uniport	port harcourt	Robinson Honour	pxxlspace@gmail.com	card	09108373	2500	rivers	97583	100083	2025-03-21 09:54:37.302	PROCESSING	EHR-NUSPIY	\N	0	\N	PAID
cm8hxeutc0004ze0tkrw6exdv	cm8hx55dr0004zepgh7soihr0	\N	2025-03-20 22:31:54.241	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	rivers	7000	9500	2025-03-20 23:45:45.233	SHIPPED	EHR-VAIDQH	\N	0	\N	UNPAID
cm8hxduvy0000ze0t1547obc3	cm8hx55dr0004zepgh7soihr0	\N	2025-03-20 22:31:07.679	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	Rivers	60000	62500	2025-03-20 23:47:04.944	DELIVERED	EHR-YZJ486	\N	0	\N	UNPAID
cm8i35sex0001zedutwa45vv5	cm8i35sep0000zeduvou4gh2y	\N	2025-03-21 01:12:48.922	uniprot	ph	Pxxl Space	pxxlspace@gmail.com	card	08037582446	2500	ph	25000	15000	2025-03-21 01:12:48.922	PENDING	EHR-QCRQCO	cm8i2qyh00001ze7uo8xb10nj	0	\N	UNPAID
cm8iicon80000ze3i4zay4idd	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:18:04.868	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	RIvers	90583	93083	2025-03-21 08:18:04.868	PENDING	EHR-6MNU47	\N	0	\N	UNPAID
cm8iieank0003ze3ijqqo3lsa	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:19:20.048	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 08:19:20.048	PENDING	EHR-NWM2GO	\N	0	\N	UNPAID
cm8iifqj20006ze3iu6cwuzsj	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:20:27.278	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 08:20:27.278	PENDING	EHR-BFZ0T0	\N	0	\N	UNPAID
cm8iii9dn0009ze3i6r7gf0bu	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:22:25.018	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 08:22:25.018	PENDING	EHR-FF4KYV	\N	0	\N	UNPAID
cm8iijtbl000cze3i0s40r33v	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:23:37.521	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 08:23:37.521	PENDING	EHR-5SNBT1	\N	0	\N	UNPAID
cm8iikxyx000fze3igorsvjog	cm8hx55dr0004zepgh7soihr0	\N	2025-03-21 08:24:30.201	uniport	port harcourt	Robinson Honour	investorhonour@gmail.com	card	09163169949	2500	uniport	90583	93083	2025-03-21 08:24:30.201	PENDING	EHR-8ZWEIF	\N	0	\N	UNPAID
\.


--
-- Data for Name: OrderItem; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."OrderItem" (id, "orderId", "productId", quantity, color, "createdAt", price, size, "updatedAt") FROM stdin;
cm8hxduvy0002ze0t3frqgrbh	cm8hxduvy0000ze0t1547obc3	cm8hs18rf00061o05qkktzwn0	1	Navy	2025-03-20 22:31:07.679	30000	XXL	2025-03-20 22:31:07.679
cm8hxduvy0003ze0twfe6t9cc	cm8hxduvy0000ze0t1547obc3	cm8hs18rf00061o05qkktzwn0	1	Navy	2025-03-20 22:31:07.679	30000	L	2025-03-20 22:31:07.679
cm8hxeutd0006ze0tct24bn0x	cm8hxeutc0004ze0tkrw6exdv	cm8hvuyit000hze3si77xtx74	1	Navy	2025-03-20 22:31:54.241	7000	XXL	2025-03-20 22:31:54.241
cm8i35sex0003zedu5c5unhh5	cm8i35sex0001zedutwa45vv5	cm8hvuyin000dze3sieqmd1io	1	Navy	2025-03-21 01:12:48.922	25000	XL	2025-03-21 01:12:48.922
cm8iicon80002ze3ik6wy0m21	cm8iicon80000ze3i4zay4idd	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:18:04.868	90583	XL	2025-03-21 08:18:04.868
cm8iieann0005ze3i7s1e0dpr	cm8iieank0003ze3ijqqo3lsa	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:19:20.048	90583	XXL	2025-03-21 08:19:20.048
cm8iifqj70008ze3ic63d3hyj	cm8iifqj20006ze3iu6cwuzsj	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:20:27.278	90583	XXL	2025-03-21 08:20:27.278
cm8iii9ds000bze3iaur84bsg	cm8iii9dn0009ze3i6r7gf0bu	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:22:25.018	90583	XXL	2025-03-21 08:22:25.018
cm8iijtbq000eze3iqvn6xfpp	cm8iijtbl000cze3i0s40r33v	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:23:37.521	90583	XXL	2025-03-21 08:23:37.521
cm8iikxz2000hze3i6u78syhn	cm8iikxyx000fze3igorsvjog	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:24:30.201	90583	XXL	2025-03-21 08:24:30.201
cm8iip2ga000kze3ilhjqv9bc	cm8iip2g7000ize3i58andk5s	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 08:27:42.63	90583	XXL	2025-03-21 08:27:42.63
cm8ilnzpm000nze3ixwk9hmtm	cm8ilnzpj000lze3igo9qowvg	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 09:50:51.271	90583	XXL	2025-03-21 09:50:51.271
cm8ilnzpm000oze3iv44hrb55	cm8ilnzpj000lze3igo9qowvg	cm8hvuyit000hze3si77xtx74	1	Navy	2025-03-21 09:50:51.271	7000	XL	2025-03-21 09:50:51.271
cm8ilohne000sze3i60a6uj3i	cm8ilohnc000qze3ibwm68wzh	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 09:51:14.521	90583	XXL	2025-03-21 09:51:14.521
cm8ilohne000tze3ibld6j6i3	cm8ilohnc000qze3ibwm68wzh	cm8hvuyit000hze3si77xtx74	1	Navy	2025-03-21 09:51:14.521	7000	XL	2025-03-21 09:51:14.521
cm8ilqn0u000wze3i3ugvcpwo	cm8ilqn0r000uze3irchy42k4	cm8hvuyir000fze3s80ayy6ok	1	Gray	2025-03-21 09:52:54.795	90583	XXL	2025-03-21 09:52:54.795
cm8ilqn0u000xze3ijljfn3jn	cm8ilqn0r000uze3irchy42k4	cm8hvuyit000hze3si77xtx74	1	Navy	2025-03-21 09:52:54.795	7000	XL	2025-03-21 09:52:54.795
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Product" (id, name, description, price, images, "categoryId", stock, "createdAt", "updatedAt") FROM stdin;
cm8hs18rf00061o05qkktzwn0	White Blend Native Wear	Step out in style with this premium White Nigerian Native Wear, crafted for elegance and comfort. Designed with high-quality fabric, this outfit offers a perfect blend of tradition and modern sophistication. Whether you’re attending a wedding, cultural event, or special occasion, this attire ensures you make a lasting impression.	30000	{http://localhost/upload_site_backend/uploads/67dc73542b1557.44975089.jpg}	cm8hr2v9w00021o05pdy29qf7	100	2025-03-20 20:01:21.032	2025-03-20 20:14:54.075
cm8hvuyfj0001ze3svpo90jtd	Nursing Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	5000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.12	2025-03-20 21:48:26.12
cm8hvuyiu000jze3sahfr92r3	Nursing Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	5000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.311	2025-03-20 21:48:26.311
cm8hvuyie0003ze3st96f2x6e	Tech Nursing Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	6000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.294	2025-03-20 21:50:50.668
cm8hvuyii0005ze3s2pf28mef	Seniro Outfit	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	14000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.298	2025-03-20 21:50:50.668
cm8hvuyij0007ze3s80aswvyv	Casual Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	5553	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.3	2025-03-20 21:50:50.668
cm8hvuyil0009ze3ss5aysbfi	ELementary Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	5000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.301	2025-03-20 21:50:24.314
cm8hvuyim000bze3s6iqko1rx	PArade Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	9000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.302	2025-03-20 21:50:50.668
cm8hvuyin000dze3sieqmd1io	Cutesy Wear	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	25000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.304	2025-03-20 21:50:50.668
cm8hvuyir000fze3s80ayy6ok	Honour Outfit	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	90583	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.308	2025-03-20 21:50:50.668
cm8hvuyit000hze3si77xtx74	Pearl CLothing	THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, THis is a nursing wear, 	7000	{http://localhost/upload_site_backend/uploads/67dc8ccbd8a5e2.69388632.jpg}	cm8hr2i2200011o05kg4vvfrg	25	2025-03-20 21:48:26.31	2025-03-20 21:50:50.668
\.


--
-- Data for Name: ShippingAddress; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."ShippingAddress" (id, street, city, state, country, "orderId") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."User" (id, email, name, phone, password, role, "createdAt", "updatedAt") FROM stdin;
cm8hx55dr0004zepgh7soihr0	investorhonour@gmail.com	Robinson Honour	09163169949		USER	2025-03-20 22:24:21.375	2025-03-20 22:24:21.375
cm8i35sep0000zeduvou4gh2y	pxxlspace@gmail.com	Pxxl Space	08037582446		USER	2025-03-21 01:12:48.914	2025-03-21 01:12:48.914
cm8ilog45000pze3i5emvcd81	me@gmail.com	Robinson Honour	123123213		USER	2025-03-21 09:51:12.533	2025-03-21 09:51:12.533
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
b1ad0e3f-733c-4196-9311-6f48184fd91f	8d0966431cccd9745bba838219c0d898b1e85c6b0169c5fa584b308face5adf2	2025-03-20 20:25:02.202001+01	20250320185950_init	\N	\N	2025-03-20 20:25:02.193275+01	1
ca1a5986-e65a-4cdc-9f22-3e4579079f46	d893346e944faa738e88c1ca52f62c861b1fcb571129a98e2a26266406137413	2025-03-20 21:53:47.727032+01	20250320205347_add_total_amount_to_order	\N	\N	2025-03-20 21:53:47.682733+01	1
24720224-8c7e-40ef-bc83-3aa3a9d25ed3	5e919027b284b3b41fabb53236fa3753dff8e7d30b078caf9036226e97e691ac	2025-03-20 23:14:24.157031+01	20250320221424_fix_order_relations	\N	\N	2025-03-20 23:14:24.148975+01	1
345439af-a26d-4072-82f8-4c115a805cf5	18efacb66b45f46f5e35fabdab172b3c7ff2db150842f369292e1176dc42fb4d	2025-03-20 23:28:50.327691+01	20250320222850_remove_duplicate_address	\N	\N	2025-03-20 23:28:50.271965+01	1
94f616b9-523e-43a2-9080-5dfe4f5e0e95	9e23da6e076988caed45a5e0a22c104710aa1b69d75b93c652414b8a7f7e4cfd	2025-03-20 23:30:01.049236+01	20250320223001_fix_order_reference_field	\N	\N	2025-03-20 23:30:01.046331+01	1
d39ee136-50ab-4718-a9d4-5b28fcd3c8ae	592a45df0d0f474c803f8e3c2aab17f74f5f107c36919d3c5a2476a9833215d8	2025-03-21 01:59:10.276855+01	20250321005910_add_coupons	\N	\N	2025-03-21 01:59:10.263936+01	1
9558cc92-3889-407d-a029-93b7dea9d093	25614c36b0a5ca2bec54f7c141cf2f83354f3ec89ebe6634217a2ede7ed63ed6	2025-03-21 02:11:01.399737+01	20250321011101_add_total_amount_field	\N	\N	2025-03-21 02:11:01.397674+01	1
ed5921c8-83ca-4a5d-9512-c73e45ad728e	496a9eb3c31044d2db570630105fd9497d1bd80965d7ad3c58133690e7a5461d	2025-03-21 08:58:39.39105+01	20250321075839_update	\N	\N	2025-03-21 08:58:39.387191+01	1
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: CouponUsage CouponUsage_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."CouponUsage"
    ADD CONSTRAINT "CouponUsage_pkey" PRIMARY KEY (id);


--
-- Name: Coupon Coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Coupon"
    ADD CONSTRAINT "Coupon_pkey" PRIMARY KEY (id);


--
-- Name: OrderItem OrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: ShippingAddress ShippingAddress_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ShippingAddress"
    ADD CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Address_userId_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX "Address_userId_idx" ON public."Address" USING btree ("userId");


--
-- Name: CouponUsage_couponId_userId_orderId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "CouponUsage_couponId_userId_orderId_key" ON public."CouponUsage" USING btree ("couponId", "userId", "orderId");


--
-- Name: Coupon_code_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "Coupon_code_key" ON public."Coupon" USING btree (code);


--
-- Name: Order_addressId_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX "Order_addressId_idx" ON public."Order" USING btree ("addressId");


--
-- Name: Order_paymentReference_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "Order_paymentReference_key" ON public."Order" USING btree ("paymentReference");


--
-- Name: Order_reference_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "Order_reference_key" ON public."Order" USING btree (reference);


--
-- Name: Order_userId_idx; Type: INDEX; Schema: public; Owner: myuser
--

CREATE INDEX "Order_userId_idx" ON public."Order" USING btree ("userId");


--
-- Name: ShippingAddress_orderId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "ShippingAddress_orderId_key" ON public."ShippingAddress" USING btree ("orderId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Address Address_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CouponUsage CouponUsage_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."CouponUsage"
    ADD CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CouponUsage CouponUsage_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."CouponUsage"
    ADD CONSTRAINT "CouponUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CouponUsage CouponUsage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."CouponUsage"
    ADD CONSTRAINT "CouponUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: OrderItem OrderItem_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."OrderItem"
    ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Order Order_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_couponId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES public."Coupon"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ShippingAddress ShippingAddress_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ShippingAddress"
    ADD CONSTRAINT "ShippingAddress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

