<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-lBk1E0enM6jsnENk9P1qU7nOsnz2PlzoSqC+tlP2V0lRXYQ8lSHssK7ICVUmIT+cLkAgVkfiY4/So6PTV5zBkQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />

# List Medease

Desnevolvimento de um aplicativo com o propósito de tornar mais simples a organização de informações e a prestação de serviços dos cuidadores aos pacientes.
O aplicativo deverá permitir:
- O cadastro de uma lista de medicamentos com fotos e dosagens dos medicamentos que serão administrados ao paciente conforme a prescrição médica; <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Green_check.svg/1200px-Green_check.svg.png" alt="Certo" width="16" height="16">
- Gerenciamento e administração dos medicamentos no tempo correto, exibindo notificações referente ao medicamento a ser tomado e o horário; <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Green_check.svg/1200px-Green_check.svg.png" alt="Certo" width="16" height="16">
- Fazer a leitura dos batimentos cardiacos e saturação do sangue utilizando um smartwatch mi band como dispositivo de inserção de dados;
- Exibir gráficos com os dados coletados pelo dispositivo de inserção de dados 

## Índice

- [Instalação](#instalação)
- [Uso](#uso)
- [Imagens](#imagens)
- [Créditos](#créditos)
- [Contato](#contato)

## Instalação

Após baixar o projeto, acessar a pasta server e no terminal rodar o comando:
npm install

Para acessar o Prisma Studio:
npx prisma studio

## Uso

Na pasta server, no arquivo server.ts alterar o IP onde o servidor está rodando, para o seu IP na sua rede.

Abrir a pastar server e rodar o comando: 
npx tsx server.ts

Após isso o servidor estará rodando.

Na pasta mobile, rodar o comando:
npx expo start

Fazer a leitura do QRCode no aplicativo Expo Go do seu celular e aguardar a inicialização do aplicativo.

Após isso o aplicativo já poderá ser utilizado.

## Imagens

Telas desenvolvidas até o momento:
![alt text](login.jpeg)
*Tela de Login do aplicativo*
![alt text](lista.jpeg) 
*Lista de pacientes do cuidador logado*
![alt text](cadastrado.jpeg) 
*Lista de medicamentos que o paciente toma, separados por horário*
![alt text](editar.jpeg) 
*Tela para editar os medicamentos já cadastrados no aplcativo*
![alt text](cadastrar.jpeg) 
*Tela para cadastro de um novo medicamento*

## Créditos

Grupo de Projeto Integrador 5 e 6 do curso de Engenharia da Computação na Univesp.

## Contato

Informações de contato para perguntas, problemas ou feedback.
[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?&style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/_jessicarolyne/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jessicarolyne/)

