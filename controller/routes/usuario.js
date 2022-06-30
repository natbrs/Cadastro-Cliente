const clienteBD = require('../../model/repositories/clienteBD.js');
const seguranca = require('../../model/components/seguranca.js');

module.exports = function(app){

    app.get("/login", function(req, res){
        if(req.query.fail)
            res.render('usuario/Login', { 
            mensagemLogin:
        'Usuário e/ou senha incorretos!'});
    else
        res.render('usuario/Login', {mensagemLogin:null});
    })

    app.post('/login/executar', (req,res) => {
        if( req.body.nome === "Natan"
            && req.body.senha === "123456")
        res.render('/lista/usuario', {mensagem:'Cadastrado'});
    else
        res.render('/login/?fail=true');
    })

    app.get("/cadastro", function(req, res){
        if (req.query.fail)
            res.render('usuario/Cadastro', {mensagem:'Cadastro'});
        else
            res.render('usuario/Cadastro', {mensagem:null});
    })

    app.post('/cadastro/usuario/edit/salvar', (req, res) => {
        var usuario = {
            nome: req.body.nome,
            senha: req.body.senha,
            id: req.body.id};
        try{
            usuarioBanco.updateUsuario(usuario);
            res.render('usuario/Sucesso', {mensagem:'Alterado'});
    }catch (error){
        res.render('usuario/EditUsuario', { title:'Edição Cadastro',
        mensagem: 'Erro no cadastro!'});
    }
    });

    app.post('/cadastro/usuario/salvar', (req, res) =>{
        try{
            var usuario = { 
                nome: req.body.nome,
                senha: seguranca.ocultarsenha(req.body.senha)};
        }catch (erro){
            console.log(error);
            res.render('usuario/Cadastro', { title:'Cadastro',
            mensagem: 'Erro no Cadastro!' });
        }
    });

    app.get('/lista/usuario', function(req, res, next){
        try{
            const docs = await usuarioBanco.selectUsuario();
            res.render('usuario/Lista', {mensagem:'Lista de Usuários', docs});
        }catch (err){
            next(err);
        }
    });

    app.get('/delete/usuario/:id', function(req, res, next){
        try{
            var id = req.params.id;
            await usuarioBanco.deleteUsuario(id);
            const docs = await usuarioBanco.selectUsuario();
            res.render('usuario/Lista', {mensagem:'Usuário excluído com sucesso!', docs});
        }catch (err){
            next(err);
        }
    });

    app.get('/edit/usuario/:id', function(req, res, next){
        try{
            var id = req.params.id;
            const usuario = await usuarioBanco.getusuarioId(id);
            res.render('usuario/EditUsuario', { mensagem: '', usuario});
        } catch (err){
            next(err);
        }
    });
}