#Import flask and jsonify to run the api
from flask import Flask,jsonify
from pymongo import MongoClient

# Create an instance of MongoClient
client=MongoClient(port=27017)

# Assign the database to a variable name
languages=client.languages

# Assign the collections to variables
populations=languages.populations
communities=languages.communities

# Define app to run api using Flask
app = Flask(__name__)

@app.route("/communities")
def communities_api():
    communities_json=communities.find({})
    communities_list=[]
    for each in communities_json:
        each.pop("_id")
        communities_list.append(each)
    return jsonify(communities_list)

@app.route("/populations")
def population_api():
    population_json=populations.find({})
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)


        
#Run app code
if __name__=="__main__":
    app.run(debug=True)