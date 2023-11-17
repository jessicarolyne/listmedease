import express, { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createWriteStream } from 'fs';
import path, { extname, resolve } from 'path';
import { v4 as randomUUID } from 'uuid';
import multer from 'multer'
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
const prisma = new PrismaClient();
const app = express();
const app2 = fastify();

app.use(express.json());

// Configuração do Multer para lidar com upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, 'medicamento_' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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

/*app2.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})
app2.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    const fileId = randomUUID();
    const extension = extname(upload.filename);

    const fileName = fileId.concat(extension);

    const writeStream = createWriteStream(
      resolve(__dirname, 'uploads', fileName),
    );

    await pump(upload.file, writeStream);

    const fullUrl = `${request.protocol}://${request.hostname}`;
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString();

    return { fileUrl };
  } catch (error) {
    console.error('Erro ao processar o upload:', error);
    return reply.status(500).send({ error: 'Erro ao processar o upload' });
  }
});
*/

app.post('/novoMedicamento', async (req, res) => {
  try {
    const { name, hoursBetween, userId, pacienteId, photo, dosagem } = req.body;
    const novaHoraProximaDose = getCurrentLocalDateTime();
    novaHoraProximaDose.setHours(novaHoraProximaDose.getHours() + hoursBetween);
    const novoMedicamento = await prisma.medicamento.create({
      data: {
        name,
        hoursBetween,
        dosagem,
        userId,
        pacienteId,
        nextDue: novaHoraProximaDose,
        photo
      },
    });

    res.status(201).json(novoMedicamento);
  } catch (error) {
    console.error('Erro ao cadastrar medicamento:', error);
    res.status(500).json({ error: 'Erro ao cadastrar medicamento' });
  }
});

app.get('/medicamento/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const medicamento = await prisma.medicamento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!medicamento) {
      return res.status(404).json({ message: 'Medicamento não encontrado' });
    }

    return res.json(medicamento);
  } catch (error) {
    console.error('Erro ao buscar medicamento para edição:', error);
    return res.status(500).json({ message: 'Erro ao buscar medicamento para edição' });
  }
});
// Rota PUT para editar um medicamento
app.put('/medicamento/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, hoursBetween, dosagem, photo } = req.body;

  try {
    const medicamento = await prisma.medicamento.update({
      where: { id: parseInt(id) },
      data: {
        name,
        hoursBetween,
        dosagem,
        photo,
      },
    });

    return res.json({ message: 'Medicamento atualizado com sucesso', medicamento });
  } catch (error) {
    console.error('Erro ao atualizar o medicamento:', error);
    return res.status(500).json({ message: 'Erro ao atualizar o medicamento' });
  }
});


app.listen(3000, () => {
  console.log('Servidor rodando em http://192.168.0.112:3000');
});
