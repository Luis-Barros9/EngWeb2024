# TPC1

## Descrição

Neste tpc, é fornecido um ficheiro zip que possui 3 pastas, sendo que duas delas são de imagens e outra de textos __xml__. O objetivo deste trabalho é criar um ficheiro __html__ que funcionará de índice para as páginas de cada uma das ruas, permitindo assim a navegação entre ruas.


## Resultado

O programa começa por iterar sobre todos os ficheiros xml, presentes na pasta validando assim os dados de acordo com o ficheiro xsd e caso seja inválido informa o utilizador, como não sei se os resultados estar realmente errados, procedo normalmente. Dito isto, construo o html para cada ficheiro xml e vou guardando assim em lista a informação relativa ao nome de todas as ruas numa lista. De seguida ordeno essa lista e crio o índice para todas as páginas html

Como resultado da execução do progama, é criada uma pasta 'resultados' onde serão armazenados os ficheiros html. Dentro desta pastas encontramos um índice para todas as ruas, os ficheiros html destas encontram-se dentro da pasta 'ruas'.