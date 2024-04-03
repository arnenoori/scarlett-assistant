import Head from "next/head";
import Header from "../components/Headers/NewHeader";
import SearchBar from "../components/SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { RadarSkeleton } from "../components/Overview/RadarChart";
import { prisma } from "../server/db/client";
import { InferGetStaticPropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer, EmailForm } from "../components/Footer/Footer";
import { Prisma } from "@prisma/client";

type Topic = {
  topic: string;
  topic_count: number;
};

export async function getStaticProps() {

  const topics = await prisma.$queryRaw<Topic[]>(
    Prisma.sql`select
                    topic,
                    topic_count::integer
                from
                (
                    select
                    unnest(string_to_array(topics, '|')) as topic,
                    count(*) as topic_count
                    from
                    github_clean_repos
                    group by
                    1
                ) q
                where topic is not null
                order by
                    2 desc
                limit 20
                `
  );
  
  return {
    props: {
      // data: data,
      // this_week: this_week?.toLocaleString("en-US", {
      //   month: "short",
      //   day: "numeric",
      // }),
      // last_week: last_week?.toLocaleString("en-US", {
      //   month: "short",
      //   day: "numeric",
      // }),

      topics: topics,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
}

const Home = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url.includes("/analyze")) {
        setIsLoading(true);
      }
    };

    const handleRouteComplete = (url: string) => {
      setIsLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="w-96 h-96 animate-bounce mx-auto">
          <RadarSkeleton />
        </div>
        <p className="text-center text-xl text-primary">
          Analyzing your repo<span className="">...</span>
        </p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Analyze Any GitHub Repository for Free | tosbuddy.com
        </title>
        <meta
          name="description"
          content="AnalyzeMyRepo is a free tool to analyze any GitHub repository. Get detailed insights into adoption, contributions, diversity and community governance. Check it out now to start analyzing your repositories!"
        />
        <meta
          name="google-site-verification"
          content="_NWIPHmW4OdNxK7VfZPl8RiuZj5zCmvtAtSLHiuensc"
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-neutral">
        <Header />
        <main className="container mx-auto flex flex-col items-center p-12 pt-14 flex-grow max-w-screen-xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 lg:font-extrabold lg:text-6xl lg:leading-none dark:text-white lg:text-center xl:px-36 lg:mb-7">
            Analyze Any GitHub Repository for Free with AnalyzeMyRepo
          </h1>
          <h2 className="mb-10 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl xl:px-60">
            Get In-Depth Insights into adoption, contributions, diversity,
            community governance and more.
          </h2>
          <div className="flex w-full">
            <div className="mx-auto flex flex-col w-4/5 md:w-1/2 mb-14 md:mb-2">
              <SearchBar />
              <h3 className="text-center pt-2 text-gray-500">
                Search for a GitHub repo
              </h3>
            </div>
          </div>
          {/* <h3 className="mb-6 text-3xl font-extrabold tracking-tight leading-tight text-gray-900 lg:text-center dark:text-white md:text-4xl">
            Explore fastest growing repos
          </h3>
          <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl lg:px-64 lg:mb-10 md:whitespace-nowrap">
            Top 10 fastest growing repos on GitHub with 1,000+ stars from{" "}
            {props.last_week} to {props.this_week}
          </p> */}
          {/* <FastestGrowingRepos props={props} /> */}
          {/* <Link
            href="/collections/fastest-growing-weekly"
            className="mt-6 underline underline-offset-2 decoration-primary"
          >
            See more
          </Link> */}
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight leading-tight text-gray-900 lg:text-center dark:text-white md:text-4xl mt-14">
            Explore popular topics
          </h3>
          <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400 lg:text-center lg:text-xl lg:px-64 lg:mb-10 md:whitespace-nowrap">
            The 20 most popular topics on GitHub
          </p>
          <PopularTopics props={props} />
          <Link
            href="/topics"
            className="mt-6 underline underline-offset-2 decoration-primary"
          >
            See more
          </Link>
        </main>
        <EmailForm />
        <Footer />
      </div>
    </>
  );
};

export default Home;

const Announcement = () => {
  return (
    <Link
      href="/ai-search"
      className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-5 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200"
      role="alert"
    >
      <span className="text-xs bg-primary rounded-full text-white px-4 py-1.5 mr-3">
        New{" "}
      </span>
      <span className="mr-2 text-sm font-medium">
        Introducing AI search for GitHub repos, try it out!
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="w-5 h-5"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </Link>
  );
};

const PopularTopics = ({
  props,
}: {
  props: InferGetStaticPropsType<typeof getStaticProps>;
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 pt-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl">
      {props.topics.map((topic, index) => (
        <div
          className="flex flex-col bg-primary/10 rounded-lg shadow-md p-4 mb-4 text-primary/90 dark:bg-gray-700 dark:text-gray-400 hover:shadow-lg"
          key={topic.topic}
        >
          <Link href={`/topics/${topic.topic}`} className="hover:underline">
            {topic.topic}
          </Link>
        </div>
      ))}
    </div>
  );
};