-- CreateEnum
CREATE TYPE "DataURLType" AS ENUM ('Radar', 'StarChart', 'ForksChart', 'ContributorsChart', 'BusFactorChart', 'SeriousFactorChart', 'GeoChartCommits', 'GeoChartContributors', 'CompanyChartCommits', 'CompanyChartContributors', 'CommunityGuidelinesChart');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "geo_geocode" (
    "id" SERIAL NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "score" BIGINT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "lang_code" TEXT,
    "key" TEXT,

    CONSTRAINT "geo_geocode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_clean_repos" (
    "repo_id" BIGINT NOT NULL,
    "full_name" TEXT,
    "description" TEXT,
    "fork" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "pushed_at" TIMESTAMP(6),
    "homepage" TEXT,
    "size" BIGINT,
    "stargazers_count" INTEGER,
    "watchers_count" BIGINT,
    "forks_count" BIGINT,
    "language" TEXT,
    "has_issues" BOOLEAN,
    "has_projects" BOOLEAN,
    "has_downloads" BOOLEAN,
    "has_wiki" BOOLEAN,
    "has_pages" BOOLEAN,
    "open_issues_count" BIGINT,
    "owner_login" TEXT,
    "owner_id" BIGINT,
    "license_name" TEXT,
    "parsed_at" TIMESTAMP(6),
    "mirror_url" TEXT,
    "default_branch" TEXT,
    "license_key" TEXT,
    "license_spdx_id" TEXT,
    "owner_type" TEXT,
    "owner_site_admin" BOOLEAN,
    "RR_Q1" DOUBLE PRECISION,
    "RR_Q2" DOUBLE PRECISION,
    "RR_Q4" DOUBLE PRECISION,
    "RR_Q8" DOUBLE PRECISION,
    "commits" BIGINT,
    "contributors" BIGINT,
    "age" DOUBLE PRECISION,
    "commits_qual" BIGINT,
    "contributors_qual" BIGINT,
    "features_calculated_at" DATE,
    "AC_4Q" INTEGER,
    "AQC_4Q" INTEGER,
    "NC_4Q" INTEGER,
    "HHI" INTEGER,
    "Avg_DAU" DOUBLE PRECISION,
    "Avg_WAU" DOUBLE PRECISION,
    "Avg_QAU" DOUBLE PRECISION,
    "AC_growth_Q" DOUBLE PRECISION,
    "AQC_growth_Q" DOUBLE PRECISION,
    "TC_growth_Q" DOUBLE PRECISION,
    "topics" TEXT,
    "latest_commit_at" TIMESTAMP(6),
    "agr_window_q" DOUBLE PRECISION,
    "agr_window_m" DOUBLE PRECISION,
    "agr_window_w" DOUBLE PRECISION,

    CONSTRAINT "github_clean_repos_pkey" PRIMARY KEY ("repo_id")
);

-- CreateTable
CREATE TABLE "github_raw_commits" (
    "id" SERIAL NOT NULL,
    "sha" TEXT,
    "commited_at" TIMESTAMP(6),
    "author_name" TEXT,
    "best_email" TEXT,
    "author_id" BIGINT,
    "author_login" TEXT,
    "repo_id" BIGINT,

    CONSTRAINT "github_raw_commits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_raw_repos" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "description" TEXT,
    "fork" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "pushed_at" TIMESTAMP(6),
    "homepage" TEXT,
    "size" INTEGER,
    "stargazers_count" INTEGER,
    "watchers_count" INTEGER,
    "language" TEXT,
    "has_issues" BOOLEAN,
    "has_projects" BOOLEAN,
    "has_downloads" BOOLEAN,
    "has_wiki" BOOLEAN,
    "has_pages" BOOLEAN,
    "forks_count" INTEGER,
    "archived" BOOLEAN,
    "open_issues_count" INTEGER,
    "score" DOUBLE PRECISION,
    "owner_login" TEXT,
    "owner_id" BIGINT,
    "license_name" TEXT,
    "repo_id" BIGINT,
    "parsed_at" TIMESTAMP(6),
    "mirror_url" TEXT,
    "default_branch" TEXT,
    "license_key" TEXT,
    "license_spdx_id" TEXT,
    "owner_type" TEXT,
    "owner_site_admin" BOOLEAN,
    "topics" TEXT,

    CONSTRAINT "github_raw_repos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_raw_users" (
    "id" SERIAL NOT NULL,
    "login" TEXT,
    "avatar_url" TEXT,
    "gravatar_id" TEXT,
    "type" TEXT,
    "site_admin" BOOLEAN,
    "name" TEXT,
    "company" TEXT,
    "blog" TEXT,
    "location" TEXT,
    "email" TEXT,
    "hireable" TEXT,
    "bio" TEXT,
    "twitter_username" TEXT,
    "public_repos" BIGINT,
    "public_gists" BIGINT,
    "followers" BIGINT,
    "following" BIGINT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "user_id" BIGINT,
    "parsed_at" TIMESTAMP(6),

    CONSTRAINT "github_raw_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_repos" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT,
    "description" TEXT,
    "fork" BOOLEAN,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "pushed_at" TIMESTAMP(6),
    "homepage" TEXT,
    "size" BIGINT,
    "stargazers_count" BIGINT,
    "watchers_count" BIGINT,
    "language" TEXT,
    "has_issues" BOOLEAN,
    "has_projects" BOOLEAN,
    "has_downloads" BOOLEAN,
    "has_wiki" BOOLEAN,
    "has_pages" BOOLEAN,
    "forks_count" BIGINT,
    "mirror_url" TEXT,
    "archived" BOOLEAN,
    "open_issues_count" BIGINT,
    "default_branch" TEXT,
    "score" DOUBLE PRECISION,
    "license_name" TEXT,
    "license_key" TEXT,
    "license_spdx_id" TEXT,
    "topics" TEXT,
    "owner_login" TEXT,
    "owner_id" BIGINT,
    "owner_type" TEXT,
    "owner_site_admin" BOOLEAN,
    "repo_id" BIGINT,
    "parsed_at" TIMESTAMP(6),

    CONSTRAINT "github_repos_temporary_table_1235_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_stars_dist" (
    "id" SERIAL NOT NULL,
    "start" BIGINT,
    "end" BIGINT,
    "count" BIGINT,

    CONSTRAINT "github_stars_dist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "github_users" (
    "user_id" BIGINT NOT NULL,
    "login" TEXT,
    "avatar_url" TEXT,
    "gravatar_id" TEXT,
    "type" TEXT,
    "site_admin" BOOLEAN,
    "name" TEXT,
    "company" TEXT,
    "blog" TEXT,
    "location" TEXT,
    "email" TEXT,
    "hireable" TEXT,
    "bio" TEXT,
    "twitter_username" TEXT,
    "public_repos" BIGINT,
    "public_gists" BIGINT,
    "followers" BIGINT,
    "following" BIGINT,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "parsed_at" TIMESTAMP(6),
    "repos_collected" BIGINT,
    "repos_stars_collected" BIGINT,
    "repos_forks_collected" BIGINT,
    "most_freq_website" TEXT,
    "top_repo_id" BIGINT,
    "org_members" INTEGER,
    "languages" TEXT,
    "topics" TEXT,
    "commit_emails" TEXT,
    "is_russian_name_prob" DOUBLE PRECISION,
    "total_stars_perc" SMALLINT,
    "is_armenian_name_prob" DOUBLE PRECISION,

    CONSTRAINT "github_users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "github_repos_serious_contributors" (
    "full_name" TEXT,
    "repo_id" BIGINT NOT NULL,
    "serious_commiters" INTEGER NOT NULL,
    "total_commiters" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "repos_rank" (
    "full_name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "github_repos_contributors_countries" (
    "id" BIGINT NOT NULL,
    "full_name" TEXT NOT NULL,
    "repo_id" BIGINT NOT NULL,
    "country" TEXT,
    "contributors_count" INTEGER NOT NULL,
    "commits_count" INTEGER NOT NULL,
    "contributors_perc" DOUBLE PRECISION NOT NULL,
    "commits_perc" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "github_repos_contributors_companies" (
    "id" BIGINT NOT NULL,
    "full_name" TEXT NOT NULL,
    "repo_id" BIGINT NOT NULL,
    "company_name" TEXT,
    "contributors_count" INTEGER NOT NULL,
    "commits_count" INTEGER NOT NULL,
    "contributors_perc" DOUBLE PRECISION NOT NULL,
    "commits_perc" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "github_repos_fastest_growing_weekly_by_stars" (
    "repo_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "this_week_stars" INTEGER NOT NULL,
    "last_week_stars" INTEGER NOT NULL,
    "this_week_parsed_at" TIMESTAMP(6) NOT NULL,
    "last_week_parsed_at" TIMESTAMP(6) NOT NULL,
    "weekly_star_growth_rate" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "user_parse_request" (
    "request_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_parse_request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "data_url_for_sharing" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "data_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "DataURLType" NOT NULL,

    CONSTRAINT "data_url_for_sharing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_search_feedback" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "query" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,

    CONSTRAINT "ai_search_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscriptions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "email_type" TEXT NOT NULL,

    CONSTRAINT "newsletter_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "unique_repo_id" ON "github_repos"("repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "github_repos_serious_contributors_repo_id_key" ON "github_repos_serious_contributors"("repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "repos_rank_full_name_key" ON "repos_rank"("full_name");

-- CreateIndex
CREATE UNIQUE INDEX "github_repos_contributors_countries_id_key" ON "github_repos_contributors_countries"("id");

-- CreateIndex
CREATE UNIQUE INDEX "github_repos_contributors_companies_id_key" ON "github_repos_contributors_companies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "github_repos_fastest_growing_weekly_by_stars_repo_id_key" ON "github_repos_fastest_growing_weekly_by_stars"("repo_id");

-- CreateIndex
CREATE UNIQUE INDEX "data_url_for_sharing_full_name_type_key" ON "data_url_for_sharing"("full_name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscriptions_email_type_key" ON "newsletter_subscriptions"("email_type");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_parse_request" ADD CONSTRAINT "user_parse_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
