import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();
const router = Router();
const app = express();

app.use(express.json());

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email, password }
    });

    if (!user) {
      console.log( email, password )
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    res.status(200).json({ message: 'Login bem-sucedido', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao realizar o login' });
  }
});

app.get('/pacientes', async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não fornecido' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        pacientes: true, // Isso traz os pacientes associados a esse usuário
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user.pacientes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pacientes', error: error.message });
  }
});


app.get('/medicamentos/:idPaciente', async (req, res) => {
  const { idPaciente } = req.params;
  try {
    const paciente = await prisma.paciente.findUnique({
      where: { id: parseInt(idPaciente) },
      include: {
        Medicamento: {
          where: {
            nextDue: {
              gte: new Date(), 
              lt: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), 
            },
          },
        },
      },
    });
    if (paciente) {
      res.json(paciente.Medicamento);
    } else {
      res.status(404).json({ message: 'Paciente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar medicamentos do paciente', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://192.168.0.112:3000');
});
