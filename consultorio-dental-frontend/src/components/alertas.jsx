import Swal from 'sweetalert2';

const mostrarAlerta = (estado, paciente) => {
  Swal.fire({
    title: estado === 'atendido' ? '✅ Paciente atendido' : '❌ Paciente no asistió',
    text: `Paciente: ${paciente}`,
    icon: estado === 'atendido' ? 'success' : 'warning',
    confirmButtonText: 'Aceptar',
    timer: 2500,
    showConfirmButton: false,
    background: '#fff0f5',
  });
};

export default mostrarAlerta;