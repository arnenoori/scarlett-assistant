
### Instructions to Run the popualte script
1. Ensure you have the necessary environment variables set in your `.env` file:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`



2. **Create a text file named `populate_initial_sites.txt` in the `scripts` folder** with the list of websites, one per line.


3. **Run the script**:

python scripts/populate_database.py

This Python script will read the list of websites from `populate_initial_sites.txt`, extract metadata, insert the website data into Supabase, and call the `findTos` API to crawl the terms of service.

### Instructions to Run the check_and_update_tos script

What the script does: checks for outdated terms of service (if its older than 3 months), and updates them with a new version if found.

1. setup a cron job on render
   python scripts/check_and_update_tos.py

2. setup cron job to run every Sunday at midnight:
   0 0 * * 0 /usr/bin/python3