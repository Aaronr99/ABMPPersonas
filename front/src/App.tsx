import { Alert, Button, Card, CardContent, Checkbox, Grid, List, ListItem, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Container, spacing } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

  const [clientes, setClientes] = useState([])

  const [idCliente, setID] = useState("")

  const [nombreCliente, setNombre] = useState("")
  const [apellidoCliente, setApellido] = useState("")
  const [clienteHabilitado, setHab] = useState(false)
  const [tipoCliente, setTipo] = useState("cliente")

  const [error, setError] = useState("")


  useEffect(() => {
    ActualizarClientes()
  }, [])


  function ActualizarClientes(): void {
    axios.get("http://localhost:5000/").then(res => setClientes(res.data))
  }

  function CheckHabilitado(): void {
    setHab(!clienteHabilitado)
  }

  function EliminarElemento(pId: string): void {
    axios.delete(`http://localhost:5000/${pId}`).then(res => {
      ActualizarClientes()
      console.log(res)
    })
  }

  function MostrarError() {
    if (error !== "") {
      return (
        <Alert variant="outlined" severity="error">
          {error}
        </Alert>)
    }
    else {
      return <Container></Container>
    }
  }

  function IntentarPost(): void {
    if (idCliente !== "") {
      ActualizarCliente();
      return;
    }

    if (nombreCliente === "" || apellidoCliente === "") {
      console.log("Bad Input")
      setError("Bad Input")
      return;
    }
    
    IngresarCliente();
  }

  function ActualizarCliente(): void {
    const formData = new FormData()

    if (nombreCliente !== "") {
      formData.append("nombre", nombreCliente)
    }
    if (apellidoCliente !== "") {
      formData.append("apellido", apellidoCliente)
    }
    formData.append("habilitado", clienteHabilitado.toString())
    formData.append("tipo", tipoCliente)

    axios.patch(`http://localhost:5000/${idCliente}`, formData, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    }).then(res => {
      ActualizarClientes()
      console.log(res)
    })
  }

  function IngresarCliente(): void {
    axios.post("http://localhost:5000/", {
      nombre: nombreCliente,
      apellido: apellidoCliente,
      habilitado: clienteHabilitado.toString(),
      tipo: tipoCliente
    }).then(res => {
      ActualizarClientes()
      console.log(res)
    })
  }

  return (
    <Container>
      <Typography variant="h1" component="h2">
        Gestion Clientes
      </Typography>
      <Typography variant="h4" component="h4">
        Clientes:
      </Typography>
      <Card>
        <CardContent>
          <List>
            {clientes.map((x: any) =>
              <Grid key={"grid1" + x.nombre + x.id} container sx={{ border: "1px solid black" }}>
                <Grid item xs={11} key={"grid2" + x.nombre + + x.id}>
                  <ListItem key={"item" + x.nombre + x.id}>
                    {`${x.nombre} ${x.apellido} | Habilitado: ${x.habilitado} | Tipo: ${x.tipo} | ID: ${x.id}`}
                  </ListItem>
                </Grid>
                <Grid item xs={1} key={"grid3" + x.nombre + x.id}>
                  <Button key={"delButton" + x.nombre + x.id} variant="contained" onClick={() => EliminarElemento(x.id)}>Eliminar</Button>
                </Grid>
              </Grid>
            )}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h5" component="h5">
            Input Cliente:
          </Typography>
          <TextField value={idCliente} id="text0" label="ID" variant="outlined" sx={{ display: 'block', m: 1, p: 1 }} onChange={(x: any) => setID(x.target.value)} />
          <TextField value={nombreCliente} id="text1" label="Nombre" variant="outlined" sx={{ display: 'block', m: 1, p: 1 }} onChange={(x: any) => setNombre(x.target.value)} />
          <TextField value={apellidoCliente} id="text2" label="Apellido" variant="outlined" sx={{ display: 'block', m: 1, p: 1 }} onChange={(x: any) => setApellido(x.target.value)} />
          <Typography variant="body1" sx={{ m: 1, p: 1 }}> Habilitado:  </Typography>
          <Checkbox value={clienteHabilitado} sx={{ display: 'block', m: 1, p: 1 }} onChange={() => CheckHabilitado()} />
          <Select
            labelId="select-label"
            id="select-tipo"
            label="TipoCliente"
            onChange={(x: any) => setTipo(x.target.value)}
            defaultValue={"cliente"}
            sx={{ display: 'block', m: 1, p: 1 }}
          >
            <MenuItem value={"cliente"}>cliente</MenuItem>
            <MenuItem value={"proveedor"}>proveedor</MenuItem>
            <MenuItem value={"empleado"}>empleado</MenuItem>
          </Select>
          <Button sx={{ m: 1, p: 1 }} variant="contained" onClick={() => IntentarPost()}>Input</Button>
        </CardContent>
      </Card>
      <Container>
        {
          MostrarError()
        }
      </Container>
    </Container>
  );
}

export default App;
