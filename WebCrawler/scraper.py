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

def scrape_and_process_all_pages(driver):
    final_structured_data = []
    driver.get(SEARCH_URL)
    page_number = 1

    while True:
        print(f"Processing page {page_number}...")
        try:
            WebDriverWait(driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "#programs-table > tbody > tr"))
            )
            rows_on_this_page = driver.find_elements(By.CSS_SELECTOR, "#programs-table > tbody > tr")
            print(f"  -> Found {len(rows_on_this_page)} rows. Parsing immediately...")

            i = 0
            while i < len(rows_on_this_page):
                row = rows_on_this_page[i]
                try:
                    title_link = row.find_element(By.CSS_SELECTOR, "td.program-title-link a")
                    
                    if (i + 1) < len(rows_on_this_page):
                        details_row = rows_on_this_page[i+1]
                        cells = details_row.find_elements(By.TAG_NAME, 'td')
                        
                        country = ''.join(title_link.text.split(", ")[0])
                        city = ''.join(title_link.text.split(", ")[1].split(": ")[0])
                        university = ''.join(title_link.text.split(": ")[1])
                        # --- DEFENSIVE DATA EXTRACTION ---
                        # Check the length of the 'cells' list before accessing any index.
                        terms = ' '.join(cells[0].text.split()) if len(cells) > 0 else "Not Specified"
                        area_of_focus = ' '.join(cells[3].text.split()) if len(cells) > 3 else "Not Specified"

                        program_dict = {
                            "programName": " ".join(title_link.text.split()),
                            "country": country,
                            "city": city,
                            "university": university,
                            "description": f"Terms: {terms}. Areas of Focus: {area_of_focus}."
                        }
                        final_structured_data.append(program_dict)

                        # Advance index to the next program's title row
                        if (i + 2) < len(rows_on_this_page) and "program-focuses" in rows_on_this_page[i+2].get_attribute("class"):
                            i += 3
                        else:
                            i += 2
                    else:
                        i += 1
                except NoSuchElementException:
                    i += 1
                    continue
        except TimeoutException:
            print("Timed out waiting for table on page.")
            break

        # AFTER processing this page, try to navigate to the next one
        try:
            next_li = driver.find_element(By.CSS_SELECTOR, 'li.pagination-next:not(.disabled)')
            next_button = next_li.find_element(By.TAG_NAME, 'a')
            driver.execute_script("arguments[0].click();", next_button)
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
            print(f"SUCCESS: API accepted program '{program_payload.get('programName', 'N/A')}'.")
        else:
            print(f"FAILURE: API rejected program '{program_payload.get('programName', 'N/A')}'. Status: {response.status_code}, Body: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"CRITICAL FAILURE: Could not connect to API. Error: {e}")

if __name__ == '__main__':
    driver = setup_driver()
    try:
        scraped_data = scrape_and_process_all_pages(driver)
        print(f"\nSuccessfully parsed {len(scraped_data)} total program objects.")
        
        for program in scraped_data:
            print(f"  -> name: {program['programName']} | country: {program['country']} | Description: {program['description']} | University: {program['university']} | City: {program['city']}")
            
        System.exit(0)
        print("\n--- Starting API Population ---")
        if scraped_data:
            # Ensure the backend is running before this stage
            for program in scraped_data:
                send_program_to_api(program)
                time.sleep(0.1)
        else:
            print("No data was parsed, nothing to send to API.")
            
    finally:
        print("\nProcess complete. Closing browser.")
        driver.quit()