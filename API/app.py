#Import flask and jsonify to run the api
from flask import Flask,jsonify
from pymongo import MongoClient
from flask_cors import CORS
import pandas as pd

# Create an instance of MongoClient
client=MongoClient(port=27017)

# Assign the database to a variable name
languages=client.languages

# Assign the collections to variables
populations=languages.populations
communities=languages.communities

# Define app to run api using Flask
app = Flask(__name__)

CORS(app, origins=["http://localhost:8000"])

@app.route("/")
def home():
    return "This site is for developers only<br>\
            These are the possible routes:<br>\
            <a href='http://127.0.0.1:5000/communities'>/communities</a><br>\
            <a href='http://127.0.0.1:5000/populations_all'>/populations_all</a><br>\
            <a href='http://127.0.0.1:5000/populations/Spanish'>/populations/language </a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/demographic_all'>/demographic_all</a><br>\
            <a href='http://127.0.0.1:5000/demographic/Spanish'>/populations/language </a> (Ex. Spanish)<br>"
            

@app.route("/communities")
def communities_api():
    communities_json=communities.find_one({})
    communities_json.pop("_id")
    return jsonify(communities_json)

@app.route("/populations_all")
def population_api():
    # Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)

@app.route("/populations/<language>")
def population_language_api(language):
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    population_json=populations.find(query)
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)

@app.route("/demographic_all")
def demographics_all_api():
    # Filter out 0 in LEP Population (To not show languages  with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    total_population_df = pd.DataFrame(population_json)
    total_population=sum(total_population_df['LEP Population (Estimate)'])
    return ({'result':total_population})

@app.route("/demographic/<language>")
def demographic_api(language):
    match_query= {'$match':{'Language': language}}
    group_query = {'$group':{'_id':'$Language','Lep Population':{'$sum':'$LEP Population (Estimate)'}}}
    pipeline=[match_query,group_query]
    results= list(populations.aggregate(pipeline))
    return jsonify(results)
        
#Run app code
if __name__=="__main__":
    app.run(debug=True)