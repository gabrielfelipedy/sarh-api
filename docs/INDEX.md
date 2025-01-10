# DOCUMENTAÇÃO API SARH 

# Sumário

* [Lotação](https://github.com/gabrielfelipedy/sarh-api/blob/dev/docs/INDEX.md#lotação)
* [Pessoas](https://github.com/gabrielfelipedy/sarh-api/blob/dev/docs/INDEX.md#pessoas)
* [Servidores](https://github.com/gabrielfelipedy/sarh-api/blob/dev/docs/INDEX.md#servidores)
* [Pensionistas](https://github.com/gabrielfelipedy/sarh-api/blob/dev/docs/INDEX.md#pensionistas)




## Lotação

Aqui estão todo os endpoints relacionados às lotações internas da Justiça Federal do Amapá.

## ``/lotacao``

#### Método: ``POST``
#### Variável: ``codigo_lotacao``
#### Tipo: ``number``

Retorna o nome da lotação e a sua sigla.

## ``/lotacao/pai``

#### Método: ``POST``
#### Variável: ``codigo_lotacao``
#### Tipo: ``number``

Retorna o código da lotação pai e o nome da lotação, bem como a sua sigla.

## ``/lotacao/subordinados``

#### Método: ``POST``
#### Variável: ``codigo_lotacao``
#### Tipo: ``number``

Retorna uma lista com todos os códigos, nomes e siglas de todas as lotações subordinadas.

## Pessoas
## Servidores
## Pensionistas
