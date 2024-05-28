# go through the database and check if any websites have repeated site names. merge the two entries if they do
# check that a website is linked to a terms_of_service. if it has terms of service column missing then go crawl it
# merge together sites that have the same root domain but might have different extensin
# run websites that have NULL value for last_crawled 
# terms of service that have blank "{}" value for simplified_content - run summary endpoint again. if that doesnt work then recrawl for it