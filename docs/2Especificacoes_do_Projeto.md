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

### 4. Pedro – Pesquisador Social
- **Idade:** 35 anos  
- **Profissão:** Pesquisador social  
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
| **Carlos (Gerente de Supermercado)**           | Receber notificações sobre pedidos de doação e acompanhar o status.       | Melhorar a organização e garantir que os produtos sejam doados dentro do prazo.     |
| **Ana (Coordenadora de Cozinha Solidária)**    | Consultar e solicitar os produtos disponíveis na plataforma.              | Garantir o acesso a alimentos de qualidade para preparar refeições para os necessitados. |
| **Ana (Coordenadora de Cozinha Solidária)**    | Avaliar os alimentos recebidos e dar feedback sobre a qualidade das doações. | Melhorar a transparência e incentivar melhores doações por parte dos supermercados.  |
| **Mariana (Voluntária de Logística)**          | Receber notificações e agendar coletas de produtos doados.                | Melhorar a coordenação e a eficiência na distribuição dos alimentos.                |
| **Mariana (Voluntária de Logística)**          | Visualizar rotas otimizadas para coleta e entrega dos alimentos.          | Reduzir custos e tempo de transporte, garantindo mais eficiência na logística.       |
| **Pedro (Pesquisador)**                | Acessar relatórios e indicadores de impacto social.                       | Monitorar a eficácia do programa e embasar decisões estratégicas.                    |
| **Pedro (Pesquisador)**                | Compartilhar dados e resultados com investidores e parceiros.             | Aumentar o apoio ao projeto e captar mais recursos para sua expansão.               |
| **Letícia (Administradora da Plataforma)**     | Gerenciar usuários, produtos e transações por meio de um dashboard centralizado. | Assegurar a segurança, transparência e eficiência da operação da plataforma.          |
| **Letícia (Administradora da Plataforma)**     | Configurar permissões e acessos para diferentes tipos de usuários.        | Garantir que cada usuário tenha acesso apenas às funcionalidades necessárias.        |

---

## Requisitos

### Requisitos Funcionais

| ID     | Descrição do Requisito                                                                                     | Prioridade |
|--------|------------------------------------------------------------------------------------------------------------|------------|
| RF-001 | A aplicação deve permitir que supermercados cadastrem, atualizem e gerenciem os produtos excedentes.        | ALTA       |
| RF-002 | A aplicação deve permitir que cozinhas solidárias consultem os produtos disponíveis e façam solicitações.    | ALTA       |
| RF-003 | A aplicação deve enviar notificações em tempo real para os usuários sobre novas doações ou atualizações.     | MÉDIA      |
| RF-004 | A aplicação deve fornecer um dashboard administrativo para o monitoramento de transações e usuários.         | MÉDIA      |
| RF-005 | A aplicação deve permitir que usuários registrem-se e façam login com autenticação segura.                   | ALTA       |
| RF-006 | A aplicação deve permitir que supermercados filtrem os pedidos recebidos por status e data.                   | MÉDIA      |
| RF-007 | A aplicação deve permitir que as cozinhas solidárias avaliem e confirmem as doações recebidas.                | ALTA       |
| RF-008 | A aplicação deve gerar relatórios sobre as doações realizadas, quantidades de alimentos distribuídos e impacto social. | MÉDIA      |
| RF-009 | A aplicação deve permitir a integração com serviços de mapas para auxiliar na logística de entrega.           | MÉDIA      |
| RF-010 | A aplicação deve armazenar um histórico de transações realizadas para fins de auditoria.                      | ALTA       |
| RF-011 | A aplicação deve permitir que administradores bloqueiem ou excluam contas em caso de uso inadequado.          | MÉDIA      |
| RF-012 | A aplicação deve garantir que os dados dos usuários e transações estejam protegidos por criptografia.         | ALTA       |


### Requisitos Não Funcionais

| ID      | Descrição do Requisito                                                                                   | Prioridade |
|---------|----------------------------------------------------------------------------------------------------------|------------|
| RNF-001 | A aplicação deve ser responsiva e funcionar corretamente em dispositivos móveis, tablets e desktops.      | ALTA       |
| RNF-002 | A aplicação deve processar requisições dos usuários em no máximo **3 segundos**, garantindo uma experiência fluida. | MÉDIA      |
| RNF-003 | A aplicação deve garantir a segurança dos dados dos usuários, utilizando **criptografia de ponta a ponta** e seguindo boas práticas de segurança. | ALTA       |
| RNF-004 | A aplicação deve ser desenvolvida com foco em **escalabilidade**, permitindo um aumento no número de usuários sem comprometer o desempenho. | MÉDIA      |
| RNF-005 | A aplicação deve possuir **backup automático periódico** para evitar perda de dados em casos de falha do sistema. | ALTA       |
| RNF-006 | O sistema deve seguir os princípios de **acessibilidade**, garantindo que usuários com deficiência possam utilizá-lo sem barreiras. | MÉDIA      |
| RNF-007 | A aplicação deve permitir integração com **APIs externas**, como serviços de mapas e notificações. | MÉDIA      |
| RNF-008 | O sistema deve seguir boas práticas de **desenvolvimento sustentável**, otimizando consumo de recursos computacionais. | MÉDIA      |
| RNF-009 | A aplicação deve ser desenvolvida com foco em **usabilidade**, garantindo uma experiência intuitiva e agradável para os usuários. | ALTA       |


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


```mermaid
flowchart TD
    subgraph Plataforma
        direction TB
        
        UC1[📦 Cadastro e Gerenciamento de Produtos]
        UC2[🔍 Consulta e Solicitação de Produtos]
        UC3[🔔 Notificações em Tempo Real]
        UC4[⚙️ Gestão Administrativa]
    end

    Supermercados[🏬 Supermercados] --> UC1
    Cozinhas[🍽️ Cozinhas Solidárias] --> UC2
    Administradores[🛡️ Administradores] --> UC4

    UC3 -.-> Supermercados
    UC3 -.-> Cozinhas
    UC3 -.-> Administradores
``


