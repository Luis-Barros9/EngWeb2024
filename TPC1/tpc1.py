import xml.etree.ElementTree as ET
import xmlschema
import re
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


def clearParagraph(paragraph):
    '''
     função que transofrma uma linha xml num parágrafo html
    <para>\n            Envolvia muralha, do lado Este, e ligava o exterior da <lugar>Porta do Souto</lugar>ao <lugar>campo dos Rem&#233;dios</lugar>.\n        </para>\n
    Envolvia muralha, do lado Este, e ligava o exterior da <strong id="lugar">Porta do Souto</strong>ao <strong id="lugar">campo dos Rem&#233;dios</strong>.\n
    '''

    # REMOVE <para> and </para> and replace it with <p> and </p>
    paragraph = paragraph.replace("<para>", "")
    paragraph = paragraph.replace("</para>", "")
    
    paragraph = paragraph.strip()
    

    # FIND EVERY PATTERN OF <ALGO> and replace it with <strong id="ALGO">


    paragraph = re.sub(r'<(\w+)>', r'<strong id="\1">', paragraph)
    paragraph = re.sub(r'</(\w+)>', r'</strong>', paragraph)

    return paragraph



def createLine(element,pathToFolder = None):
    res =""
    if element.tag == "para":

        x = clearParagraph(ET.tostring(element,encoding="unicode"))
        
        res = f"    <p>\n   {x}\n</p>\n"
    elif element.tag == "figura":

        id = element.get("id")
        imagePath = f"../../{pathToFolder}/{element.find('imagem').get('path').strip()}"
        legenda = element.find("legenda").text
        res= f"<img id='{id}' src='{imagePath}' alt='{legenda}'>"
    elif element.tag == "lista-casas":

        #create html list with all the houses
        res = "<div><h2>Lista Casas</h2><ul>\n"
        for casa in element:
            res += f"<li>\n\t{createLine(casa,pathToFolder)}\n</li>\n"
        res += "</ul></div>"
    elif element.tag == "casa":
        
        res = "<div>\n"
        for elem in element:
            res += f"\t{createLine(elem,pathToFolder)}\n"
            
        res += "</div>\n"

    elif element.tag == "número":
        return f"<h3> Casa número(s){element.text}</h3>"
    
    elif element.tag == "enfiteuta":
        return f"<h4> Enfietura: {element.text}</h4>"
    
    elif element.tag == "desc":
        res = "<div>\n"
        for elem in element:
            res += f"\t{createLine(elem,pathToFolder)}\n"
        res += "</div>\n"
        
    return res


def criarhtml(root,pathFolder,resultsFolder = "resultados/ruas"):
    #Função que cria o ficheiro html para cada rua e retorna o caminho para o mesmo

    templateCidade = html
    # get path to CurrentFolder


    header = root.find("meta")
    nome =header.find('nome').text
    
    templateCidade += f"<h1>{nome}</h1>"

    corpo = root.find("corpo")

    
    for para in corpo:
        templateCidade += createLine(para,pathFolder)


    templateCidade += f"\n</div>\n"
    templateCidade+= f"<h6><a href='../mapa.html'>Voltar</h6>"

    templateCidade += '\n</body></html>'

    
    file = open(f"{resultsFolder}/{nome}.html","w",encoding ="utf-8")
    file.write(templateCidade)
    file.close()





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


    xsdFile = f"{folderPath}/MRB-rua.xsd"

    textoPath = f"{folderPath}/texto"



    if not os.path.exists(xsdFile) or not os.path.exists(textoPath):
        print("Não encontrei a pasta com os ficheiros xml :(")
        return
    
        
    results ="resultados"
    resultsStreets = f"{results}/ruas"
    if not os.path.exists(resultsStreets):
        os.makedirs(resultsStreets)

    invalidos = 0

    ruas = []
    for x in os.listdir(textoPath):

        if x.endswith(".xml"):
            filename = f"{textoPath}/{x}"
            
            #validade x(xml) file accordint to xsdFile(xsd)
            schema = xmlschema.XMLSchema(xsdFile)

            if not schema.is_valid(filename):
                invalidos += 1
                print(f"O ficheiro {filename} é inválido")

            
            
            root = ET.parse(filename)
            header = root.find("meta")
            nome =header.find('nome').text
            ruas.append(nome)
            criarhtml(root,textoPath,resultsStreets)

    
    html += "<ul>"
    
    for elem in sorted(ruas): 
        html += f"<li><a href ='ruas/{elem}.html'> {elem}</li>"

    html += "</ul>"

    html += "</body>"
    html += "</html>"

    file = open(f"{results}/mapa.html","w",encoding ="utf-8")
    file.write(html)
    file.close()


    print(f"Existem {invalidos} ficheiros inválidos")
if __name__ == "__main__":
    main()