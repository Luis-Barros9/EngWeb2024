import json
import sys
import requests

url = 'http://localhost:3000/pessoa/'


def main(argv):
    fileName = "dataset-extra1.json"
    if len(argv) == 1:
        fileName = argv[0]
    
    json_file = open(fileName, 'r')
    # load json data from file
    data = json.load(json_file)

    for pessoa in data['pessoas']:
        response = requests.post(url, json=pessoa)
        print(response.text)


    
if __name__ == "__main__":
    main(sys.argv[1:])