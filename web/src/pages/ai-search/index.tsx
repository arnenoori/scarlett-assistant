import { trpc } from "../../utils/trpc";
import type { EmbeddingSearchResult } from "../../server/router/embeddings";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GrStar } from "react-icons/gr";
import { HiOutlineThumbUp, HiOutlineThumbDown } from "react-icons/hi";
import Header from "../../components/Headers/NewHeaderSecondary";
import { Footer, EmailForm } from "../../components/Footer/Footer";
import Head from "next/head";

const EXAMPLE_QUERIES = [
  "game engines written in rust",
  "python fullstack apps framework",
  "best tools for removing background from images",
  "js web frameworks",
  "low code platforms for internal tools",
  "auth for next.js",
  "tools to build Figma-like multiplayer apps",
  "community building platform",
];

const RepoCard = ({ repo }: { repo: EmbeddingSearchResult }) => {
  const owner = repo.full_name.split("/")[0];
  const avatar = `https://github.com/${owner}.png`;
  return (
    <Link href={`/analyze/${repo.full_name}`}>
      <div className="flex flex-col gap-2 items-center w-64 md:w-80 h-48 p-4 bg-white shadow-lg rounded-sm">
        <div className="flex flex-row gap-2 items-center">
          <Image
            src={avatar}
            alt="repo"
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
          />
          <p className="text-xl text-ellipsis line-clamp-1">{repo.full_name}</p>
        </div>
        <p className="text-gray-500 text-ellipsis line-clamp-3 flex-1">
          {repo.description}
        </p>
        <div className="flex flex-row items-center">
          <GrStar size={20} />
          <p className="text-gray-500">{repo.stargazers_count}</p>
        </div>
      </div>
    </Link>
  );
};

const SearchPage = () => {
  const search = trpc.useMutation("embeddings.search");
  const [query, setQuery] = useState<string>("");
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [showVote, setShowVote] = useState<boolean>(true);

  const host = process.env.NEXT_PUBLIC_VERCEL_URL
    ? "https://" + process.env.NEXT_PUBLIC_GLOBAL_URL
    : "http://localhost:3000";

  const save_vote = trpc.useMutation("embeddings.vote");

  const processVote = async () => {
    // vote changed, we can save the result
    if (vote == null) return;
    setShowVote(false);
    await save_vote.mutateAsync({ query, vote });
    setVote(null);
  };

  useEffect(() => {
    processVote();
  }, [vote]);

  useEffect(() => {
    if (search.isError) {
      setShowVote(false);
    } else {
      setShowVote(true);
    }
  }, [search.status]);

  return (
    <>
      <Head>
        <title>AI Search for GitHub repos | analyzemyrepo.com</title>
        <meta name="description" content="Search GitHub repos using AI" />
        <meta name="og:url" content={`${host}/al-search`} />
        <meta name="og:type" content="website" />
        <meta
          name="og:title"
          content={`AI Search for GitHub repos | analyzemyrepo.com`}
        />
        <meta name="og:description" content={`Search GitHub repos using AI`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@CrowdDotDev" />
        <meta
          name="twitter:title"
          content={`Search GitHub repos using AI | analyzemyrepo.com`}
        />
        <meta
          name="twitter:description"
          content={`Search GitHub repos using AI`}
        />
      </Head>
      <Header />
      <div className="flex flex-col items-center">
        <div className="flex flex-col justify-center align-middle min-h-screen">
          <div className="flex-1 flex flex-col px-2">
            <h1 className="block relative text-center font-extrabold text-4xl lg:text-6xl pb-4 mt-10 lg:mt-28">
              Search GitHub repos using AI
              <span className="hidden bg-primary/75 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full px-2 absolute lg:inline-block left-auto -top-0.5">
                beta
              </span>
            </h1>
            <span className="bg-primary/75 text-xs font-medium text-white text-center p-0.5 leading-none rounded-full px-2 max-w-fit self-center mb-2 lg:hidden">
              beta
            </span>
            <h2 className="text-center font-semibold text-lg lg:text-xl pb-4 max-w-lg self-center">
              Leverage the power of GPT-3 to find the best GitHub repos for your
              next project
            </h2>
            <h3 className="text-center text-lg pb-4">Query examples</h3>
            <div className="text-gray-700 max-w-xs lg:max-w-[800px] flex flex-wrap justify-center gap-2 self-center pb-4">
              {EXAMPLE_QUERIES.map((query) => (
                <span
                  className="px-2 bg-primary/10 rounded-lg max-w-xs lg:max-w-[400px] break-words cursor-pointer text-center"
                  key={query}
                  onClick={() => setQuery(query)}
                >
                  {query}
                </span>
              ))}
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="AI powered search for GitHub repos"
                className="w-36 sm:w-52 md:w-96 focus:ring-primary focus:border-primary block shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <div className="flex flex-row gap-2">
                <button
                  disabled={search.isLoading}
                  onClick={async () => await search.mutateAsync({ query })}
                  className="bg-primary text-white w-20 h-9 rounded-md hover:bg-primary/75"
                >
                  Search
                </button>
                <button
                  disabled={search.isLoading}
                  onClick={() => {
                    search.reset();
                    setQuery("");
                  }}
                  className="h-9 w-fit text-black hover:text-black/75"
                >
                  x
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center mt-2">
              {search.isLoading && "Loading..."}
              {search.isError &&
                "Something went wrong. Maybe the query is too short."}
            </div>
          </div>
          <div className="flex py-4 justify-center">
            {search.isSuccess && (
              <div className="flex flex-col">
                <div
                  className={`${
                    showVote ? "" : "hidden "
                  } flex self-center gap-1 items-center transition ease-in-out delay-150 duration-500`}
                >
                  <p>Do you like the result?</p>
                  <HiOutlineThumbUp
                    size={20}
                    className={`${
                      vote == "up" ? "bg-primary " : ""
                    } cursor-pointer`}
                    onClick={() => {
                      setVote("up");
                    }}
                  />
                  <HiOutlineThumbDown
                    size={20}
                    className={`${
                      vote == "down" ? "bg-primary " : ""
                    } cursor-pointer`}
                    onClick={() => {
                      setVote("down");
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-4">
                  {search.data.map((repo) => (
                    <div key={repo.full_name}>
                      <RepoCard repo={repo} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <EmailForm />
      <Footer />
    </>
  );
};

export default SearchPage;
