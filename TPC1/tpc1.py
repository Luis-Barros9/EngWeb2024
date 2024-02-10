import xml
import os



html='''
    <!DOCTYPE html>
    <html>
    <head>
        <title> EngWeb2024</title>
        <meta charset ="UTF-8">
    </head>
    <body>
    '''

def criarhtml(fileName,pathFolder):
    #função que cria o ficheiro html para cada rua e retorna o caminho para o mesmo
    filePath = f"{pathFolder}/{fileName}"
    templateCidade = html

    # TODO parse the xml file

    #TODO use the parsed data to create the html file

    





def main():
    html='''
    <!DOCTYPE html>
    <html>
    <head>
        <title> EngWeb2024</title>
        <meta charset ="UTF-8">
    </head>
    <body>
    '''
    folderPath = "../../aula1/MapaRuas-materialBase"

    textoPath = f"{folderPath}/texto"

    if not os.path.exists(texto):
        print("Não encontrei a pasta com os ficheiros xml :(")
        return
    

    if not os.path.exists("resultados/ruas"):
        os.makedirs("resultados/ruas")

    for x in os.listdir(textoPath):
        if x.endswith(".xml"):
            criarhtml()


if __name__ == "__main__":
    main()