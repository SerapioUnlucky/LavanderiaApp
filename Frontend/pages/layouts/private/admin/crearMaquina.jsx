import React, {useEffect} from 'react'
import Header from './header';
import {useForm} from '../../../../hooks/useForm';
import Swal from 'sweetalert2';

const CrearMaquina = () => {

    useEffect(() => {

        auth();

    }, []);

    const auth = () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if(!tokenAdmin && !admin){

            Router.push('../../../');

        }

    }

    const {form, changed} = useForm({});

    const registrarMaquina = async(e) => {

        e.preventDefault();

        if(form.tipo === 'Seleccione el tipo'){

            Swal.fire(
                'Error',
                'Debe completar todos los campos',
                'error'
            )

            return false;

        }

        const request = await fetch(process.env.SERVIDOR + 'maquina/crear_maquina', {

            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('tokenAdmin')
            }

        });

        const data = await request.json();

        if(data.message === "Token inválido"){

            Router.push('./logout');

        }

        if(data.message === "Token expirado"){

            Router.push('./logout');
            
        }

        if(data.message === "Faltan datos por enviar"){

            Swal.fire(
                'Error',
                'Debe completar todos los campos',
                'error'
            )

        }

        if(data.message === "Ya existe una máquina con el serial ingresado"){

            Swal.fire(
                'Error',
                'Ya existe una máquina con el serial ingresado',
                'error'
            )

        }

        if(data.message === "Hubo un error al guardar la máquina"){

            Swal.fire(
                'Error',
                'Hubo un error al guardar la máquina',
                'error'
            )

        }

        if(data.message === "Se registró correctamente la nueva máquina"){

            Swal.fire(
                'Listo',
                'Se registró correctamente la nueva máquina',
                'success'
            )

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-crearMaquina">
                
                <h1>Registrar nueva máquina</h1>

                <form className="formulario-crearMaquina" onSubmit={registrarMaquina}>

                    <div>

                        <label>Tipo de máquina</label>
                        <br/>
                        <select name="tipo" onChange={changed}>
                            <option>Seleccione el tipo</option>
                            <option>Lavadora</option>
                            <option>Secadora</option>
                        </select>

                    </div>

                    <div>
                        <label>Ingrese serial de la máquina</label>
                        <br/>
                        <input type="text" name="serial" placeholder="Ej: asdf13gt" onChange={changed} />
                    </div>

                    <div>

                        <input type="submit" value="Registrar" />

                    </div>

                </form>

            </div>

        </>
    )
}

export default CrearMaquina
