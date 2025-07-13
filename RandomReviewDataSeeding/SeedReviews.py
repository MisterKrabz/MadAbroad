import mysql.connector
from faker import Faker
import random
import time
from datetime import datetime, timedelta # Import timedelta

# --- Configuration ---
DB_CONFIG = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'patrickwang',
    'password': '3035604',
    'database': 'madabroad_db'
}

NUMBER_OF_REVIEWS_TO_CREATE = 200

# --- Helper Function ---
def random_verify():
    return random.randint(1, 10) > 1

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
            is_verified_status = random_verify()

            review_data = {
                'rating': random.randint(1, 5),
                'social': random.randint(1, 5),
                'academic_difficulty': random.randint(1, 5),
                'culture': random.randint(1, 5),
                'title': fake.sentence(nb_words=random.randint(4, 8)).replace('.', ''),
                'personal_anecdote': fake.paragraph(nb_sentences=random.randint(5, 10)),
                'author_name': fake.name(),
                'author_email': f"{fake.user_name()}@wisc.edu",
                'is_verified': is_verified_status,
                'helpful': random.randint(0, 500),
                'review_date': fake.date_time_between(start_date='-2y', end_date='now'),
                'report_count': 0,
                'program_id': program_id,
                # --- LOGIC CHANGE ---
                # If the review is NOT verified, give it a token and an expiry date.
                # If it IS verified, these will be NULL.
                'verification_token': None if is_verified_status else fake.uuid4(),
                'token_expiry_date': None if is_verified_status else datetime.now() - timedelta(days=1) # Expired
            }
            
            # UPDATED: SQL statement includes token fields
            sql = """
            INSERT INTO reviews (
                rating, social, academic_difficulty, culture,
                title, personal_anecdote, author_name, author_email, is_verified,
                helpful, review_date, report_count, program_id,
                verification_token, token_expiry_date
            ) VALUES (
                %(rating)s, %(social)s, %(academic_difficulty)s, %(culture)s,
                %(title)s, %(personal_anecdote)s, %(author_name)s, %(author_email)s, %(is_verified)s,
                %(helpful)s, %(review_date)s, %(report_count)s, %(program_id)s,
                %(verification_token)s, %(token_expiry_date)s
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