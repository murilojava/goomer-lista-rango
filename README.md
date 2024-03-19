# Desafio de programação da Goomer

Projeto criado com o intuito de responder ao desafio técnico da Goomer onde será necessário cumprir alguns requisitos especificos.

Serão listados aqui os requisitos necessários e os que foram cumpridos.

A proposta é que a cada parte feita do projeto seja acompanhada de um commit do projeto.

E na seção abaixo será descrito como executar o código. 
E quais bibliotecas foram utilizadas no auxílio da construção do código.



## Requisitos

- [X] Definir estrutura base do projeto
- [X] Definir modelo do banco de dados
- [ ] Implementar modelos do banco de dados e seus serviços
- [ ] Implementar controllers da aplicação
- [ ] Implementar rotas de acesso
- [ ] Validar funcionamento da aplicação

## Desafios

- Na definição do modelos de dados tive um desafio para decidir como salvar a imagem. Inicialmente pensei no padrão que seria utilizar um storage externo porém seria uma solução um pouco complexa para o problema em questão. Optei por criar uma entidade Imagem e salvar os dados da imagem nessa entidade pois aí não me preocupo da aplicação ser iniciada em outro servidor. Aliado a isso penso em colocar uma rota para imagens na aplicação onde ira verificar se o imagem está em um arquivo temporário para não necessitar carregar do banco de dados a todo momento.

## Pensamentos
- Optei por criar uma entidade Imagem pois consigo separa o upload da imagem da criação da entidades. E posso utilizar esse mesmo upload tanto para produtos como empresas. Outro detalhe é que eu consigo deixar isolado os tratamentos que faço na imagem. Um deles seria criar uma miniatura para agilizar no carregamento do frontend.

- Optei por criar uma entidade Categoria pois é possivel listar todas as categorias do restaurante de forma simplificada e trazer os produtos de cada categoria.


## Como executar \[Em desenvolvimento\]
