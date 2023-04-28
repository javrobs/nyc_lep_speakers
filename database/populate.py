#RUN ONLY IF YOU WANT TO SET DATABASE BACK TO DEFAULT
#Make sure your mongo server is running before executing this code


#Import dependecies
from pymongo import MongoClient
import pandas as pd
import json
import csv
import os

#Set up MongoClient
client=MongoClient(port=27017)
print(f"Database list in Mongo: {client.list_database_names()}")

#Drop database if it exists
client.drop_database("languages")
print("Dropped languages database\n--------")



#Set up a variable for database
languages=client["languages"]

#Set up variables for collections
communities=languages["communities"]
populations=languages["populations"]



#Open geojson file and save in data variable
jsonpath = os.path.join('..', 'downloaded_data', 'Community_Districts.geojson')
with open(jsonpath) as file:
    data = json.load(file)

#Insert geojson to communities collection
communities.insert_one(data)
print(f"Created communities collection, added {communities.count_documents({})} documents")



#Open csv file and save in data variable

csvpath = os.path.join('..', 'downloaded_data', 'Population_and_Languages_of_the_Limited_English_Proficient__LEP__Speakers_by_Community_District.csv')
with open(csvpath) as file:
    data = csv.reader(file)
    
    #Define headers to be keys in json
    headers=next(data)
    
    #Create empty list to fill with dictionaries
    populations_data=[]
    
    #Create a dictionary for each row of csv
    for row in data:
        row_dic={}
        #Use header as key in new dictionary and values from row
        for i,header in enumerate(headers):
            row_dic[header]=row[i]
        #Append dictionary to list
        populations_data.append(row_dic)

#Insert list of dictionaries to populations collection
populations.insert_many(populations_data)
print(f"Created populations collection, added {populations.count_documents({})} documents")
print(populations.find_one({}))
populations.update_many({},[{"$set":{"CVALEP Population (Estimate)":{"$toInt":"$CVALEP Population (Estimate)"},
                                     "LEP Population (Estimate)":{"$toInt":"$LEP Population (Estimate)"},
                                     "% of CVALEP Population":{"$toDouble":"$% of CVALEP Population"},
                                     "% of LEP Population":{"$toDouble":"$% of LEP Population"}}}])
#Show Mongo databases
print(f"Database list in Mongo (after adding): {client.list_database_names()}")
