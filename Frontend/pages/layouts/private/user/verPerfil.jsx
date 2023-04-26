import React, { useEffect, useState } from 'react'
import Router from 'next/router';
import Header from './header';
import Image from 'next/image';
import Tic from '../../../../public/tic.png';
import Equis from '../../../../public/equis.png';
import Default from '../../../../public/default.jpg';
import { CircularProgress, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Swal from 'sweetalert2';

const VerPerfil = () => {

    useEffect(() => {

        conseguirPerfil();

    }, []);

    const [perfil, setPerfil] = useState([]);
    const [loading, setLoading] = useState(false);

    const conseguirPerfil = async () => {

        const tokenUser = localStorage.getItem('tokenUser');
        const user = localStorage.getItem('user');

        if (!tokenUser && !user) {

            Router.push('../../../');

        } else {

            const userObj = JSON.parse(user);
            const userId = userObj.id;

            const request = await fetch(process.env.SERVIDOR + 'ver_perfil/' + userId, {

                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': tokenUser
                }

            });

            const data = await request.json();

            if(data.message === "Token inválido"){

                Router.push('./logout');
    
            }
    
            if(data.message === "Token expirado"){
    
                Router.push('./logout');
                
            }

            setPerfil(data.user);
            setLoading(true);

        }

    }

    const style = {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updateImage = async (e) => {

        e.preventDefault();

        const user = localStorage.getItem('user');
        const userObj = JSON.parse(user);
        const userId = userObj.id;

        const fileInput = document.querySelector("#file");

        if (fileInput.files[0]) {

            const formData = new FormData();

            formData.append('file0', fileInput.files[0]);

            const subida = await fetch(process.env.SERVIDOR + "subir_imagen/" + userId, {

                method: 'POST',
                body: formData

            });

            const subidaImagen = await subida.json();

            if (subidaImagen.status === "success") {

                Swal.fire({
                    icon: 'success',
                    title: 'Imagen actualizada',
                    text: 'La imagen de perfil ha sido actualizada',
                    confirmButtonText: 'Ok'
                });

                handleClose();

                setTimeout(() => {

                    location.reload();

                }, 2000);

            }

            if (subidaImagen.mensaje === "Archivo invalido") {

                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El archivo ingresado no es válido',
                    confirmButtonText: 'Ok'
                });

                handleClose();

            }

        }

    }

    return (

        <>

            <Header />

            <div className="contenedor-verPerfil">

                <h1>Mi perfil</h1>

                {!loading ? " " : perfil.autorizado == "Si" && <Image src={Tic} width={40} height={40} alt="Permitido" />}
                {!loading ? " " : perfil.autorizado == "No" && <Image src={Equis} width={40} height={40} alt="No permitido" />}

                {!loading ? " " : perfil.imagen != "default.png" && <picture><img className="usuario" src={process.env.SERVIDOR + "ver_imagen/" + perfil.imagen} alt="Usuario" /></picture>}
                {!loading ? " " : perfil.imagen == "default.png" && <Image className="usuario" src={Default} width={200} height={200} alt="Usuario" />}

                {!loading ? " " : <Button onClick={handleOpen}>Actualizar foto de perfil</Button>}

                {!loading ? <CircularProgress /> :

                    <div className="perfil">

                        <p>Nombre: {perfil.nombre}</p>
                        <p>Apellido: {perfil.apellido}</p>
                        <p>RUT: {perfil.rut}</p>
                        <p>Email: {perfil.email}</p>
                        <p>Dirección: {perfil.direccion}</p>
                        <p>Fecha de nacimiento: {new Date(perfil.fechaNacimiento).toLocaleDateString()}</p>
                        <p>Telefono: +569-{perfil.telefono}</p>

                    </div>

                }

            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <form onSubmit={updateImage}>

                        <div>

                            <label htmlFor="file0">Ingrese una nueva imagen</label>
                            <br />
                            <Input type="file" name="file0" id="file" required />

                        </div>

                        <br />

                        <div>

                            <Input type="submit" value="Actualizar" />

                        </div>

                    </form>
                </Box>
            </Modal>

        </>
    )
}

export default VerPerfil
