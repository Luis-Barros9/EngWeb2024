import json
import sys


def main(arg):
    readfile = sys.stdin
    if len(arg) > 0:
        readfile = open(arg[0], "r")
        
    data = json.load(readfile)
    
    compositores = {}
    periodos = {}
    id = 1
    campos = ["nome", "id", "periodo", "bio", "dataNasc", "dataObito"]
    for compositor in data["compositores"]:
        valid = True
        for campo in campos:
            if not valid:
                break
            if campo not in compositor.keys():
                print(f"Erro: Campo {campo} não encontrado")
                valid = False
            else:
                compositor[campo] = compositor[campo].strip()
                if compositor[campo] == "":
                    print(f"Erro: Campo {campo} vazio")
                    valid = False
        
        if not valid:
            print("Erro: Compositor inválido" + str(compositor))
            continue

        

        if compositor["id"] in compositores.keys():
            print("Erro: ID duplicado")
            continue

        # falta acrescentar mais verificações, por exemplo, se a data de nascimento é anterior à data de óbito

        if compositor["periodo"] not in periodos.keys():
            periodos[compositor["periodo"]] = f"p{id}"
            id += 1

        compositor["periodo"] = periodos[compositor["periodo"]]
        compositores[compositor["id"]] = compositor
    
    per = []
    for key,value in periodos.items():
        per.append({"id": value, "nome": key})

    myBd = {
        "Compositores": list(compositores.values()),
        "Periodos": per
    }

    f = open("compositores2.json", "w")
    json.dump(myBd, f, indent=2)
    f.close()


if __name__ == "__main__":
    main(sys.argv[1:])