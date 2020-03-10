import os
import logging
import pandas as pd
import azure.functions as func
from datetime import datetime
from datetime import timedelta
from azure.storage.blob import BlockBlobService
import numpy as np
import pathlib



def main(myblob: func.InputStream):
    df = pd.read_csv(myblob)

    # # Old way to get the file with sas token
    work_dir = pathlib.Path(__file__).parent
    block_blob_service = BlockBlobService(
        connection_string=os.environ['History_Storage']
    )

    # Remove the dirty data which identifier is wrong
    for i, urlArray in enumerate(df['identifier'].str.split('/')):
        if len(urlArray) > 3:
            df = df.drop(index=i)
    
    # For testing 
    # df = df.head(11)
    # df = np.array_split(df, int(len(df)/3+1), axis=0)
    
    # Real sitaution
    df = np.array_split(df, int(len(df)/5000+1), axis=0)
    
    counter = 0
    for smalldf in df:
        smalldf = pd.DataFrame(smalldf)
        counter = counter + 1
        local_create_time = str(datetime.now()).replace(
            " ", "").replace("-", "").replace(":", "").replace(".", "")
        
        file = smalldf.to_json()
        
        block_blob_service.create_blob_from_text('history-split-files',
                                                 '{}-hundred-url-{}.csv'.format(counter, str(datetime.now()).replace(
                                                     " ", "").replace("-", "").replace(":", "").replace(".", "")),
                                                 bytes(file,'utf8'))

