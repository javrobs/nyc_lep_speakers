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
    communities_json=communities.find_one({})
    communities_json.pop("_id")
    return jsonify(communities_json)

# Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
# We could filter out borough/language or both in API call, bc mongo querying is easier/faster than programatically filtering in JS (TBD)


@app.route("/populations")
def population_api():
    query={} # depending on API call maybe? -dropdown menu from site
    population_json=populations.find(query)
    population_list=[]
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    return jsonify(population_list)


        
#Run app code
if __name__=="__main__":
    app.run(debug=True)