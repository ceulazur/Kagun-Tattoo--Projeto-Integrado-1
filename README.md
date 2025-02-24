# Kagun-Tattoo--Projeto-Integrado-1
Este projeto visa desenvolver um software para o gerenciamento de estoque e agendamento para um estúdio de tatuagem. O sistema atenderá as necessidades de controle de estoque dos materiais, como produtos consumíveis, equipamentos e produtos de higiene, implementando processos de entrada, saída e monitoramento desses produtos. Além disso, ele oferecerá funcionalidades de agendamento, gerenciamento de clientes, e repositório de imagens separados por sessão, facilitando a organização dos compromissos do tatuador. Entre os recursos principais, estão relatórios de estoque e alertas de validade e baixa quantidade de produtos. O objetivo é centralizar esses processos para aprimorar o controle de insumos e agenda.

## STAKEHOLDERS
### Os principais stakeholder do projeto serão:
* Kagun Tattoo - Dona do estúdio;
* Jeferson Kenedy - Professor da disciplina;
* Paulyne Jucá - Professora de PDS (Projeto Detalhado de Software);
* Diana Braga - Professora de GP (Gerência de Projetos);
* Lívia Almada - Professora de FBD (Fundamento de Banco de Dados);
* Danyel Granzotti - Membro da equipe;
* Jhordanna Gonçalves - Membro da equipe;
* João Bevilaqua - Membro da equipe;
* Kendriks da Paixão - Membro da equipe;
* Larissa Saraiva- Membro da equipe;
* Clientes do Estúdio;
* Fornecedores de produtos para o estúdio de tatuagem.

## Tecnologias Utilizadas
* Backend: Node.js, Express
* Frontend: Electron
* Banco de Dados: PostgressSQL
* Controle de Versão: Git

## Estrutura do Projeto
* `/backend`: Código fonte do backend
* `/frontend`: Código fonte do frontend
* `/docs`: Documentação do projeto

## Como Executar
1. Clone o repositório.
2. Navegue até o diretório `backend` e instale as dependências com `npm install`.
3. Inicie o servidor backend com `npm start`.
4. Navegue até o diretório `frontend` e instale as dependências com `npm install`.
5. Inicie o servidor frontend com `npm start`.
6. Acesse o sistema através do navegador em `http://localhost:3000`.

## GitFlow do Projeto

Este projeto utiliza o **GitFlow** como metodologia de gerenciamento de branches e colaboração no desenvolvimento. Seguem as diretrizes para contribuir com o repositório:

## Padrões de contribuição

Se certifique de que você está na versão mais recente da branch *develop* do repositório.

```text
git pull origin develop
```


Faça o checkout da branch de desenvolvimento usando o comando git

```text
git checkout develop
```

Crie uma nova branch para a sua tarefa com o comando

```text
git checkout -b nome-da-branch
```


Onde "nome-da-branch" deve seguir o padrão "[tipo de task] - [descrição-curta]".

| tipo de task        | palavra-chave |
| ------------------- | :-----------: |
| nova funcionalidade |    feature    |
| correção de bugs    |      fix      |
| refatoração         |     refac     |

Exemplo:
```text
git checkout -b feature-login
```


Faça as alterações no código necessárias para completar a task e faça commits com mensagens descritivas e claras.

| tipo de commit   | palavra-chave |
| ---------------- | :-----------: |
| commit inicial   |     init      |
| documentação     |   docs        |
| novo recurso     |     feature    |
| teste            |     test      |
| correção de bugs |      fix      |
| refatoração      |     refac     |

Exemplo:
```text
git commit -m "feat: implementar login"
```


Preferencialmente cada branch deve conter apenas um commit com todas as alterações necessárias para completar a task. Caso seja necessário fazer mais de um commit, faça commits atômicos, ou seja, cada commit deve conter alterações que façam sentido por si só.

## Terminei de implementar a task. E agora?

Quando a task estiver completa e testada, faça um push da sua branch para o repositório remoto.

```text
git push origin nome-da-branch
```


Faça o rebase da sua branch com a branch *develop* para garantir que ela está atualizada com as últimas alterações feitas na branch *develop*.

```text
git fetch --all
git rebase origin/develop
```


Resolva os conflitos que possam surgir durante o rebase. Se você não souber como resolver os conflitos, peça ajuda a um membro da equipe.

Faça um push da sua branch atualizada para o repositório remoto.

```text
git push origin nome-da-branch -f
```


Abra um merge request (MR) da branch criada para a branch *develop*. Para isso entre no repositório do github e navegue até o menu e *Pull Requests* e clique em *New Pull Request*.
  
Preencha o título e a descrição do PR com informações claras e objetivas sobre a task.
  
Adicione os membros que devem revisar o código como *Reviewers*.
  
Avise os membros da equipe que você abriu um PR para que eles possam revisar o código.
  
Aguarde a aprovação e, se necessário, faça as alterações sugeridas.
---

### Lembre-se de seguir essas práticas cada vez que trabalhar em uma nova task. Isso ajudará a manter o código organizado e fácil de entender, além de facilitar a revisão e aprovação de código pelos membros da equipe. Se você tiver alguma dúvida, não hesite em perguntar aos seus colegas de equipe
