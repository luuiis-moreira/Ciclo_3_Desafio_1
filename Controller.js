const express = require("express");
const cors = require("cors");
const {Sequelize} = require("./models");
const models = require("./models");
const app = express();

app.use(cors());

app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get("/", function(req, res) {
    res.send("Luis Reinaldo - Ciclo : 3 / NodeJs!");
});

app.post("/servicos/add-novo-servico", async(req, res) => {
    await servico.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível se conectar."
        });
    });
});

app.get("/servicos", async(req, res) => {
    await servico.findAll({
        order: [["nome", "DESC"]]
    }).then(function(servicos) {
        res.json({
            servicos
        });
    });
});

app.get("/servicos/quantidade", async(req, res) => {
    await servico.count("id").then(function(servicos) {
        res.json({
            servicos
        });
    });
});


app.get("/servicos/:id", async(req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Não foi possível encontrar Serviço."
        });
    }

    await servico.findByPk(req.params.id).then(serv => {
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível se conectar."
        });
    });
});

app.put("/servicos/:id/atualizar-servico", async(req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Não foi possível encontrar Serviço."
        });
    }

    const serv = {
        nome: req.body.nome,
        descricao: req.body.descricao
    }

    await servico.update(serv, {
        where: {
            id: req.params.id
        }
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço atualizado com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível alterar o serviço."
        });
    });
});

app.put("/atualizar-servico", async(req, res) => {
    await servico.update(req.body, {
        where: {
            id: req.body.id
        }  
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço atualizado com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível alterar o serviço."
        });
    });
});

app.get("/servicos/:id/excluir-servico", async(req, res) => {
    if (!await servico.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Serviço não encontrado."
        });
    }

    await servico.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Serviço excluído com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não possível excluir o Serviço!"
        });
    });
});


app.post("/clientes/novo-cliente", async(req, res) => {
    await cliente.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Cliente cadastrado com sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível cadastrar o cliente."
        });
    });
});

app.get("/clientes/:id", async(req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Cliente não encontrado."
        });
    }

    await cliente.findByPk(req.params.id, {include: [{all: true}]})
    .then(clnt => {
        return res.json({
            error: false,
            clnt
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível se conectar"
        });
    });
});

app.get("/clientes", async(req, res) => {
    await cliente.findAll({
        order: [["clienteDesde", "ASC"]]
    }).then(function(clientes) {
        res.json({clientes});
    });
});

app.get("/clientes/quantidade", async(req, res) => {
    await cliente.count("id").then(function(clientes) {
        res.json({clientes});
    });
});

app.get("/clientes/:id/pedidos", async(req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Cliente não encontrado."
        });
    }

    await pedido.findAll({
        where: {ClienteId: req.params.id}
    }).then(function(peds) {
        return res.json({
            error: false,
            message: "Pedidos encontrados!",
            peds
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível encontrar os pedidos."
        });
    });
});

app.put("/clientes/:id/atualizar-cliente", async(req, res) => {
    if (!await cliente.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Cliente não encontrado."
        });
    }

    const clnt = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        uf: req.body.uf,
        nascimento: req.body.nascimento,
        clienteDesde: req.body.clienteDesde
    };

    await cliente.update(clnt, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Cliente atualizado com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível fazer atualização do cliente."
        });
    });
});

app.get("/clientes/:id/excluir-cliente", async(req, res) => {
    cliente.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Cliente excluído com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível fazer exclusão do cliente."
        });
    });
});

app.post("/pedidos/novo-pedido", async(req, res) => {
    await pedido.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Pedido realizado com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível realizar pedido."
        });
    });
});

app.get("/pedidos", async(req, res) => {
    await pedido.findAll({
        raw: true
    }).then(function(pedidos) {
        res.json({
            error: false,
            pedidos
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível se conectar."
        });
    });
});

app.get("/pedidos/quantidade", async(req, res) => {
    await pedido.count("id").then(function(pedidos) {
        res.json({
            pedidos
        });
    });
});

app.put("/pedidos/:id/atualizar-pedido", async(req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Pedido não encontrado."
        });
    }

    const ped = {
        data: req.body.data
    };

    await pedido.update(ped, {
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Pedido atualizado com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível fazer atualização do pedido."
        });
    });
});

app.get("/pedidos/:id/excluir-pedido", async(req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            erro: true,
            message: "Falha! Pedido não encontrado."
        });
    }

    await pedido.destroy({
        where: {id: req.params.id}
    }).then(function() {
        return res.json({
            error: false,
            message: "Pedido excluído com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível fazer a exclusão do pedido."
        });
    });
});

app.post("/itens/novo-item", async(req, res) => {
    await itempedido.create(
        req.body
    ).then(function() {
        return res.json({
            error: false,
            message: "Item adicionado ao pedido com Sucesso!"
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Falha! Não foi possível adicionar item no pedido."
        });
    });
});

app.get("/itens", async(req, res) => {
    await itempedido.findAll({
        order: [["valor", "ASC"]]
    }).then(function(itens) {
        res.json({
            error: false,
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json({
            error: true,
            message: "Não foi possível se conectar."
        });
    });
});

app.get("/pedidos/:id", async(req, res) => {
    await pedido.findByPk(req.params.id, {include:[{all: true}]}).then(ped => {
        return res.json({ped});
    });
});

app.put("/pedidos/:id/editar-item", async(req, res) => {
    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Falha! Pedido não foi encontrado."
        });
    }

    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: "Falha! Serviço não foi encontrado"
        });
    }

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId}, {PedidoId: req.params.id})
    }).then(function(itens) {
        return res.json( {
            error: false,
            message: "Pedido alterado com Sucesso!",
            itens
        });
    }).catch(function(erro) {
        return res.status(400).json( {
            error: true,
            message: "Falha! Não foi possível alterar."
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log("Servidor ativo: http://localhost:3001");
});