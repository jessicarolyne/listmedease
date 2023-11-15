import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { format, utcToZonedTime } from 'date-fns-tz';
const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const getCurrentLocalDateTime = () => {
  const serverDateTime = new Date();
  const localTimeZone = 'America/Sao_Paulo'; 
  const zonedDateTime = utcToZonedTime(serverDateTime, localTimeZone);
  const localDateTime = format(zonedDateTime, 'yyyy-MM-dd HH:mm:ss', { timeZone: localTimeZone });
  return new Date(localDateTime);
};

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
        pacientes: true, 
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
        Medicamento: {},
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

app.put('/atualizarHoraProximaDose/:medicamentoId', async (req, res) => {
  try {
    const { medicamentoId } = req.params;
    const parsedMedicamentoId = parseInt(medicamentoId);

    if (isNaN(parsedMedicamentoId)) {
      return res.status(400).json({ message: 'ID do medicamento inválido.' });
    }

    const medicamento = await prisma.medicamento.findUnique({
      where: { id: parsedMedicamentoId },
    });

    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento não encontrado.' });
    }

    const { hoursBetween } = medicamento;
    const novaHoraProximaDose = getCurrentLocalDateTime();
    novaHoraProximaDose.setHours(novaHoraProximaDose.getHours() + hoursBetween);
    const updatedMedicamento = await prisma.medicamento.update({
      where: { id: parsedMedicamentoId },
      data: {
        nextDue: novaHoraProximaDose,
      },
    });

    res.status(200).json(updatedMedicamento);
  } catch (error) {
    console.error('Erro ao atualizar a hora da próxima dose:', error);
    res.status(500).json({ message: 'Erro ao atualizar a hora da próxima dose.' });
  }
});

app.post('/novoMedicamento', async (req, res) => {
  try {
    const { name, hoursBetween, userId, pacienteId } = req.body;
    const novaHoraProximaDose = getCurrentLocalDateTime();
    novaHoraProximaDose.setHours(novaHoraProximaDose.getHours() + hoursBetween);
    const novoMedicamento = await prisma.medicamento.create({
      data: {
        name,
        hoursBetween,
        userId,
        pacienteId,
        nextDue: novaHoraProximaDose
      },
    });

    res.status(201).json(novoMedicamento);
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://192.168.0.112:3000');
});
