import React, { useState, useEffect } from 'react';
import Header from './header';
import { useForm } from '../../../../hooks/useForm';
import Swal from 'sweetalert2';
import Router from 'next/router';

const CrearMantencion = () => {

    useEffect(() => {

        conseguirMaquinas();

    }, []);

    const [maquinas, setMaquinas] = useState([]);
    const { form, changed } = useForm({});
    const [resultado, setResultado] = useState([]);

    const conseguirMaquinas = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'maquina/obtener_todos', {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenAdmin
                }

            });

            const data = await request.json();

            if(data.message === "Token inválido"){

                Router.push('./logout');

            }

            if(data.message === "Token expirado"){

                Router.push('./logout');
                
            }
        
            setMaquinas(data.maquinas);
            setResultado(data.message);

        }

    }

    const crearMantencion = async (e) => {

        e.preventDefault();

        if (form.maquinaid === 'Seleccione una máquina') {

            Swal.fire(
                'Error',
                'Debe completar todos los campos',
                'error'
            )

            return false;

        }

        const request = await fetch(process.env.SERVIDOR + 'mantencion/crear', {

            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            },

        });

        const data = await request.json();

        if(data.message === "Faltan datos"){

            Swal.fire(
                'Error',
                'Debe completar todos los campos',
                'error',
            )

        }

        if(data.message === "La fecha de inicio no puede ser menor a la actual"){

            Swal.fire(
                'Error',
                'La fecha de inicio no puede ser menor a la actual',
                'error',
            )

        }

        if(data.message === "La fecha final no puede ser menor a la fecha de inicio"){

            Swal.fire(
                'Error',
                'La fecha final no puede ser menor a la fecha de inicio',
                'error',
            )

        }

        if(data.message === "No se pudo crear la mantencion"){

            Swal.fire(
                'Error',
                'No se pudo crear la mantención',
                'error',
            )


        }

        if(data.message === "hora reservada correctamente"){

            Swal.fire(
                'Listo',
                'Mantención creada correctamente',
                'success',
            )

            setTimeout(() => {

                location.reload();

            }, 2000);

        }

    }

    const notificar = async (e) => {

        e.preventDefault();

        const espacios = /^\s+$/;

        if(espacios.test(form.message)){

            Swal.fire(
                'Error',
                'Por favor ingrese un mensaje a notificar',
                'error',
            )

            return false;

        }

        const request = await fetch(process.env.SERVIDOR + 'mantencion', {

            method: 'POST',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            },

        });

        const data = await request.json();

        if(data.status === "success"){

            Swal.fire(

                'Listo',
                'Notificación enviada correctamente',
                'success'

            )
            
            setTimeout(() => {

                location.reload();

            }, 2000);

        }

        if(data.message === "Por favor ingrese un mensaje a notificar"){

            Swal.fire(
                'Error',
                'Por favor ingrese un mensaje a notificar',
                'error',
            )

        }

        if(data.message === "La cantidad de caracteres no es válida"){

            Swal.fire(
                'Error',
                'La cantidad de caracteres no es válida',
                'error',
            )

        }

        if(data.message === "Error al enviar el correo"){

            Swal.fire(
                'Error',
                'Error al enviar la notificación',
                'error',
            )

        }

    }

    return (
        <>

            <Header />

            <div className="contenedor-crearMantencion">

                <form className="formulario-mantencion" onSubmit={crearMantencion}>

                <h1>Crear mantención</h1>

                    <div>

                        <label>Máquina</label>
                        <br />

                        {resultado === "No hay maquinas registradas" && <p>No hay máquinas registradas</p>}
                        {resultado === "Hubo un error al conseguir las máquinas" && <p>No hay máquinas registradas</p>}

                        <select name="maquinaid" onChange={changed}>
                            <option>Seleccione una máquina</option>
                            {
                                maquinas.map((maquina, index) => (
                                    <option key={index} value={maquina._id}>{maquina.tipo} - {maquina.serial}</option>
                                ))
                            }
                        </select>

                    </div>

                    <div>

                        <label>Fecha de inicio</label>
                        <br />
                        <input type="date" name="fechaIni" onChange={changed} />

                    </div>

                    <div>

                        <label>Fecha de termino</label>
                        <br />
                        <input type="date" name="fechaFin" onChange={changed} />

                    </div>

                    <div>

                        <input type="submit" value="Crear" />

                    </div>

                </form>

                <form className="formulario-notificacion" onSubmit={notificar}>

                    <h1>Enviar aviso sobre mantención</h1>

                    <div>

                        <label>Ingrese mensaje a notificar</label>
                        <br />
                        <textarea name="message" onChange={changed} />

                    </div>

                    <div>

                        <input type="submit" value="Notificar" />

                    </div>

                </form>

            </div>

        </>
    )
}

export default CrearMantencion
