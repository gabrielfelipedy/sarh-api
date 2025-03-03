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

Informações sobre todas as pessoas vinculadas à justiça, sendo servidores efetivos ou não

## ``/pessoas``

#### Método: ``GET``

Retorna uma lista com todos os nomes, cpfs, matrícula, cargo e subseções de todas as pessoas vinculadas à JFAP.

## ``/pessoas/ativas``

#### Método: ``GET``

Retorna uma lista com todas matrículas, nomes, cpfs e código de atividade segundo a seguinte legenda:

| Código | Significado |
| -------|-------------|
| 1      | Ativo       |

## Servidores
## Pensionistas

Retorna informações sobre pensionistas

## ``/pensionistas``

#### Método: ``GET``

Retorna uma lista com todos os nomes de pensionistas da JFAP.


## ``/pensionistas``

#### Método: ``GET``

Retorna uma lista com todos os nomes de pensionistas da JFAP.

## ``/pensionistas``

#### Método: ``POST``
#### Variável: ``PCIV_DEPE_COD_FUNCIONARIO``
#### Tipo: ``number``

Retorna informações detalhadas sobre um pensionista específico