import json
import sys

def main(argv):
    if len(argv) != 1:
        print("Usage: python correctFilmes.py <pathToJson>")
        return
    file = open(argv[0], "r")

    filmes = []
    atores = {}
    generos = {}
    idAtor = 1
    idGenero = 1

    expectedKeys = ["_id","title", "year", "cast", "genres"]
    for line in file:
        try:
            data = json.loads(line)
            valid = True
            for key in expectedKeys:
                if key not in data.keys():
                    print(f"Error: {key} not found in {line}")
                    valid = False
                    continue
            if valid and len(data["cast"]) > 0 and len(data["genres"]) > 0:
                data["_id"] = data["_id"]["$oid"]
                novosAtores = []
                for ator in data["cast"]:
                    if ator not in atores.keys():
                        atores[ator] = f"a{idAtor}"
                        idAtor += 1
                    novosAtores.append(atores[ator])
                data["cast"] = novosAtores
                novosGeneros = []
                for genero in data["genres"]:
                    if genero not in generos.keys():
                        generos[genero] = f"g{idGenero}"
                        idGenero += 1
                    novosGeneros.append(generos[genero])
                data["genres"] = novosGeneros
                filmes.append(data)
        except:
            print("Error: " + line)

    atoresJson = []
    for key,value in atores.items():
        atoresJson.append({"id": value, "nome": key})

    generosJson = []
    for key,value in generos.items():
        generosJson.append({"id": value, "designacao": key})

    myBd = {
        "Filmes": filmes,
        "Atores": atoresJson,
        "Generos": generosJson
    }

    f = open("filmes2.json", "w")
    json.dump(myBd, f, indent=2)
    f.close()


if __name__ == "__main__":
    main(sys.argv[1:])