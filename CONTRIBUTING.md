# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## About the Schema:

The websites table stores information about each website, including:

id: A unique identifier for the website.
url: The original URL of the website.
site_name: The extracted site name.
normalized_url: The normalized URL of the website (e.g., "https://example.com").
tos_url: The URL of the terms of service page.
favicon_url: The URL of the favicon stored in the Supabase storage bucket.
simplified_overview: The simplified overview of the terms of service stored as a JSONB column.
last_crawled: The timestamp of the last crawl.
created_at: The timestamp of when the website record was created.
updated_at: The timestamp of when the website record was last updated.


The terms_of_service table stores the actual terms of service data for each website, including:

id: A unique identifier for the terms of service record.
website_id: A foreign key referencing the id column in the websites table.
content: The raw content of the terms of service.
simplified_content: The simplified content of the terms of service stored as a JSONB column.
tos_url: The URL of the terms of service page.
file_path: The file path of the terms of service stored in the Supabase storage bucket.
created_at: The timestamp of when the terms of service record was created.
updated_at: The timestamp of when the terms of service record was last updated.

