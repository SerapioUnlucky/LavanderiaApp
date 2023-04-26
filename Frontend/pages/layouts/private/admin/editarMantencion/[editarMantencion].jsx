import React, { useState, useEffect } from 'react'
import { useForm } from '../../../../../hooks/useForm';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';

const EditarMantencion = () => {

    useEffect(() => {

        conseguirMantencion();

    });

    const { form, changed } = useForm({});
    const Router = useRouter();
    const { editarMantencion } = Router.query;
    const [maquina, setMaquina] = useState([]);

    const conseguirMantencion = async () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../../');

        } else {

            const request = await fetch(process.env.SERVIDOR + 'mantencion/obtener_unico/' + editarMantencion, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('tokenAdmin')
                }

            });

            const data = await request.json();

            if(data.message === "Token inválido"){

                Router.push('../logout');

            }

            if(data.message === "Token expirado"){

                Router.push('../logout');
                
            }

            if(data.message === "Mantención obtenida"){

                setMaquina(data.mantenciones.maquinaid);

            }

        }

    }

    const modificarMantencion = async (e) => {

        e.preventDefault();

        const request = await fetch(process.env.SERVIDOR + 'mantencion/modificar', {

            method: 'PUT',
            body: JSON.stringify({id: editarMantencion, maquinaid: maquina, fechaIni: form.fechaIni, fechaFin: form.fechaFin}),
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

        if(data.message === "No se pudo modificar la mantención"){

            Swal.fire(
                'Error',
                'No se pudo modificar la mantención',
                'error',
            )

        }

        if(data.message === "mantencion modificada"){

            Swal.fire(
                'Listo',
                'Mantención modificada',
                'success',
            )

            setTimeout(() => {

                Router.push('../verMantenciones');

            }, 2000);

        }

    }

    return (
        <>

            <h1 className="titulo">Burbujas Lavandería</h1>

            <div className="contenedor-editarAutorizacion">

                <Link href="../verMantenciones">Volver atras</Link>

                <form className="formulario-mantencion" onSubmit={modificarMantencion}>

                <h1>Modificar mantención</h1>

                    <div>

                        <label>Maquina</label>
                        <br />
                        <input type="text" name="maquina" defaultValue={maquina} readOnly/>

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

                        <input type="submit" value="Modificar" />

                    </div>

                </form>

            </div>

        </>
    )
}

export default EditarMantencion
