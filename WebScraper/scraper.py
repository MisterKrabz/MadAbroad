import time
import json
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# --- CONFIGURATION ---
SEARCH_URL = "https://studyabroad.wisc.edu/programsearch/"
API_ENDPOINT = "http://localhost:8080/api/programs"

def setup_driver():
    """Sets up the Selenium Chrome driver."""
    print("Setting up Chrome driver...")
    service = ChromeService(ChromeDriverManager().install())
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36')
    driver = webdriver.Chrome(service=service, options=options)
    print("Driver setup complete.")
    return driver

# THIS IS THE MISSING FUNCTION THAT MUST BE INCLUDED
def parse_title_string(title_text):
    """
    Parses a title string to extract country and city, returning the full title
    as the primary program/university name.
    """
    country, city = "Not Specified", "Not Specified"
    program_university_name = title_text # Default to the full string

    if ":" in title_text:
        location_part, name_part = title_text.split(":", 1)
        program_university_name = name_part.strip()
        if "," in location_part:
            country_part, city_part = location_part.split(",", 1)
            country = country_part.strip()
            city = city_part.strip()
        else:
            country = location_part.strip()
    elif "," in title_text:
        parts = title_text.split(",", 1)
        country = parts[0].strip()
        program_university_name = parts[1].strip()
    
    return {"country": country, "city": city, "programUniversityName": program_university_name}


def scrape_and_process_all_pages(driver):
    """Navigates, scrapes, and parses page-by-page."""
    final_structured_data = []
    driver.get(SEARCH_URL)
    page_number = 1

    while True:
        print(f"Processing page {page_number}...")
        try:
            WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#programs-table > tbody > tr")))
            rows_on_this_page = driver.find_elements(By.CSS_SELECTOR, "#programs-table > tbody > tr")
            print(f"  -> Found {len(rows_on_this_page)} rows. Parsing immediately...")

            i = 0
            terms = ""
            language = ""
            areas_of_focus = ""
            link = ""
            
            while i < len(rows_on_this_page):
                row = rows_on_this_page[i]
                try:
                    title_link = row.find_element(By.CSS_SELECTOR, "td.program-title-link a")
                    if (i + 1) < len(rows_on_this_page):
                        details_row = rows_on_this_page[i+2]
                        cells = details_row.find_elements(By.TAG_NAME, 'td')
                        
                        title_text = " ".join(title_link.text.split())
                        # This call will now succeed because the function exists
                        parsed_title = parse_title_string(title_text)

                        terms = ' '.join(cells[0].text.split()) if len(cells) > 0 else "Not Specified"
                        language = ' '.join(cells[1].text.split()) if len(cells) > 1 else "Not Specified"
                        areas_of_focus = ' '.join(cells[3].text.split()) if len(cells) > 3 else "Not Specified"
                        link = title_link.get_attribute("href") if title_link else "Not Specified"

                        if (i + 2) < len(rows_on_this_page) and "program-focuses" in rows_on_this_page[i+2].get_attribute("class"):
                            i += 3
                        else:
                            i += 2
                    else:
                        i += 1
                except NoSuchElementException:
                    i += 1
                    continue
                
                program_dict = {
                    "programUniversityName": parsed_title["programUniversityName"],
                    "country": parsed_title["country"],
                    "city": parsed_title["city"],
                    "terms": terms,
                    "language": language,
                    "areasOfFocus": areas_of_focus,
                    "link": link
                }
                
                final_structured_data.append(program_dict)
        except TimeoutException:
            print("Timed out waiting for table on page.")
            break

        try:
            next_li = driver.find_element(By.CSS_SELECTOR, 'li.pagination-next:not(.disabled)')
            driver.execute_script("arguments[0].click();", next_li.find_element(By.TAG_NAME, 'a'))
            page_number += 1
            time.sleep(2)
        except NoSuchElementException:
            print("No 'Next' button found. Scraping complete.")
            break
            
    return final_structured_data

def send_program_to_api(program_payload):
    """Sends a single, formatted program object to the backend API."""
    headers = {"Content-Type": "application/json"}
    
    try:
        response = requests.post(API_ENDPOINT, data=json.dumps(program_payload), headers=headers)
        
        if 200 <= response.status_code < 300:
            print(f"SUCCESS: API accepted program '{program_payload.get('programUniversityName', 'N/A')}'.")
        else:
            print(f"FAILURE: API rejected program '{program_payload.get('programUniversityName', 'N/A')}'. Status: {response.status_code}, Body: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"CRITICAL FAILURE: Could not connect to API. Error: {e}")

# --- MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    print("""
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

            WARNING: This script will populate the database with unchecked data directly from 
            UW-Madison's Study Abroad website, regardless of whether the database is empty or not. 
            This means: 
            
                1. it might duplicate already existing data. 
                
                2. it might fill the database with broken or incomplete data if UW Madison website's 
                    HTML or CSS structure has changed since this script was last updated. 

            You have been advised.

            Proceed with caution. ⚠️ 
        """)
    input("""
            Press enter to continue. Press Ctrl + C to exit.
          
        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!""")
    
    driver = setup_driver()
    try:
        scraped_data = scrape_and_process_all_pages(driver)
        print(f"\nSuccessfully parsed {len(scraped_data)} total program objects.")
        
        print("\n--- Starting API Population ---")
        if scraped_data:
            for program in scraped_data:
                send_program_to_api(program)
                time.sleep(0.1)
        else:
            print("No data was parsed, nothing to send to API.")
            
    finally:
        print("\nProcess complete. Closing browser.")
        driver.quit()