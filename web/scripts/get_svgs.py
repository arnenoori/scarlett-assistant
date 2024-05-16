import requests
import csv

# base url for the svgl api
BASE_URL = "https://svgl.app/api"

def get_all_svgs():
    """fetch all svgs from the repository"""
    response = requests.get(f"{BASE_URL}/svgs")
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def download_svg(svg_url):
    """download svg content from the url"""
    response = requests.get(svg_url)
    if response.status_code == 200:
        return response.text
    else:
        response.raise_for_status()

def save_svgs_to_csv(svgs, filename):
    """save svgs data to a csv file"""
    with open(filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # write the header
        writer.writerow(["id", "title", "category", "route", "url", "svg_content"])
        # write the svg data
        for svg in svgs:
            svg_url = svg["route"]
            if isinstance(svg_url, dict):
                # if route is a dictionary, choose the 'light' version if available
                svg_url = svg_url.get("light", list(svg_url.values())[0])
            try:
                svg_content = download_svg(svg_url)
            except requests.exceptions.RequestException as e:
                print(f"Failed to download SVG from {svg_url}: {e}")
                svg_content = ""
            writer.writerow([svg["id"], svg["title"], svg["category"], svg["route"], svg["url"], svg_content])

if __name__ == "__main__":
    try:
        all_svgs = get_all_svgs()
        save_svgs_to_csv(all_svgs, "logo_svg.csv")
        print("SVG data has been saved to logo_svg.csv")
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")