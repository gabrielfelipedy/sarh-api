# API REST endpoints Lotação

Aqui estão todo os endpoints relacionados às lotações internas da Justiça Federal do Amapá.

## Obter informações de uma lotação

<div style="display: flex;">

<div style="flex: 1; padding: 10px;">
Obtém todas as informações relevantes sobre uma lotação, como a sua lotação pai e descrição breve da lotação

### Endpoint:

`POST` `/lotacao`

### Body parameters:

`codigo_lotacao` 

<span style="color:grey; padding: 0 10px;">number</span> <span style="color:orange; padding: 0 10px;">obrigatório</span>

</div>

<div style="flex: 1; padding: 10px;">

### Exemplo de requisição:


<span style="background-color:rgb(38, 87, 248); color: white; padding: 5px 10px; border-radius: 30px;">POST</span> 

`/lotacao`


```nginx
curl -X POST -d "codigo_lotacao=348" http://{ip}/lotacao
``` 

### Exemplo de resposta:

```json
{
    "codigo_lotacao": 348,
    "descrição_lotacao": "NÚCLEO DE TECNOLOGIA DA INFORMAÇÃO"
}
```

</div>

</div>



## `/lotacao/pai`

#### Método: `POST`

#### Variável: `codigo_lotacao`

#### Tipo: `number`

Retorna o código da lotação pai e o nome da lotação, bem como a sua sigla.

## `/lotacao/subordinados`

#### Método: `POST`

#### Variável: `codigo_lotacao`

#### Tipo: `number`

Retorna uma lista com todos os códigos, nomes e siglas de todas as lotações subordinadas.

## Pessoas

Informações sobre todas as pessoas vinculadas à justiça, sendo servidores efetivos ou não

## `/pessoas`

#### Método: `GET`

Retorna uma lista com todos os nomes, cpfs, matrícula, cargo e subseções de todas as pessoas vinculadas à JFAP.

## `/pessoas/ativas`

#### Método: `GET`

Retorna uma lista com todas matrículas, nomes, cpfs e código de atividade segundo a seguinte legenda:

| Código | Significado |
| ------ | ----------- |
| 1      | Ativo       |

## Servidores

## Pensionistas

Retorna informações sobre pensionistas

## `/pensionistas`

#### Método: `GET`

Retorna uma lista com todos os nomes de pensionistas da JFAP.

## `/pensionistas`

#### Método: `GET`

Retorna uma lista com todos os nomes de pensionistas da JFAP.

## `/pensionistas`

#### Método: `POST`

#### Variável: `PCIV_DEPE_COD_FUNCIONARIO`

#### Tipo: `number`

Retorna informações detalhadas sobre um pensionista específico
