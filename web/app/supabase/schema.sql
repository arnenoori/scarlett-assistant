
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

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE TYPE "public"."website_type" AS ENUM (
    'technology',
    'popular'
);

ALTER TYPE "public"."website_type" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."terms_of_service" (
    "id" integer NOT NULL,
    "website_id" integer,
    "simplified_content" "jsonb",
    "tos_url" "text",
    "file_path" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);

ALTER TABLE "public"."terms_of_service" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."terms_of_service_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."terms_of_service_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."terms_of_service_id_seq" OWNED BY "public"."terms_of_service"."id";

CREATE TABLE IF NOT EXISTS "public"."websites" (
    "id" integer NOT NULL,
    "url" "text" NOT NULL,
    "site_name" "text" NOT NULL,
    "last_crawled" timestamp without time zone,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "category" "text",
    "view_counter" integer DEFAULT 0,
    "website_description" "text"
);

ALTER TABLE "public"."websites" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."websites_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."websites_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."websites_id_seq" OWNED BY "public"."websites"."id";

ALTER TABLE ONLY "public"."terms_of_service" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."terms_of_service_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."websites" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."websites_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."terms_of_service"
    ADD CONSTRAINT "terms_of_service_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."websites"
    ADD CONSTRAINT "websites_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."terms_of_service"
    ADD CONSTRAINT "terms_of_service_website_id_fkey" FOREIGN KEY ("website_id") REFERENCES "public"."websites"("id");

ALTER TABLE "public"."terms_of_service" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."websites" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."terms_of_service" TO "anon";
GRANT ALL ON TABLE "public"."terms_of_service" TO "authenticated";
GRANT ALL ON TABLE "public"."terms_of_service" TO "service_role";

GRANT ALL ON SEQUENCE "public"."terms_of_service_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."terms_of_service_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."terms_of_service_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."websites" TO "anon";
GRANT ALL ON TABLE "public"."websites" TO "authenticated";
GRANT ALL ON TABLE "public"."websites" TO "service_role";

GRANT ALL ON SEQUENCE "public"."websites_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."websites_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."websites_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
