import mysql.connector
from faker import Faker
import random
import time
from datetime import datetime
import os # Import os to read environment variables

DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'patrickwang',
    'password': '3035604',
    'database': 'madabroad_db'
} 

NUMBER_OF_REVIEWS_TO_CREATE = 200

# --- Helper Function ---
def should_be_verified():
    # Returns 1 (True) 90% of the time, 0 (False) 10% of the time.
    return 1 if random.randint(1, 10) > 1 else 0

# --- Main Script ---
def seed_reviews():
    fake = Faker()
    try:
        print("Connecting to the database...")
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("Connection successful.")

        print("Fetching program IDs...")
        cursor.execute("SELECT id FROM programs")
        program_ids = [item[0] for item in cursor.fetchall()]

        if not program_ids:
            print("Error: No programs found in the database. Please seed programs first.")
            return

        print(f"Found {len(program_ids)} programs. Generating {NUMBER_OF_REVIEWS_TO_CREATE} reviews...")

        for i in range(NUMBER_OF_REVIEWS_TO_CREATE):
            program_id = random.choice(program_ids)
            is_verified_status = should_be_verified()

            review_data = {
                'rating': random.randint(1, 5),
                'social_scene': random.randint(1, 5),          
                'academic_difficulty': random.randint(1, 5),
                'credit_transferability': random.randint(1, 5), 
                'culture': random.randint(1, 5),
                'title': fake.sentence(nb_words=random.randint(4, 8)).replace('.', ''),
                'personal_anecdote': fake.paragraph(nb_sentences=random.randint(5, 10)),                    
                'wisc_email': f"{fake.user_name()}@wisc.edu", 
                'verified': is_verified_status,                 
                'helpful': random.randint(0, 500),
                'review_date': fake.date_time_between(start_date='-2y', end_date='now'),
                'program_id': program_id,
                'verified': should_be_verified(),
            }

            sql = """
            INSERT INTO reviews (
                rating, social_scene, academic_difficulty, credit_transferability, culture,
                title, personal_anecdote, 
                helpful, review_date, program_id
            ) VALUES (
                %(rating)s, %(social_scene)s, %(academic_difficulty)s, %(credit_transferability)s, %(culture)s,
                %(title)s, %(personal_anecdote)s, %(helpful)s, %(review_date)s, %(program_id)s
            )
            """
            cursor.execute(sql, review_data)
            print(f"  -> Inserted review {i + 1}/{NUMBER_OF_REVIEWS_TO_CREATE} for program_id {program_id}")
            time.sleep(0.01)

        conn.commit()
        print("\nSuccessfully committed all new reviews to the database.")

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()
            print("Database connection closed.")

if __name__ == "__main__":
    seed_reviews()