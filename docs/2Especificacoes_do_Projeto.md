# Especificações do Projeto

<span style="color:red">Pré-requisitos: [Documentação de Contexto](1Documentacao_de_Contexto.md)</span>

Este documento apresenta as especificações do projeto **Plataforma de Redistribuição de Produtos**, definindo a perspectiva do usuário e a ideia de solução para o problema do desperdício de alimentos e da insegurança alimentar. Aqui, são abordados os seguintes tópicos: Personas, Histórias de Usuários, Requisitos Funcionais e Não Funcionais, Restrições e o Diagrama de Casos de Uso. Para a elaboração deste documento, foram utilizadas técnicas como análise de stakeholders, Design Thinking e criação de personas.

---

## Personas

A seguir, são descritas cinco personas que representam os principais perfis de usuários da plataforma:

### 1. Carlos – Gerente de Supermercado
- **Idade:** 45 anos  
- **Profissão:** Gerente de supermercado  
- **Angústias:** Preocupação com o desperdício de alimentos e os custos associados à má gestão dos produtos excedentes.  
- **Frustrações:** Processos burocráticos e ineficiência na administração dos produtos que não são vendidos.  
- **Expectativas:** Uma solução simples e intuitiva para registrar e redirecionar os alimentos excedentes, otimizando os recursos do supermercado.  
- **Aparência:** Visual profissional, utilizando uniforme, que transmite seriedade e foco na gestão operacional.

### 2. Ana – Coordenadora de Cozinha Solidária
- **Idade:** 38 anos  
- **Profissão:** Coordenadora de cozinha solidária  
- **Angústias:** Dificuldade em obter alimentos de qualidade para preparar refeições para comunidades vulneráveis.  
- **Frustrações:** Falta de um canal direto e confiável para acessar doações e produtos excedentes.  
- **Expectativas:** Um sistema que facilite a consulta e solicitação de alimentos, com informações atualizadas sobre a disponibilidade dos produtos.  
- **Aparência:** Imagem acolhedora e acessível, com vestimenta casual, refletindo empatia e comprometimento social.

### 3. Mariana – Voluntária de Logística
- **Idade:** 29 anos  
- **Profissão:** Voluntária em projetos sociais  
- **Angústias:** Dificuldade na coordenação e eficiência da logística de distribuição dos alimentos doados.  
- **Frustrações:** Comunicação ineficiente entre os pontos de coleta e as cozinhas solidárias, causando atrasos e perdas.  
- **Expectativas:** Uma plataforma integrada que otimize a comunicação e o agendamento das coletas e entregas dos produtos.  
- **Aparência:** Jovem e dinâmica, com trajes práticos que demonstram agilidade e engajamento em ações sociais.

### 4. Pedro – Empreendedor Social
- **Idade:** 35 anos  
- **Profissão:** Empreendedor social  
- **Angústias:** O desperdício de recursos que poderiam ser revertidos em ações de impacto social.  
- **Frustrações:** Dificuldade em obter dados e métricas que comprovem a eficácia dos programas de doação.  
- **Expectativas:** Uma ferramenta que forneça relatórios e indicadores de impacto, auxiliando na tomada de decisões estratégicas.  
- **Aparência:** Visual moderno e informal, que reflete inovação e foco em resultados sociais.

### 5. Letícia – Administradora da Plataforma
- **Idade:** 32 anos  
- **Profissão:** Administradora de sistemas  
- **Angústias:** Desafios na gestão de um sistema com múltiplos usuários e transações, mantendo a segurança e performance.  
- **Frustrações:** Falta de ferramentas de monitoramento centralizado para controlar o fluxo de informações e operações na plataforma.  
- **Expectativas:** Um dashboard intuitivo que centralize a gestão de usuários, produtos e transações, garantindo transparência e eficiência.  
- **Aparência:** Imagem profissional e organizada, sempre com um laptop à mão, simbolizando controle e atenção aos detalhes.

---

## Histórias de Usuários

Com base nas personas identificadas, foram elaboradas as seguintes histórias de usuários:

| EU COMO... (Persona)                           | QUERO/PRECISO... (Funcionalidade)                                          | PARA... (Motivo/Valor)                                                               |
|------------------------------------------------|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| **Carlos (Gerente de Supermercado)**           | Cadastrar e gerenciar os produtos excedentes de forma rápida e intuitiva.  | Otimizar o aproveitamento dos alimentos e reduzir os desperdícios no supermercado.  |
| **Ana (Coordenadora de Cozinha Solidária)**    | Consultar e solicitar os produtos disponíveis na plataforma.              | Garantir o acesso a alimentos de qualidade para preparar refeições para os necessitados. |
| **Mariana (Voluntária de Logística)**          | Receber notificações e agendar coletas de produtos doados.                | Melhorar a coordenação e a eficiência na distribuição dos alimentos.                |
| **Pedro (Empreendedor Social)**                | Acessar relatórios e indicadores de impacto social.                       | Monitorar a eficácia do programa e embasar decisões estratégicas.                    |
| **Letícia (Administradora da Plataforma)**     | Gerenciar usuários, produtos e transações por meio de um dashboard centralizado. | Assegurar a segurança, transparência e eficiência da operação da plataforma.          |

---

## Requisitos

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                     | Prioridade |
|--------|------------------------------------------------------------------------------------------------------------|------------|
| RF-001 | A aplicação deve permitir que supermercados cadastrem, atualizem e gerenciem os produtos excedentes.        | ALTA       |
| RF-002 | A aplicação deve permitir que cozinhas solidárias consultem os produtos disponíveis e façam solicitações.    | ALTA       |
| RF-003 | A aplicação deve enviar notificações em tempo real para os usuários sobre novas doações ou atualizações.     | MÉDIA      |
| RF-004 | A aplicação deve fornecer um dashboard administrativo para o monitoramento de transações e usuários.         | MÉDIA      |

### Requisitos Não Funcionais

| ID      | Descrição do Requisito                                                                            | Prioridade |
|---------|---------------------------------------------------------------------------------------------------|------------|
| RNF-001 | A aplicação deve ser responsiva e funcionar corretamente em dispositivos móveis e desktops.       | ALTA       |
| RNF-002 | A aplicação deve processar requisições dos usuários em no máximo 3 segundos.                      | MÉDIA      |
| RNF-003 | A aplicação deve garantir a segurança dos dados dos usuários, utilizando criptografia e boas práticas. | ALTA       |
| RNF-004 | A aplicação deve ser desenvolvida com foco em escalabilidade e facilidade de manutenção.          | MÉDIA      |

---

## Restrições

| ID | Restrição                                                                                                   |
|----|-------------------------------------------------------------------------------------------------------------|
| 01 | O projeto deverá ser entregue até o final do semestre.                                                    |
| 02 | O backend deve ser desenvolvido utilizando C# com ASP.NET Core.                                           |
| 03 | O banco de dados utilizado será o SQLite, com a conexão apontando para a pasta `database` no backend.       |
| 04 | O sistema de autenticação inicial utilizará um esquema fake para testes, com posterior implementação real.   |

---

## Diagrama de Casos de Uso

O diagrama de casos de uso ilustra a interação entre os usuários e a plataforma, detalhando os principais processos do sistema. Alguns dos casos de uso a serem contemplados são:

- **Cadastro e Gerenciamento de Produtos:**  
  Supermercados registram, atualizam e removem informações sobre os produtos excedentes.

- **Consulta e Solicitação de Produtos:**  
  Cozinhas solidárias visualizam os produtos disponíveis e efetuam solicitações de doações.

- **Notificações em Tempo Real:**  
  O sistema envia alertas para os usuários sobre novas doações e atualizações nas solicitações.

- **Gestão Administrativa:**  
  Administradores monitoram transações, gerenciam usuários e acompanham a integridade dos dados por meio de um dashboard centralizado.

> Para a criação do diagrama de casos de uso, recomenda-se o uso de ferramentas como [Lucidchart](https://www.lucidchart.com/), [Diagrams.net](https://app.diagrams.net/) ou [Astah](https://astah.net/).

---
