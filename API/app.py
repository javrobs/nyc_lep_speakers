#Import flask and jsonify to run the api
from flask import Flask,jsonify
from pymongo import MongoClient
from flask_cors import CORS
import pandas as pd
from flask import render_template

# Create an instance of MongoClient
client=MongoClient(port=27017)

# Assign the database to a variable name
languages=client.languages

# Assign the collections to variables
populations=languages.populations
communities=languages.communities

# Define app to run api using Flask
app = Flask(__name__)

# Override chrome's CORS settings to be able to connect two different local ports
CORS(app)

# Main site for our API with links to all our routes and to dashboard
@app.route("/")
def home():
    return "To website:<br>\
            <a href='http://127.0.0.1:5000/endpoint'>New York City LEP Speakers</a><br><br>\
            These are the possible routes for our API:<br>\
            <a href='http://127.0.0.1:5000/communities_all'>/communities_all</a><br>\
            <a href='http://127.0.0.1:5000/communities/Spanish'>/communities/Spanish</a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/populations_all'>/populations_all</a><br>\
            <a href='http://127.0.0.1:5000/populations/Spanish'>/populations/language </a> (Ex. Spanish)<br>\
            <a href='http://127.0.0.1:5000/demographic_all'>/demographic_all</a><br>\
            <a href='http://127.0.0.1:5000/demographic/Spanish'>/demographic/language </a> (Ex. Spanish)<br>"
            

# Merge together communities(GEOJSON) and a numerical value with the total LEP population of each community district
@app.route("/communities_all")
def communities_api():

    #Mongo query to retrieve our GEOJSON. It's all a single entry in our database and store in a variable
    com_dict = communities.find_one({})
    #Get rid of automatically generated _id key
    com_dict.pop("_id")

    #Mongo query to retrieve all the documents in the populations collection and store in a variable
    pop_dict= list(populations.find())
    #Get rid of automatically generated _id key
    for each in pop_dict:
        each.pop("_id")
    
    #Use Pandas Groupby to sum the populations ignoring language
    df=pd.DataFrame(pop_dict).groupby(["Borough Community District Code","Borough","Community District Name"]).sum()[["LEP Population (Estimate)"]].reset_index(drop=False).set_index("Borough Community District Code")
    #Turn results back into a python dictionary
    merged=df.to_dict(orient="dict")

    #For each feature inside the geojson results, try adding the properties obtained from the merged variable
    for i,each in enumerate(com_dict["features"]):
        try: 
            each["properties"]["population"]=merged["LEP Population (Estimate)"][each["properties"]["boro_cd"]]
            each["properties"]["name"]=merged["Community District Name"][each["properties"]["boro_cd"]]
            each["properties"]["borough"]=merged["Borough"][each["properties"]["boro_cd"]]
        #The geojson contains extra poligons for parks and airports, which we don't want in our final result. Store 0s for now
        except:
            each["properties"]["population"]=0
            each["properties"]["name"]=0
            each["properties"]["borough"]=0
    #Filter out the 0s we created because they have no population (from being public areas)
    com_dict["features"]=list(filter(lambda line: line["properties"]["name"]!=0,com_dict["features"]))
    
    #Send joined data to API route
    return jsonify(com_dict)


# Merge together communities(GEOJSON) and a numerical value with the LEP population of a specific language of each community district
@app.route("/communities/<language>")
def communities_language_api(language):

    #Mongo query to retrieve our GEOJSON. It's all a single entry in our database and store in a variable
    com_dict = communities.find_one({})
    #Get rid of automatically generated _id key
    com_dict.pop("_id")
  
    #Mongo query to retrieve the documents in the populations that include the "language" variable and store in a variable  
    query = {"Language" : language}
    #Only include a few columns
    include = {"Language": 1, "LEP Population (Estimate)":1, "Borough Community District Code": 1, "Community District Name":1,"Borough":1}
    pop_dict= list(populations.find(query, include))
    #Set up an empty dictionary
    merged = {}
    for each in pop_dict:
        #Set up district code as key in the merged dictionary. The value will be a list of three items: The population, the community district name and the borough
        merged[each ["Borough Community District Code"]] = [each ["LEP Population (Estimate)"],each["Community District Name"],each["Borough"]]

    #For each feature inside the geojson results, try adding the properties obtained from the merged variable  
    for each in com_dict["features"]:
        try: 
            each["properties"]["population"]=merged[each["properties"]["boro_cd"]][0]
            each["properties"]["name"]=merged[each["properties"]["boro_cd"]][1]
            each["properties"]["borough"]=merged[each["properties"]["boro_cd"]][2]
        #The geojson contains extra poligons for parks and airports, which we don't want in our final result. Store 0s for now
        except:
            each["properties"]["population"]=0
            each["properties"]["name"]=0
            each["properties"]["borough"]=0
    #Filter out the 0s we created because they have no population (from being public areas)
    com_dict["features"]=list(filter(lambda line: line["properties"]["name"]!=0,com_dict["features"]))
    
    #Send joined data to API route
    return jsonify(com_dict)


@app.route("/populations_all")
def population_api():
    # Filter out 0 in LEP Population (To not show languages with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    population_list=[]
    # Pop the _id key for each entry and append the results into a list
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    #Return full list of population values
    return jsonify(population_list)

@app.route("/populations/<language>")
def population_language_api(language):
    # Filter out 0 in LEP Population, matching with language from the request
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    population_json=populations.find(query)
    population_list=[]
    # Pop the _id key for each entry and append the results into a list
    for each in population_json:
        each.pop("_id")
        population_list.append(each)
    #Return full list of population values
    return jsonify(population_list)

@app.route("/demographic_all")
def demographics_all_api():
    # Filter out 0 in LEP Population (To not show languages  with 0 speakers every single time)
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    total_population_df = pd.DataFrame(population_json)
    total_population=sum(total_population_df['LEP Population (Estimate)'])
    response_dict = {}
    response_dict["Language"]="All"
    response_dict["Total LEP population"] = total_population
    
# information for BIGGEST  5 LEP communities
    query={'LEP Population (Estimate)':{"$gt":0}}
    sort=[('LEP Population (Estimate)',-1)]
    fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1,"Language":1}
    limit=5
    demo_list= []
    demo_data=populations.find(query,fields).sort(sort).limit(limit)
    for each in demo_data:
        each.pop("_id")
        demo_list.append(each)
    response_dict["Biggest Communities"]=demo_list
    return jsonify(response_dict)


@app.route("/demographic/<language>")
def demographic_api(language):
    query={'LEP Population (Estimate)':{"$gt":0}}
    population_json=populations.find(query)
    total_population_df = pd.DataFrame(population_json)
    total_population=sum(total_population_df['LEP Population (Estimate)'])

    match_query= {'$match':{'Language': language}}
    group_query = {'$group':{'_id':'$Language','sum':{'$sum':'$LEP Population (Estimate)'}}}
    pipeline=[match_query,group_query]
    language_sum= list(populations.aggregate(pipeline))[0]['sum']
    result_dict={}
    result_dict['LEP Percentage']="{:.5%}".format(language_sum/total_population)
    result_dict['Language']=language
    result_dict['Total LEP population']=language_sum
    # 5 biggest communities that speak this language!!!!
    query={'LEP Population (Estimate)':{"$gt":0},'Language':language}
    sort=[('LEP Population (Estimate)',-1)]
    fields ={"Borough":1,"LEP Population (Estimate)":1,"Community District Name":1}
    limit=5
    demo_list= []
    demo_data=populations.find(query,fields).sort(sort).limit(limit)
    for each in demo_data:
        each.pop("_id")
        demo_list.append(each)
    result_dict[f"Biggest Communities"]=demo_list
    return (result_dict)

#Use render_template to return the dashboard HTML site
@app.route("/endpoint")
def endpoint():
    return (render_template('index.html'))
        
#Run app code
if __name__=="__main__":
    app.run(debug=True)