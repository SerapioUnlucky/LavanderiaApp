import React, { useEffect, useState } from 'react'
import Header from './header';
import { useForm } from '../../../../hooks/useForm';
import Router from 'next/router';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

const GenerarInformeMensual = () => {


    useEffect(() => {

        auth();
        setMax();

    }, []);

    const { form, changed } = useForm({});

    const auth = () => {

        const tokenAdmin = localStorage.getItem('tokenAdmin');
        const admin = localStorage.getItem('admin');

        if (!tokenAdmin && !admin) {

            Router.push('../../../');

        }

    }

    const setMax = async(e) => {

        let fech = document.getElementById("fechaInput");
        let todate = new Date();

        todate.setMonth(todate.getMonth() + 2);
        todate.setDate(0);
        fech.max = new Date(todate).toISOString().split("T")[0];

    }

    const generarInforme = async (e) => {

        e.preventDefault();

        let informe = form;

        const request = await fetch(process.env.SERVIDOR + "micelaneo/generarInforme", {
            method: 'POST',
            body: JSON.stringify({ fecharec: informe.fecharec }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('tokenAdmin')
            }
        })

        const data = await request.json();

        if(data.message === "Token inválido"){

            Router.push('./logout');

        }

        if(data.message === "Token expirado"){

            Router.push('./logout');
            
        }

        if(data.message === "La fecha ingresada no es válida"){

            
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'La fecha ingresada no es válida',
            });

            return false;

        }

        let tabla = document.getElementById("tablaHTML");
        tabla.innerHTML = "";

        let linea = document.createElement("tr");

        let hea = document.createElement("thead")

        linea.innerHTML += `<th>Usuario</th>`;
        linea.innerHTML += `<th>Cargo total</th>`;
        linea.innerHTML += `<th>Sobrecargo</th>`;
        linea.innerHTML += `<th>Usos lavadora</th>`;
        linea.innerHTML += `<th>Usos secadora</th>`;
        hea.appendChild(linea);
        tabla.appendChild(hea);

        let bod = document.createElement("tbody");

        data.lista.forEach(element => {

            let linea = document.createElement("tr");
            linea.innerHTML += `<th>${element.usuario}</th>`;
            linea.innerHTML += `<th>${element.cargo}</th>`;
            linea.innerHTML += `<th>${element.sobreCargo}</th>`;
            linea.innerHTML += `<th>${element.usoLav}</th>`;
            linea.innerHTML += `<th>${element.usoSec}</th>`;
            bod.appendChild(linea);

        });

        tabla.appendChild(bod);

    }

    return (

        <>

            <Header />

            <div className="contenedor-informe">

                <h1>Generar un informe de cobro</h1>

                <form className="formulario-informe" onSubmit={generarInforme}>

                    <label>Ingrese una fecha para generar</label>

                    <div>

                        <input onChange={changed} type="date" id="fechaInput" name='fecharec' required></input>

                    </div>

                    <div>

                        <Button variant="contained" id="enviar" type='submit' value="generar">generar</Button>

                    </div>

                </form>

                <table id="tablaHTML"></table>

            </div>

        </>
    )
}


export default GenerarInformeMensual;