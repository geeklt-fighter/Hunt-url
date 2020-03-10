# coding=utf-8
import logging
import azure.functions as func
import pandas as pd
import os
import requests
import re
import time
import asyncio
import chardet
import json
from timeit import default_timer
from datetime import datetime
from bs4 import BeautifulSoup
from azure.storage.blob import BlockBlobService
from concurrent.futures import ThreadPoolExecutor


START_TIME = default_timer()


def fetch(session, url, timeout):
    try:
        with session.get(url, allow_redirects=40,timeout=timeout) as response:

            if response.status_code != 200:
                return url, "Fail Connection", response.status_code
            else:
                # Need to encode the response, or you will get the garbled text
                # print('Encoding:', chardet.detect(
                #     response.content)['encoding'])
                # response.text.encode("utf8").decode("cp950", "ignore")

                response.encoding = 'utf-8'

                data = response.text
                soup = BeautifulSoup(data, 'lxml')
                # Get the p tag in the webpage
                p_tags = soup.find_all('p')
                p_tags_text = [tag.get_text().strip() for tag in p_tags]
                sentence_list = [
                    sentence for sentence in p_tags_text if not '\n' in sentence]
                article = ' '.join(sentence_list)

                elapsed = default_timer() - START_TIME
                time_completed_at = "{:5.2f}s".format(elapsed)

                return url, article, response.status_code

    # Need to handle the error, otherwise it will stuck and not operate
    except (requests.exceptions.ConnectionError, requests.exceptions.TooManyRedirects, requests.exceptions.RequestException,requests.exceptions.Timeout) as e:
        return url, "Connection Refused", "There is no response"


async def get_data_asynchronous(myblob):

    # Create the blob Service
    block_blob_service = BlockBlobService(
        connection_string=os.environ['History_Storage'])

    # For JSON file
    # df = pd.read_json(myblob.read().decode('utf8'), orient='columns')

    stringBlob = myblob.read().decode('utf8')
    data = json.loads(stringBlob)
    df = pd.DataFrame.from_dict(data,orient='columns')

    urls = []
    responses = []
    status_codes = []
    for i, url in enumerate(df['identifier'].str.split('/')):
        if len(url) > 3:
            df = df.drop(index=i)

    print("{0:<30} {1:>20}".format("File", "Completed at"))
    with ThreadPoolExecutor(max_workers=30) as executor:
        with requests.Session() as session:
            # Set any session parameters here before calling `fetch`
            # session.max_redirects = 50
            session.max_redirects = 40

            # Initialize the event loop
            loop = asyncio.get_event_loop()

            # Set the START_TIME for the `fetch` function
            START_TIME = default_timer()

            # Use list comprehension to create a list of
            # tasks to complete. The executor will run the `fetch`
            # function for each csv in the csvs_to_fetch list
            tasks = [
                loop.run_in_executor(
                    executor,
                    fetch,
                    # Allows us to pass in multiple arguments to `fetch`
                    *(session, url,60)
                )
                for url in df['url']
            ]

            # Initializes the tasks to run and awaits their results
            for url, response, status_code in await asyncio.gather(*tasks):
                responses.append(response)
                urls.append(url)
                status_codes.append(status_code)
                pass


            df['url_saw'] = urls
            df['descr'] = responses
            df['status'] = status_codes
            
            file = df.to_json()

            block_blob_service.create_blob_from_text('history-scrape-files',
                                                      '{}-urldescr.csv'.format(str(datetime.now()).replace(" ", "").replace("-", "").replace(":", "").replace(".", "")),
                                                      bytes(file,'utf8'))
            # df.to_csv('./descr_data/{}-urldescr.csv'
            #           .format(str(datetime.now()).replace(" ", "").replace("-", "").replace(":", "").replace(".", "")), encoding='utf-8')


def main(myblob: func.InputStream):
    # loop = asyncio.get_event_loop()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    future = asyncio.ensure_future(get_data_asynchronous(myblob))
    loop.run_until_complete(future)
    print('complete')

    
