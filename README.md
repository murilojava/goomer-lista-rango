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
- [ ] Implementar controllers da aplicação
- [ ] Implementar rotas de acesso
- [ ] Validar funcionamento da aplicação

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

