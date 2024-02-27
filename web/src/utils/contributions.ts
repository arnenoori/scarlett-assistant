import { inferQueryOutput } from "./trpc";
import { count_true } from "./common";

export const checks_texts: Record<string, any> = {
  last_commit_at: {
    good: "The last commit was made less than 3 months ago",
    bad: "The last commit was made more than 3 months ago",
  },
  bus_factor: {
    good: "More than 10 contributors constitute 50% of commits to the repo",
    bad: "Less than 10 contributors constitute 50% of commits to the repo",
  },
  serious_factor: {
    good: "More than 50% of contributors authored more than 1 commit",
    bad: "Less than 50% of contributors authored more than 1 commit (others authored only 1)",
  },
  contributors_count: {
    good: "There are more than 20 contributors to the repo",
    bad: "There are less than 20 contibutors to the repo",
  },
  default: "Not enough data to run this check",
};

const calculate_factor = ({
  data,
  format = true,
}: {
  data: inferQueryOutput<"postgres.get_serious_contributors">;
  format?: boolean;
}) => {
  const perc =
    ((data?.serious_commiters ?? 0) / (data?.total_commiters ?? 1)) * 100;

  if (format) {
    return perc.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      minimumSignificantDigits: 2,
    });
  }

  return perc;
};

const calculate_factor_hack = (
  data: inferQueryOutput<"github.get_github_repo_contributors">,
  format = true
) => {
  const serious_commiters = data.filter(
    (value: any) => value["contributions"] > 1
  ).length;
  const total_commiters = data.length;
  // this method neeeded if the don't have commits of this repo in the database
  // it's approximate becuase it can count only top 100 contributors - but it should be ok for most cases

  const perc = ((serious_commiters ?? 0) / (total_commiters ?? 1)) * 100;

  if (format) {
    return perc.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      minimumSignificantDigits: 2,
    });
  }

  return perc;
};

export const handle_data_and_calculate_factor = ({
  data_db,
  data_gh,
  format = true,
}: {
  data_db: inferQueryOutput<"postgres.get_serious_contributors"> | undefined;
  data_gh: inferQueryOutput<"github.get_github_repo_contributors">;
  format: boolean;
}) => {
  if (data_db?.serious_commiters || data_db?.total_commiters) {
    return calculate_factor({ data: data_db, format: format });
  } else {
    return calculate_factor_hack(data_gh, format);
  }
};

export const check_bus_factor = (
  data: Record<string, any>[],
  total_contributions: number
) => {
  const bus_factor = calculate_bus_factor(data, total_contributions);
  return bus_factor.bus_factor > 3;
};

export const check_contributors_count = (
  data: inferQueryOutput<"postgres.get_serious_contributors"> | undefined,
  data_gh: inferQueryOutput<"github.get_github_repo_contributors">
) => {
  if (data?.total_commiters) {
    return data.total_commiters > 20;
  } else {
    return data_gh.length > 20;
  }
};

export const check_serious_contributors = ({
  data_db,
  data_gh,
  format = true,
}: {
  data_db: inferQueryOutput<"postgres.get_serious_contributors"> | undefined;
  data_gh: inferQueryOutput<"github.get_github_repo_contributors">;
  format: boolean;
}) => {
  const serious_perc = handle_data_and_calculate_factor({
    data_db,
    data_gh,
    format: format,
  });

  return serious_perc > 0.5;
};

interface BusFactor {
  bus_factor: number | string;
  share: number;
}

export const calculate_bus_factor = (
  data: inferQueryOutput<"github.get_github_repo_contributors">,
  total_contributions: number
): BusFactor => {
  // calculate number of contributors who consist more than 50% of commits
  if (data.length == 1) {
    return {
      bus_factor: 1,
      share: 100,
    };
  }
  const half = total_contributions / 2;
  let sum = 0;
  let i;
  for (i = 0; i < data.length; i++) {
    sum += (data[i] as any)["contributions"];
    if (sum >= half) {
      return {
        bus_factor: i + 1,
        share: Math.round((sum / total_contributions) * 100),
      };
    }
  }

  // at this point we understand that 100 people (or all people in the repo, which is strange) represent less 50% of commits

  return {
    bus_factor: 100,
    share: Math.round((sum / total_contributions) * 100),
  };
};

export const calculate_last_commit_at_diff = (
  data: inferQueryOutput<"github.get_github_commits">,
  format = true
) => {
  const last_commit_at = data["last_commit_at"];
  const last_commit_at_date = new Date(last_commit_at);
  const now = new Date();
  const diff = Math.abs(now.getTime() - last_commit_at_date.getTime());
  const diff_days = Math.ceil(diff / (1000 * 3600 * 24));

  if (format) {
    return diff_days.toLocaleString("en-US", {
      maximumFractionDigits: 1,
      maximumSignificantDigits: 2,
      minimumFractionDigits: 0,
      minimumSignificantDigits: 2,
    });
  }

  return diff_days;
};

export const check_last_commit_at = (
  data: inferQueryOutput<"github.get_github_commits">
) => {
  const diff_days = calculate_last_commit_at_diff(data, false);
  return diff_days < 90;
};

export const calculate_contribution_verdict = ({
  contributors_data,
  serious_data,
  contributions_count_data,
  commits_data,
}: {
  contributors_data: inferQueryOutput<"github.get_github_repo_contributors">;
  serious_data:
    | inferQueryOutput<"postgres.get_serious_contributors">
    | undefined;
  contributions_count_data:
    | inferQueryOutput<"github.get_contributions_count">
    | undefined;
  commits_data: inferQueryOutput<"github.get_github_commits"> | undefined;
}) => {
  const total_contributions =
    contributions_count_data?.total_contributions ?? 1;
  const bus_factor = check_bus_factor(contributors_data, total_contributions);
  const serious_factor = check_serious_contributors({
    data_db: serious_data,
    data_gh: contributors_data,
    format: false,
  });

  const contributors_count = check_contributors_count(
    serious_data,
    contributors_data
  );

  const last_commit_at = check_last_commit_at(
    commits_data as inferQueryOutput<"github.get_github_commits">
  );

  const score = count_true([
    bus_factor,
    serious_factor,
    contributors_count,
    last_commit_at,
  ]);

  return {
    verdict: score > 2,
    score: score,
    results: { bus_factor, serious_factor, contributors_count, last_commit_at },
  };
};
