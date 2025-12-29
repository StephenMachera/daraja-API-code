import requests
from requests.auth import HTTPBasicAuth
import os
import time
from dotenv import load_dotenv
import base64
from datetime import datetime
load_dotenv()

# simple cache to ensure the access token is upto date
ACCESS_TOKEN = None
TOKEN_EXPIRE = 0

CONSUMER_KEY = os.getenv('CONSUMER_KEY')
CONSUMER_SECRET = os.getenv('CONSUMER_SECRET')
BUSSINESS_SHORTCODE = os.getenv('BUSSINESS_SHORTCODE')
PASSKEY = os.getenv('PASSKEY')

def get_access_token():
    global ACCESS_TOKEN,TOKEN_EXPIRE

    # if access token still valid return it
    if ACCESS_TOKEN and time.time() < TOKEN_EXPIRE:
        return ACCESS_TOKEN
    response = requests.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        auth=HTTPBasicAuth(CONSUMER_KEY,CONSUMER_SECRET)
    )
    if response.status_code != 200:
        raise Exception(f'Failed to get access token: {response.text}')
    data = response.json()
    ACCESS_TOKEN = data.get('access_token')
    TOKEN_EXPIRE = time.time() + 3500
    return ACCESS_TOKEN

def generate_password():
    # Safaricom expects timestamp in YYYYMMDDHHMMSS format
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    data_to_encode = BUSSINESS_SHORTCODE + PASSKEY + timestamp

    # Generate the password by encoding the data to base64
    password = base64.b64encode(data_to_encode.encode()).decode('utf-8')

    return password, timestamp

