import requests
import datetime
def number_fact(n):
    return requests.get(f"http://number-trivia.com/{n}").text

def date_fact():
    now = datetime.datetime.now()
    return requests.get(f"http://number-trivia.com/{now.month}/{now.day}/date").text

def random_fact():
    return requests.get(f"http://number-trivia.com/random").text