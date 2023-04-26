import React, { useEffect } from 'react'
import { useForm } from '../../../../../hooks/useForm';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Swal from 'sweetalert2';

const EditarAutorizacion = () => {

    useEffect(() => {

        auth();

    });

    const auth = () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../../');

        }

    }

    const { form, changed } = useForm({});
    const Router = useRouter();
    const { editarAutorizacion } = Router.query;

    const editarAutorizaciones = async (e) => {

        e.preventDefault();

        if (form.autorizado === 'Seleccione una opcion') {

            Swal.fire(
                'Error',
                'Debe seleccionar una nueva autorizacion',
                'error'
            )

            return false;

        }

        const request = await fetch(process.env.SERVIDOR + 'modificar_autorizacion/'+editarAutorizacion, {

            method: 'PUT',
            body: JSON.stringify(form),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('tokenAdmin')
            }, 

        });

        const data = await request.json();

        if(data.message === "Token inválido"){

            Router.push('../logout');
            
        }

        if(data.message === "Token expirado"){

            Router.push('../logout');

        }

        if(data.status === 'success'){

            Swal.fire(
                'Listo',
                'La autorizacion se ha editado correctamente',
                'success'
            )

            setTimeout(() => {

                Router.push('../verUsuarios');

            }, 2000);

        }

        if(data.message === 'No se ha ingresado la nueva autorización'){

            Swal.fire(
                'Error',
                'Debe seleccionar una nueva autorizacion',
                'error'
            )

        }

    }

    return (
        <>

            <h1 className="titulo">Burbujas Lavandería</h1>

            <div className="contenedor-editarAutorizacion">

                <Link href="../verUsuarios">Volver atras</Link>

                <form onSubmit={editarAutorizaciones}>

                    <label htmlFor="autorizado">Seleccione una nueva autorizacion</label>
                    <br />
                    <select name="autorizado" onChange={changed}>
                        <option>Seleccione una opcion</option>
                        <option>Si</option>
                        <option>No</option>
                    </select>

                    <input className="editar-autorizado" type="submit" value="Editar" />

                </form>

            </div>

        </>
    )
}

export default EditarAutorizacion;
