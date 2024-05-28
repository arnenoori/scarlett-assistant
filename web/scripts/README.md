
# Scripts:

What the scripts do:

**check_and_update_tos.py**: Checks for outdated terms of service (if its older than 3 months), and updates them with a new version if found.

**update_tos_prompt.py**: Update all existing terms of service entries in your database when we update with a new prompt.

**populate_database.py**: Populate the database with initial sites.
- populate_initial_sites.txt: change this with the sites you want to add to the database.

**get_svgs.py**: Ping https://svgl.app/api to get the svgs for the sites in the database and also saves the svg for the logos in logo_svgs.csv

### Setup for the scripts:

#### Step 1: Set Up a Python Environment

(assuming you have python installed)

1. **Create a Virtual Environment**:
   ```bash
   python -m venv venv
   ```

2. **Activate the Virtual Environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

#### Step 2: Install Dependencies

1. **Create a `requirements.txt` File**:
   ```text
   requests
   python-dotenv
   supabase
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

#### Step 3: Set Up Environment Variables

(you can just change the given .env.local.example file to .env.local)

1. **Create a `.env` File** in the root of your project directory:
   ```text
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase URL and anonymous key.


### Populate initial database with the script

The purpose of the script is to update the `populate_initial_sites.txt` in the `scripts` folder with the list of websites, one per line.

1. **Run the script**:

python scripts/populate_database.py

This Python script will read the list of websites from `populate_initial_sites.txt`, extract metadata, insert the website data into Supabase, and call the `findTos` API to crawl the terms of service.


### Instructions to Run the check_and_update_tos script

The script checks for outdated terms of service (if its older than 3 months), and updates them with a new version if found.

1. setup a cron job on render (super easy to setup for cron jobs)
   python scripts/check_and_update_tos.py

2. setup cron job to run every Sunday at midnight:
   0 0 * * 0 /usr/bin/python3


### Instructions to run update_tos_prompt.py

The script updates all existing terms of service entries in your database when we update with a new prompt.

python scripts/update_tos_prompt.py

1. **Check the Database**: After running the script, verify that the `simplified_content` and `version` fields in the `terms_of_service` table have been updated correctly.

2. **Review Logs**: Check the console output for any errors or confirmation messages indicating that the terms of service entries have been updated.