import xml.etree.ElementTree as ET
import xmlschema
import re
import os




html='''
<!DOCTYPE html>
<html>
<head><title>EngWeb2024</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
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



def createLine(element,pathToFolder,index = 1):
    res =""
    if element.tag == "para":

        x = clearParagraph(ET.tostring(element,encoding="unicode"))
        
        res = f"    <p>\n   {x}\n</p>\n"
    elif element.tag == "figura":
        #<div style='text-align: center;'><figure><img src='{image_path}' style='max-width: 70%;height: auto;' alt='{caption}'><figcaption style='font-size: 14px;'>Fig. {index} - {caption}</figcaption></figure>
        id = element.get("id")
        imagePath = f"../../{pathToFolder}/{element.find('imagem').get('path').strip()}"
        legenda = element.find("legenda").text
        res= f"<figure><img id='{id}' class ='w3-image' src='{imagePath}' alt='{legenda}'><figcaption style='text-align: center;'>Fig. {index} - {legenda}</figcaption></figure>"
        index+=1
    elif element.tag == "lista-casas":

        #create html list with all the houses
        res = "<div><h2>Lista Casas</h2><ul>\n"
        for casa in element:
            x,index = createLine(casa,pathToFolder,index= index)
            res += f"<li>\n\t{x}\n</li>\n"
        res += "</ul></div>"
    elif element.tag == "casa":
        
        res = "<div>\n"
        for elem in element:
            x,index = createLine(elem,pathToFolder,index= index)
            res += f"\t{x}\n"
            
        res += "</div>\n"

    elif element.tag == "número":
        res = f"<h3> Casa número(s){element.text}</h3>"
    
    elif element.tag == "enfiteuta":
        res= f"<h4> Enfietura: {element.text}</h4>"
    
    elif element.tag == "desc":
        res = "<div>\n"
        for elem in element:
            x,index = createLine(elem,pathToFolder,index=index)
            res += f"\t{x}\n"
        res += "</div>\n"
        
    return res,index


def criarhtml(root, pathFolder, resultsFolder="resultados/ruas"):
    """
    Function that creates an HTML file for each street and returns the path to the file.

    Args:
        root (Element): The root element of the XML document.
        pathFolder (str): The path to the data folder.
        resultsFolder (str, optional): The folder where the HTML files will be saved. Defaults to "resultados/ruas".

    """
    templateCidade = html
    # get path to CurrentFolder

    header = root.find("meta")
    nome = header.find('nome').text




    templateCidade+= f'''
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h3 style="display: flex; justify-content: center; align-items: center;">{nome}</h3>
                <h6 style="display: flex; justify-content: flex-start; align-items: left";><a href='../mapa.html'>Voltar</a></h6>
            </header>
        </div>
        <div class="w3-container">
    '''


    corpo = root.find("corpo")
    i= 1
    for para in corpo:
        res,index = createLine(para, pathFolder,index=i)
        i = index
        templateCidade += res


    templateCidade += f"\n</div>\n"

    templateCidade += '\n</body></html>'

    file = open(f"{resultsFolder}/{nome}.html", "w", encoding="utf-8")
    file.write(templateCidade)
    file.close()





def main():
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

    
    html1 = html
    html1 += "<ul>"
    
    for elem in sorted(ruas): 
        html1 += f"<li><a href ='ruas/{elem}.html'> {elem}</li>"

    html1 += "</ul>"

    html1 += "</body>"
    html1 += "</html>"

    file = open(f"{results}/mapa.html","w",encoding ="utf-8")
    file.write(html1)
    file.close()


    print(f"Existem {invalidos} ficheiros inválidos")
if __name__ == "__main__":
    main()