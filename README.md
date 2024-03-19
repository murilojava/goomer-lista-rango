# Desafio de programação da Goomer

Projeto criado com o intuito de responder ao desafio técnico da Goomer onde será necessário cumprir alguns requisitos especificos.

Serão listados aqui os requisitos necessários e os que foram cumpridos.

A proposta é que a cada parte feita do projeto seja acompanhada de um commit do projeto.

E na seção abaixo será descrito como executar o código. 
E quais bibliotecas foram utilizadas no auxílio da construção do código.



## Requisitos

- [X] Definir estrutura base do projeto
- [X] Definir modelo do banco de dados
- [X] Implementar modelos do banco de dados e seus serviços
- [X] Implementar controllers da aplicação
- [X] Implementar rotas de acesso
- [ ] Validar funcionamento da aplicação
- [ ] Configurar docker-compose para subir o banco

## Desafios

- Na definição do modelos de dados tive um desafio para decidir como salvar a imagem. Inicialmente pensei no padrão que seria utilizar um storage externo porém seria uma solução um pouco complexa para o problema em questão. Optei por criar uma entidade Imagem e salvar os dados da imagem nessa entidade pois aí não me preocupo da aplicação ser iniciada em outro servidor. Aliado a isso penso em colocar uma rota para imagens na aplicação onde ira verificar se o imagem está em um arquivo temporário para não necessitar carregar do banco de dados a todo momento.

- Precisei mudar a inicialização do Datasource pois ele estava sendo carregado antes da inicialização das variaveis de ambiente.

- O uso do sql fez com que demorasse mais do que o previsto porque precisei fazer o que o a lib já faria para mim de fazer o link entre as entidades. E também carregar os dados de id inserido. Mas foi bom para relembrar 😃



## Pensamentos
- Optei por criar uma entidade Imagem pois consigo separa o upload da imagem da criação da entidades. E posso utilizar esse mesmo upload tanto para produtos como empresas. Outro detalhe é que eu consigo deixar isolado os tratamentos que faço na imagem. Um deles seria criar uma miniatura para agilizar no carregamento do frontend.

- Optei por criar uma entidade Categoria pois é possivel listar todas as categorias do restaurante de forma simplificada e trazer os produtos de cada categoria.


## Tecnologias

O projeto utiliza Typescript que é um camada em cima do javacript para permitir a tipagem de alguns elementos. Eu gosto pois facilita algumas inferências e torna mais fácil de dar manutênção. Tem uma desvantagem que o código precisa ser transpilado para javascript porém é um processo relativamente rápido.

O projeto utiliza o express[] como framework de requisições http. É um framework bastante conhecido e de fácil utilização.

Para a conexão com o banco de dados utilizo o typeorm[] que é um biblioteca de mapeamento objeto relacional. Ela tem como objetivo além de estabelcer a conexão montar e relacionar as tabelas as entidades da aplicação. No projeto não utilizei as as estruturas da biblioteca para fazer os comando sql.

O banco de dados utilizado na aplicação é o Mysql é necessário ter ele instalado na maquina para poder rodar a aplicação. (Acredito que vou fazer um docker-compose para levantar a aplicação via docker)


## Como executar \[Em desenvolvimento\]

Após o clone do projeto

Para executar-lo localmente se faz necessário executar o seguinte commando

`npm install`

Esse comando irá baixar todas as dependências do projeto para o computador local e tornará apto a ser executado.

Após isso se faz necessário configurar as variáveis de ambiente.
Para isto basta fazer uma copia do arquivo `.env.example`para `.env`e no arquivo criado configurar os dados necessários para a execução

`PORT` é a porta de execução da aplicação

`DB_HOST` endereço do banco de dados

`DB_PORT` a porta do banco de dados

`DB_USER`= o usuário de acesso ao banco de dados

`DB_PASS`= a senha de acesso ao banco de dados

`DB_NAME`= nome do banco de dados (precisa estar criado)

`DB_SYNC`= parametro que faz sincronização do banco de dados com as entidade de da aplicação (`true` para ativar e `false` para iniativar)


Após a configuração a API já pode ser executada, localmente pode ser utilizado o comando:

`npm run dev`


Para rodar em produção é necessário fazer o build:

`npm run build`

E iniciar a aplicação com:

`npm run start`

## Rotas

A aplicação possui as seguintes rotas

### Health

``` GET /health ```

Será retornado o se aplicação está sendo executada e se o banco de dados está conectado.


### Imagem

``` POST /imagem ```

content-type: 'multipart/form-data'

[
  imagem: file
]

Caso seja retornado sucesso será retornado o seguinte formato:

```
{
	"key": "9ce177340e9f9863a5f65effacd85d45.jpg",
	"id": 1
}
```

O `id` será utilizado para preencher o campo foto dos registros que exigem foto

O `key` será utilizado para poder visualizar a imagem


``` GET /imagem/{key} ```

Será retornado a imagem associada a key, poderá ser utilizado em um `src` de uma tag de img por exemplo.


### Empresa



``` POST /empresa ```

content-type: 'application/json'
```
{
  "nome": "Nome da empresa",
  "rua": "Rua de exemplo",
  "numero": "10",
  "bairro": "Bairro de teste",
  "cidade": "Cidade Exemplo",

  "foto" : { id:1 },

  horariosFuncionamento: [
    {
      diaSemana: 1,
      inicio:"11:00",
      fim: "15:00"
    },
    {
      diaSemana: 2,
      inicio:"11:00",
      fim: "15:00"
    },
    {
      diaSemana: 3,
      inicio:"18:00",
      fim: "23:00"
    }
  ]
}
```

Caso seja retornado sucesso será retornado o seguinte formato:

```
{
	"id": 1 // id gerado
  // dados informados na request
}
```

``` GET /empresa ```

Serão retornadas todas as empresas cadastradas em formato de lista

```
[
   {
    "id": 1,
    "nome": "nome da empresa",
    "rua": "rua",
    "numero": "numero",
    "bairro": "nome do bairro",
    "cidade": "nome da cidade",
    "foto": {
      "id": 1,
      "key": "algumacoisa.png"
    }
   },
  {
    "id": 2,
    "nome": "nome da empresa 2",
    "rua": "rua",
    "numero": "numero",
    "bairro": "nome do bairro",
    "cidade": "nome da cidade",
    "foto": {
      "id": 2,
      "key": "algumacoisa.png"
    }
  }
]
```



``` GET /empresa/{id} ```

Caso seja encontra uma empresa para o id informado será retornado os dados no seguinte formato

```
 {
    "id": 1,
    "nome": "nome da empresa",
    "rua": "rua",
    "numero": "numero",
    "bairro": "nome do bairro",
    "cidade": "nome da cidade",
    "foto": {
      "id": 1,
      "key": "algumacoisa.png"
    },
    "horariosFuncionamento": [
      {
        "diaSemana": 1,
        "inicio":"11:00",
        "fim": "15:00"
      },
      {
        "diaSemana": 2,
        "inicio":"11:00",
        "fim": "15:00"
      },
      {
        "diaSemana": 3,
        "inicio":"18:00",
        "fim": "23:00"
      }
    ]
  }
```



``` PATCH /empresa/{id} ```

Caso seja encontra uma empresa para o id informado será atualizado com o body passado


content-type: 'application/json'
```
{
  "nome": "Nome da empresa",
  "rua": "Rua de exemplo",
  "numero": "10",
  "bairro": "Bairro de teste",
  "cidade": "Cidade Exemplo",

  "foto" : { "id":1 },

  "horariosFuncionamento": [
    {
      "diaSemana": 1,
      "inicio":"11:00",
      "fim": "15:00"
    },
    {
      "diaSemana": 2,
      "inicio":"11:00",
      "fim": "15:00"
    },
    {
      "diaSemana": 3,
      "inicio":"18:00",
      "fim": "23:00"
    }
  ]
}
```



``` DELETE /empresa/{id} ```

Caso seja encontra uma empresa para o id informado será exlcuída do banco de dados.
Serão excluido também suas categorias e produtos associados.


O retorno esperado é:

```
  {
    mensagem: "Empresa removida com sucesso!"
  }
```



### Categoria



``` POST /categoria/{empresaId} ```

content-type: 'application/json'
```
{
  "nome": "Nome da empresa"
}
```

Caso seja retornado sucesso será retornado o seguinte formato:

```
{
	"id": 1 // id gerado
  // dados informados na request
}
```

``` GET /categoria/{empresaId} ```

Serão retornadas todas as categorias cadastradas em formato de lista

```
[
   {
    "id": 1,
    "nome": "nome da categoria"   
   },
  {
    "id": 2,
    "nome": "nome da categoria 2"
  }
]
```


``` GET /categoria/{empresaId}/{id} ```

Caso seja encontra uma categoria para o id informado será retornado os dados no seguinte formato

```
 {
    "id": 1,
    "nome": "nome da empresa"    
 }
```



``` PATCH /categoria/{empresaId}/{id} ```

Caso seja encontra uma categoria para o id informado será atualizado com o body passado


content-type: 'application/json'
```
{
  "nome": "Nome da categoria",
}
```



``` DELETE /categoria/{empresaId}/{id} ```

Serão excluido também suas categorias e produtos associados.

O retorno esperado é:

```
  {
    "mensagem": "Categoria removida com sucesso!"
  }
```




### Produto



``` POST /produto/{empresaId} ```

content-type: 'application/json'
```
{
  "nome": "Nome do produto"
  "foto": { id: 1},
  "categoria": {id:1},
  "preco": 34.60,
  "emPromocao": false,
  "precoPromocional": 29.90,
  "descricaoPromocional": "Aproveite nossa maravilhosa promoção";
  "horariosPromocionais": [
    {
      "diaSemana": 1,
      "inicio":"13:00",
      "fim": "13:30"
    }
  ]
}
```

Caso seja retornado sucesso será retornado o seguinte formato:

```
{
	"id": 1 // id gerado
  // dados informados na request
}
```

``` GET /produto/{empresaId} ```

Serão retornadas todas os produtos cadastradas em formato de lista

```
[
  {
    "id": 1,
    "nome": "Nome do produto"
    "foto": { id: 1},
    "categoria": {id:1},
    "preco": 34.60,
    "emPromocao": false,
    "precoPromocional": 29.90,
    "descricaoPromocional": "Aproveite nossa maravilhosa promoção";
  },
  {
    "id": 2,
    "nome": "Nome do produto 2"
    "foto": { "id": 2, "key": "alguma.jpg"},
    "categoria": {"id":1, "nome": "Bebidas"},
    "preco": 34.60,
    "emPromocao": true,
    "precoPromocional": 29.90,
    "descricaoPromocional": "Aproveite nossa maravilhosa promoção";  
  }
]
```


``` GET /produto/{empresaId}/{id} ```

Caso seja encontra um produto para o id informado será retornado os dados no seguinte formato

```
{
  "id": 1,
  "nome": "Nome do produto"
  "foto": { id: 1},
  "categoria": {id:1},
  "preco": 34.60,
  "emPromocao": false,
  "precoPromocional": 29.90,
  "descricaoPromocional": "Aproveite nossa maravilhosa promoção";
  "horariosPromocionais": [
    {
      "diaSemana": 1,
      "inicio":"13:00",
      "fim": "13:30"
    }
  ]
}
```



``` PATCH /produto/{empresaId}/{id} ```

Caso seja encontra um produto para o id informado será atualizado com o body passado


content-type: 'application/json'
```
{
  "nome": "Nome da produto",
  "foto": { id: 1},
  "categoria": {id: 1},
  "preco": 34.60,
  "emPromocao": false,
  "precoPromocional": 29.90,
  "descricaoPromocional": "Aproveite nossa maravilhosa promoção";
  "horariosPromocionais": [
    {
      "diaSemana": 1,
      "inicio":"13:00",
      "fim": "13:30"
    }
  ]
}
```



``` DELETE /produto/{empresaId}/{id} ```

Caso seja encontrado um produto para o id informado será excluído do banco de dados.

O retorno esperado é:

```
  {
    mensagem: "Produto removido com sucesso!"
  }
```
