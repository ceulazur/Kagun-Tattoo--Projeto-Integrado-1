import bcrypt from 'bcrypt';
import tatuadores from '../models/tatuadores.js';

async function cadastrarTatuador(req, res){
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha)
        return res.status(400).json({ mensagem: 'Preencha todos os campos obrigatórios.' });

    const emailExiste = tatuadores.find(tatuador => tatuador.email === email);

    if(emailExiste)
        return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    tatuadores.push({ nome, email, senha: senhaCriptografada });
    res.status(201).json({ mensagem: 'Tatuador cadastrado com sucesso.' });
}

export {
    cadastrarTatuador
};
