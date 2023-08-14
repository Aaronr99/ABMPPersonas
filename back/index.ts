import { TiposCliente } from "./TiposCliente"

const express = require("express")
const app = express()

const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const fs = require("fs")
const rawList = fs.readFileSync("./clientes.json")
let clientList = JSON.parse(rawList)

const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.get("/", (req: any, res: any) => {
    return res.send(clientList)
})

app.get("/:id", (req: any, res: any) => {
    const client = clientList.find((x: any) => x.id.toString() === req.params.id)
    console.log()
    if (client !== undefined) {
        return res.send(client)
    }
    return res.send("No existe ese user")
})

app.post("/", (req: any, res: any) => {
    const id = Object.keys(clientList).length + 1
    let tipo: string = TiposCliente[TiposCliente.indefinido]
    switch (req.body.tipo) {
        case (TiposCliente[TiposCliente.cliente]):
            tipo = TiposCliente[TiposCliente.cliente]
            break;
        case (TiposCliente[TiposCliente.proveedor]):
            tipo = TiposCliente[TiposCliente.proveedor]
            break;
        case (TiposCliente[TiposCliente.empleado]):
            tipo = TiposCliente[TiposCliente.empleado]
            break;
        default:
            tipo = TiposCliente[TiposCliente.indefinido]
            return res.send("Tipo ingresado no valido")
    }

    let habilitado = false
    if (!(req.body.habilitado === "true" || req.body.habilitado === "false")) {
        return res.send("Valor ingresado para habilitado no valido (booleano)")
    }
    habilitado = (req.body.habilitado === "true")

    const client = {
        id: id,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        habilitado: habilitado,
        tipo: tipo,
    }
    clientList.push(client)
    fs.writeFileSync("./clientes.json", JSON.stringify(clientList))
    return res.send(client)
})

app.patch("/:id", (req: any, res: any) => {
    const index = clientList.findIndex((x: any) => x.id.toString() === req.params.id)
    console.log(clientList[index])
    console.log(req.body.nombre)
    if (index === -1) {
        return res.send("No existe ese user")
    }
    if (req.body.nombre !== undefined) {
        console.log("Cambiando nombre")
        clientList[index].nombre = req.body.nombre
    }
    if (req.body.apellido !== undefined) {
        console.log("Cambiando apellido")
        clientList[index].apellido = req.body.apellido
    }
    if (req.body.habilitado !== undefined) {
        console.log("Cambiando habilitado")
        clientList[index].habilitado = req.body.habilitado
    }
    if (req.body.tipo !== undefined) {
        console.log("Cambiando tipo")
        clientList[index].tipo = req.body.tipo
    }
    console.log(clientList)
    fs.writeFileSync("./clientes.json", JSON.stringify(clientList))
    return res.send(clientList[index])
})

app.delete("/:id", (req: any, res: any) => {
    const index = clientList.findIndex((x: any) => x.id.toString() === req.params.id)
    if (index > -1) {
        const clienteEliminado = clientList[index]
        clientList.splice(index, 1)
        console.log(clientList)
        fs.writeFileSync("./clientes.json", JSON.stringify(clientList))
        return res.send(clienteEliminado)
    }
    return res.send("No existe ese user")
})

app.listen(5000, () => {
    console.log("Server Started")
})
