import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//  const RECAPTCHA_SECRET_KEY = '6Lef2j0qAAAAAMjCAV21kZFs9acWXqzG4h94ywAM';
const RECAPTCHA_SECRET_KEY = '6LdB3T0qAAAAAOsTOqWQoYT2YPlMaNypfZJacPrp';

app.get('/', (req: Request, res: Response) => {
    res.render('index');
})

app.post('/submit', async (req: Request, res: Response) => {
    const token = req.body['g-recaptcha-response'];

    if (!token) {
        return res.status(400).json({ message: 'Token reCAPTCHA ausente' });
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
        );

        const data = response.data;

        console.log('data', data);

        if (data.success) {
            // Token válido, prossiga com o processamento do formulário
            res.status(200).json({ message: 'reCAPTCHA verificado com sucesso' });
        } else {
            // Token inválido
            res.status(400).json({ message: 'Falha na verificação do reCAPTCHA' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar o reCAPTCHA', error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
