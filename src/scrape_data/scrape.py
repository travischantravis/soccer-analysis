from bs4 import BeautifulSoup
import csv
import re
import requests
import time

# A compiler to remove non-numeric characters
non_decimal = re.compile(r'[^\d.]+')

# Start of stopwatch
t0 = time.time()

# Set headers
headers = {
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'}

# Set url
# 2019, 2018, -1: with header
# 2018, 2004, -1: without header
for i in range(2005, 2004, -1):
    year_param = i
    BASE_URL = f"https://www.transfermarkt.co.uk/premier-league/startseite/wettbewerb/GB1/saison_id/{year_param}/plus"
    page = requests.get(BASE_URL, headers=headers)

    # Locate tags
    soup1 = BeautifulSoup(page.content, 'html.parser')
    soup2 = BeautifulSoup(soup1.prettify(), 'html.parser')
    table = soup2.find('table', {'class': 'items'}).find('tbody')
    data_rows = table.find_all("tr")

    # Column names
    csv_columns = ['name', 'squad_size', 'avg_age',
                   'foreigners', 'market_value', 'year']

    clubs = []

    # Iterate every row in the table
    for row in data_rows:

        # Temporary dictionary
        club = {
            'name': '',
            'squad_size': 0,
            'avg_age': 0,
            'foreigners': 0,
            'market_value': 0,
            'year': year_param
        }

        # Get club data
        data_cells = row.find_all('td')
        club['name'] = data_cells[1].a.get_text().strip()
        club['squad_size'] = int(data_cells[3].a.get_text().strip())
        club['avg_age'] = float(
            data_cells[4].get_text().strip().replace(',', '.'))
        club['foreigners'] = int(data_cells[5].get_text().strip())
        club['market_value'] = float(non_decimal.sub(
            '', data_cells[6].a.get_text().strip()))

        clubs.append(club.copy())

    # Write to csv file
    try:
        with open("pl_club.csv", 'a') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            # Make sure headers are written only once
            # writer.writeheader()
            for club in clubs:
                writer.writerow(club)
    except IOError:
        print("I/O error")


# Get processing time
t1 = time.time()
print(f"Process took {round(t1-t0, 2)} seconds.")
