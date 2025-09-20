import React, { useState, useRef , useEffect} from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // tu configuración

const PasoAnimado = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

const Pacientes = () => {

  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    edad: "",
    genero: "",
    lugarNacimiento: "",
    fechaNacimiento: "",
    ocupacion: "",
    escolaridad: "",
    estadoCivil: "",
    calle: "",
    numeroExt: "",
    numeroInt: "",
    estadoId: "",
    municipioId: "",
    coloniaId: "",   
    cp: "",   
    telefonoCasa: "",
    telefonoCelular: "",
    religion: "",
    motivoConsulta: "",
    padecimientoActual: "",
    enfermedades: {
      diabetes: false,
      hipertension: false,
      otras: "",
    },
    alergias: {
      medicamentos: false,
      anestesicos: false,
      alimentos: false,
      detalles: "",
    },
    dentista: "",
  });

const handleSubmit = async () => {
  try {
    // Construir el payload que coincida con el backend
    const payload = {
      nombre: formData.nombre,
      edad: formData.edad ? parseInt(formData.edad, 10) : null,
      genero: formData.genero,
      // lugar_nacimiento: formData.lugarNacimiento,
      fecha_nacimiento: formData.fechaNacimiento || null,
      ocupacion: formData.ocupacion,
      escolaridad: formData.escolaridad,
      estado_civil: formData.estadoCivil,
      calle: formData.calle,
      numero_ext: formData.numeroExt,
      numero_int: formData.numeroInt,
      telefono_casa: formData.telefonoCasa,
      telefono_celular: formData.telefonoCelular,
      religion: formData.religion,
      motivo_consulta: formData.motivoConsulta,
      padecimiento_actual: formData.padecimientoActual,
      direccion: {
        cp: formData.codigoPostal,
        estadoId: formData.estadoId,
        municipioId: formData.municipioId,
        ciudadId: formData.ciudadId,
        coloniaId: formData.coloniaId,
      },
      // id_localidad: formData.coloniaId ? parseInt(formData.coloniaId, 10) : null, // 👈 FK colonia
      //id_dentista: formData.dentista ? parseInt(formData.dentista, 10) : null,    // 👈 FK dentista
      enfermedades: {
        diabetes: formData.enfermedades.diabetes,
        hipertension: formData.enfermedades.hipertension,
        otras: formData.enfermedades.otras
      },
      alergias: {
        medicamentos: formData.alergias.medicamentos,
        anestesicos: formData.alergias.anestesicos,
        alimentos: formData.alergias.alimentos,
        detalles: formData.alergias.detalles
      }
    };

    console.log("Payload enviado al backend:", payload);

    const res = await axios.post("http://localhost:4000/pacientes", payload);

    alert(`Paciente registrado con ID: ${res.data.id_paciente}`);

    // ✅ Resetear formulario después del registro
    setFormData({
      nombre: "",
      edad: "",
      genero: "",
      lugarNacimiento: "",
      fechaNacimiento: "",
      ocupacion: "",
      escolaridad: "",
      estadoCivil: "",
      calle: "",
      numeroExt: "",
      numeroInt: "",
      telefonoCasa: "",
      telefonoCelular: "",
      religion: "",
      motivoConsulta: "",
      padecimientoActual: "",
      estadoId: "",
      municipioId: "",
      coloniaId: "",
      dentista: "",
      enfermedades: { diabetes: false, hipertension: false, otras: "" },
      alergias: { medicamentos: false, anestesicos: false, alimentos: false, detalles: "" }
    });
  } catch (error) {
    console.error("Error al registrar paciente:", error);
    alert("Hubo un error al registrar el paciente");
  }
};


  // const handleSubmit = async (datosFormulario) => {
  //   try {
      
  //     const response = await axios.post('http://localhost:4000/pacientes', datosFormulario);
  //     console.log('Paciente guardado:', response.data);
  //     alert('Paciente guardado con éxito');
  //   } catch (error) {
  //     console.error('Error al guardar paciente:', error);
  //     alert('Hubo un error al guardar el paciente');
  //   }
  // };

    // ESTADOS
  //const [estadosBD, setEstadosBD] = useState([]);
    // 3. Hooks para cargar estados y municipios
  // const [estadosBD, setEstadosBD] = useState([]);
  // const [municipioBD, setMunicipiosBD] = useState([]);
  // const [coloniasBD, setColoniasBD] = useState([]);

  const [estadosBD, setEstadosBD] = useState([]);
  const [municipiosBD, setMunicipiosBD] = useState([]);
  const [coloniasBD, setColoniasBD] = useState([]);



  //OBTENER ESTADOS
  // useEffect(() => {
  //   const fetchEstados = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:4000/estados');
  //       setEstadosBD(res.data);
  //     } catch (err) {
  //       console.error('Error al cargar estados', err);
  //     }
  //   };
  //   fetchEstados();
  // }, []);

  // Municipios
  // useEffect(() => {
  //   if (!formData.estadoId) return setMunicipioBD([]);
  //   axios.get("http://localhost:4000/municipios", {
  //     params: { estadoId: formData.estadoId }
  //   })
  //     .then(res => setMunicipioBD(res.data))
  //     .catch(console.error);
  // }, [formData.estadoId]);
   useEffect(() => {
    fetchEstados();
  }, []);
//   useEffect(() => {
//   if (!formData.estadoId) {
//     setMunicipiosBD([]);
//     return;
//   }
//   const fetchMunicipios = async () => {
//     try {
//       const res = await axios.get('http://localhost:4000/municipios', {
//         params: { estadoId: formData.estadoId }
//       });
//       setMunicipiosBD(res.data);
//     } catch (err) {
//       console.error('Error al cargar municipios', err);
//     }
//   };
//   fetchMunicipios();
// }, [formData.estadoId]);

// useEffect colonia
// useEffect(() => {
//   if (!formData.municipioId) {
//     setColoniasBD([]);
//     return;
//   }
//   const fetchColonias = async () => {
//     try {
//       const res = await axios.get('http://localhost:4000/colonias', {
//         params: { municipioId: formData.municipioId }
//       });
//       setColoniasBD(res.data);
//     } catch (err) {
//       console.error('Error al cargar colonias', err);
//     }
//   };
//   fetchColonias();
// }, [formData.municipioId]);


  const sigCanvas = useRef();

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "estadoId") {
      setMunicipiosBD([]);
      setColoniasBD([]);
      fetchMunicipios(value);
    }

    // if (name === "cp" && value.length === 5) {
    //   setColoniasBD([]);
    //   fetchColonias(value);
    // }
    //fetchColonias = async (estadoId, municipioId) municipioId
    if (name === "municipioId") {
      setColoniasBD([]);
      fetchColonias(formData.estadoId, value);
    }
  };

  const toggleEnfermedad = (key) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: {
        ...prev.enfermedades,
        [key]: !prev.enfermedades[key],
      },
    }));
  };

  const toggleAlergia = (key) => {
    setFormData((prev) => ({
      ...prev,
      alergias: {
        ...prev.alergias,
        [key]: !prev.alergias[key],
      },
    }));
  };

  const algunaAlergia = Object.values(formData.alergias).some(
    (v) => v === true
  );

  const pasosTotales = 5;

  // estados API COPOMEX funcion get_estados
  const fetchEstados = async () => {
    try {
      
      //PRUEBAS 
      // const res = await fetch('/api/dipomex/v1/estados', {
      //   headers: {
      //     APIKEY: '272406fa9058c2494438c4872b8dba1450c0cbc1'
      //   }
      // });
      //PRODUCTIVO
      const res = await fetch("https://api.tau.com.mx/dipomex/v1/estados", {
        method: "GET",
        headers: {
          APIKEY: "272406fa9058c2494438c4872b8dba1450c0cbc1", // 
        },
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      
      if (!data.estados || !Array.isArray(data.estados)) {
        console.error("⚠️ No llegaron estados válidos:", data);
        return;
      }

      // Normalizamos a un arreglo de objetos con id y nombre
      const estados = data.estados.map((item) => ({
        id: item.ESTADO_ID,
        nombre: item.ESTADO,
      }));

      setEstadosBD(estados);
      console.log("✅ Estados cargados:", estados);
    } catch (err) {
      console.error("❌ Error al consultar estados en DIPOMEX:", err);
    }
  };


const fetchMunicipios = async (estadoId) => {
  try {
    // const res = await fetch(
    //   `https://api.copomex.com/query/get_municipio_por_estado/${estadoId}?token=pruebas`
    // );
    // productivo 
    const res = await fetch(`https://api.tau.com.mx/dipomex/v1/municipios?id_estado=${estadoId}`, {
        headers: {
          APIKEY: '272406fa9058c2494438c4872b8dba1450c0cbc1'
        }
    });
    // PRUEBAS
    // const res = await fetch(`/api/dipomex/v1/municipios?id_estado=${estadoId}`, {
    //     headers: {
    //       APIKEY: '272406fa9058c2494438c4872b8dba1450c0cbc1'
    //     }
    // });

    const data = await res.json();

      if (!data.municipios || !Array.isArray(data.municipios)) {
        console.error("⚠️ No llegaron municipios válidos:", data);
        return;
      }
    
    const municipios = data.municipios.map((item) => ({
      id: item.MUNICIPIO_ID,
      nombre: item.MUNICIPIO,
      id_estado: item.ESTADO_ID,
    }));
    
    setMunicipiosBD(municipios);
  } catch (err) {
    console.error("❌ Error al consultar municipios en Copomex:", err);
  }
};

  // PRUEBAS DE API DE COLONIAS
const fetchColonias = async (estadoId, municipioId) => {
  try {
    // const res = await fetch(
    //   `https://api.copomex.com/query/get_colonia_por_cp/${cp}?token=pruebas`
    // );
    //
    // productivo
      const res = await fetch(`https://api.tau.com.mx/dipomex/v1/colonias?id_estado=${estadoId}&id_mun=${municipioId}`, {
        method: 'GET',
        headers: {
          APIKEY: '272406fa9058c2494438c4872b8dba1450c0cbc1'
        }
      });
    // PRUEBAS
    // const res = await fetch(`/api/dipomex/v1/colonias?id_estado=${estadoId}&id_mun=${municipioId}`, {
    //     method: 'GET',
    //     headers: {
    //       APIKEY: '272406fa9058c2494438c4872b8dba1450c0cbc1'
    //     }
    //   });
    const data = await res.json();

      if (!data.colonias || !Array.isArray(data.colonias)) {
        console.error("⚠️ No llegaron colonias válidos:", data);
        return;
      }
      debugger
      const colonias = data.colonias.map((item) => ({
        id: item.ASENTA_ID,
        nombre: item.COLONIA,
        cp: item.CP,
        id_estado: item.ESTADO_ID,
        id_municipio: item.MUNICIPIO_ID,
      }));
    //     const municipios = data.municipios.map((item) => ({
    //   id: item.MUNICIPIO_ID,
    //   nombre: item.MUNICIPIO,
    //   id_estado: item.ESTADO_ID,
    // }));

    setColoniasBD(colonias);
  } catch (err) {
    console.error("❌ Error al consultar colonias en Copomex:", err);
  }
};


  const guardarPaciente = async () => {
    try {
      await addDoc(collection(db, "pacientes"), formData);
      alert("Paciente guardado correctamente");
    } catch (error) {
      console.error("Error al guardar paciente:", error);
    }
  };


  const siguientePaso = () => setPaso((prev) => Math.min(prev + 1, pasosTotales));
  const pasoAnterior = () => setPaso((prev) => Math.max(prev - 1, 1));

  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-violet-200 p-6 rounded-xl shadow-lg">
      {/* botón regreso */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/Dashboard")}
          className="bg-[#5f6c5d] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl
                     transition-all shadow-md hover:scale-105"
        >
          Menú Principal
        </button>
      </div>

      <AnimatePresence mode="wait">
        {paso === 1 && (
          <PasoAnimado key="paso1">
            <h2 className="text-xl font-bold mb-4">Datos personales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nombre" placeholder="Nombre" className="input" onChange={handleChange} />
              <input name="edad" placeholder="Edad" className="input" onChange={handleChange} />
              <input name="genero" placeholder="Género" className="input" onChange={handleChange} />
              <input name="lugarNacimiento" placeholder="Lugar de nacimiento" className="input" onChange={handleChange} />
              <input name="fechaNacimiento" type="date" className="input" onChange={handleChange} />
              <input name="ocupacion" placeholder="Ocupación" className="input" onChange={handleChange} />
              <input name="escolaridad" placeholder="Escolaridad" className="input" onChange={handleChange} />
              <input name="estadoCivil" placeholder="Estado civil" className="input" onChange={handleChange} />
            </div>
          </PasoAnimado>
        )}

        {paso === 2 && (
          <PasoAnimado key="paso2">
            <h2 className="text-xl font-bold mb-4">Dirección</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Estado */}
                    <label className="block font-medium mb-1">Estado</label>
                    <select
                      name="estadoId"
                      value={formData.estadoId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mb-4"
                    >
                      <option value="">Selecciona un estado</option>
                      {estadosBD.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>

                    {/* Municipio */}
                      <label className="block font-medium mb-1">Municipio</label>
                      <select
                        name="municipioId"
                        value={formData.municipioId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                        disabled={!formData.estadoId}
                      >
                        <option value="">Selecciona un municipio</option>
                        {municipiosBD.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.nombre}
                          </option>
                        ))}
                      </select>

                            {/* Código Postal 
                                     <label className="block font-medium mb-1">Código Postal</label>
                      <input
                        type="text"
                        name="cp"
                        value={formData.cp}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Ejemplo: 36557"
                      />
                            */}
             

                      {/* Colonia */}
                      <label className="block font-medium mb-1">Colonia</label>
                      <select
                        name="coloniaId"
                        value={formData.coloniaId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded mb-4"
                        disabled={coloniasBD.length === 0}
                      >
                        <option value="">Selecciona una colonia</option>
                        {coloniasBD.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
              {/* Código Postal
              <input
                name="codigoPostal"
                placeholder="Código Postal"
                className="input"
                value={formData.codigoPostal || ""}
                onChange={async (e) => {
                  const cp = e.target.value;
                  setFormData((prev) => ({ ...prev, codigoPostal: cp }));

                  if (cp.length === 5) {
                    await fetchColonias(cp);
                  }
                }}
              /> */}

              {/* Colonia
              <select
                name="coloniaId"
                value={formData.coloniaId || ""}
                onChange={handleChange}
                className="input"
                disabled={coloniasBD.length === 0}
              >
                <option value="">Seleccione una colonia</option>
                {coloniasBD.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.nombre}
                    </option>
                ))}
              </select>

              { Estado (readonly) }
                <input
                  name="estadoId"
                  value={formData.estadoId || ""}
                  className="input"
                  readOnly
                />

                {/* Municipio (readonly) }
                <input
                  name="municipioId"
                  value={formData.municipioId || ""}
                  className="input"
                  readOnly
                />

                { Ciudad (readonly, opcional) }
                <input
                  name="ciudad"
                  value={formData.ciudad || ""}
                  className="input"
                  readOnly
                /> */}

              {/* <input name="calle" placeholder="Calle" className="input" onChange={handleChange} /> */}
              <input name="numeroExt" placeholder="Número exterior" className="input" onChange={handleChange} />
              <input name="numeroInt" placeholder="Número interior" className="input" onChange={handleChange} />
              <input name="telefonoCasa" placeholder="Tel. casa" className="input" onChange={handleChange} />
              <input name="telefonoCelular" placeholder="Celular" className="input" onChange={handleChange} />
              <input name="religion" placeholder="Religión" className="input" onChange={handleChange} />
            </div>

          </PasoAnimado>
        )}

        {paso === 3 && (
          <PasoAnimado key="paso3">
            <h2 className="text-xl font-bold mb-4">Enfermedades</h2>
            <div className="flex gap-4 mb-4">
              <label><input type="checkbox" onChange={() => toggleEnfermedad("diabetes")} /> Diabetes</label>
              <label><input type="checkbox" onChange={() => toggleEnfermedad("hipertension")} /> Hipertensión</label>
            </div>
            <textarea
              name="otras"
              placeholder="Otras enfermedades"
              className="input w-full"
              onChange={(e) =>
                setFormData({ ...formData, enfermedades: { ...formData.enfermedades, otras: e.target.value } })
              }
              maxLength={200}
            />
          </PasoAnimado>
        )}

        {paso === 4 && (
          <PasoAnimado key="paso4">
            <h2 className="text-xl font-bold mb-4">Alergias</h2>
            <div className="flex gap-4 mb-4">
              <label><input type="checkbox" onChange={() => toggleAlergia("medicamentos")} /> Medicamentos</label>
              <label><input type="checkbox" onChange={() => toggleAlergia("anestesicos")} /> Anestésicos</label>
              <label><input type="checkbox" onChange={() => toggleAlergia("alimentos")} /> Alimentos</label>
            </div>
            {algunaAlergia && (
              <textarea
                name="detalles"
                placeholder="Detalles de alergias"
                className="input w-full"
                onChange={(e) =>
                  setFormData({ ...formData, alergias: { ...formData.alergias, detalles: e.target.value } })
                }
                maxLength={200}
              />
            )}
          </PasoAnimado>
        )}

        {paso === 5 && (
          <PasoAnimado key="paso5">
            <h2 className="text-xl font-bold mb-4">Firma y Dentista</h2>
            <select
              name="dentista"
              className="input mb-4 w-full"
              onChange={handleChange}
            >
              <option value="">Selecciona un dentista</option>
              <option value="Dr. Pérez">Dr. Juan Pérez</option>
              <option value="Dra. López">Dra. María López</option>
              <option value="Dr. Gómez">Dr. Roberto Gómez</option>
            </select>
            <p className="font-semibold mb-2">Firma del paciente:</p>
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ className: "border w-full h-48 rounded" }}
            />
          </PasoAnimado>
        )}
      </AnimatePresence>

      {/* Navegación de pasos */}
      <div className="flex justify-between mt-6">
        {paso > 1 && <button onClick={pasoAnterior} className="bg-stone-400 text-black px-4 py-2 rounded-lg hover:bg-gray-400">Atrás</button>}
        {paso < pasosTotales ? (
          <button onClick={siguientePaso} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 ml-auto">Siguiente</button>
        ) : (
          <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-auto">
            Registrar Paciente
          </button>
        )}
      </div>
    </div>
  );
};

export default Pacientes;



const handleSelect = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: parseInt(value, 10) // guardamos como número
  }));
};


// import { useState } from 'react';

// const Pacientes = () => {
//   const [form, setForm] = useState({
//     nombre: '',
//     edad: '',
//     genero: '',
//     lugarNacimiento: '',
//     fechaNacimiento: '',
//     ocupacion: '',
//     escolaridad: '',
//     estadoCivil: '',
//     calle: '',
//     numExt: '',
//     numInt: '',
//     colonia: '',
//     estado: '',
//     municipio: '',
//     telCasa: '',
//     telCelular: '',
//     religion: '',
//     motivoConsulta: '',
//     padecimiento: '',
//     enfermedades: {
//       diabetes: false,
//       hipertension: false,
//       otras: '',
//     },
//     alergias: {
//       medicamentos: false,
//       anestesicos: false,
//       alimentos: false,
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (name.includes('enfermedades.') || name.includes('alergias.')) {
//       const [grupo, campo] = name.split('.');
//       setForm((prev) => ({
//         ...prev,
//         [grupo]: {
//           ...prev[grupo],
//           [campo]: type === 'checkbox' ? checked : value,
//         },
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Paciente registrado:', form);
//     // Aquí podrías hacer una petición con axios al backend
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="bg-violet-200 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto mt-6 space-y-6"
//     >
//       <h2 className="text-2xl font-bold text-purple-800">Registro de Paciente</h2>

//       {/* Datos personales */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input type="text" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre completo" className="input" />
//         <input type="number" name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" className="input" />
//         <select name="genero" value={form.genero} onChange={handleChange} className="input">
//           <option value="">Género</option>
//           <option value="masculino">Masculino</option>
//           <option value="femenino">Femenino</option>
//           <option value="otro">Otro</option>
//         </select>
//         <input type="text" name="lugarNacimiento" value={form.lugarNacimiento} onChange={handleChange} placeholder="Lugar de nacimiento" className="input" />
//         <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} className="input" />
//         <input type="text" name="ocupacion" value={form.ocupacion} onChange={handleChange} placeholder="Ocupación" className="input" />
//         <input type="text" name="escolaridad" value={form.escolaridad} onChange={handleChange} placeholder="Escolaridad" className="input" />
//         <input type="text" name="estadoCivil" value={form.estadoCivil} onChange={handleChange} placeholder="Estado civil" className="input" />
//       </div>

//       {/* Dirección */}
//       <h3 className="text-lg font-semibold text-purple-700">Dirección</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input type="text" name="calle" value={form.calle} onChange={handleChange} placeholder="Calle" className="input" />
//         <input type="text" name="numExt" value={form.numExt} onChange={handleChange} placeholder="No. Exterior" className="input" />
//         <input type="text" name="numInt" value={form.numInt} onChange={handleChange} placeholder="No. Interior" className="input" />
//         <input type="text" name="colonia" value={form.colonia} onChange={handleChange} placeholder="Colonia" className="input" />
//         <input type="text" name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="input" />
//         <input type="text" name="municipio" value={form.municipio} onChange={handleChange} placeholder="Municipio" className="input" />
//       </div>

//       {/* Contacto */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <input type="text" name="telCasa" value={form.telCasa} onChange={handleChange} placeholder="Tel. de casa / familiar" className="input" />
//         <input type="text" name="telCelular" value={form.telCelular} onChange={handleChange} placeholder="Teléfono celular" className="input" />
//         <input type="text" name="religion" value={form.religion} onChange={handleChange} placeholder="Religión" className="input" />
//       </div>

//       {/* Motivo de consulta */}
//       <textarea
//         name="motivoConsulta"
//         value={form.motivoConsulta}
//         onChange={handleChange}
//         placeholder="Motivo de la consulta odontológica (máximo 200 caracteres)"
//         maxLength={200}
//         className="input h-24"
//       />
//       <textarea
//         name="padecimiento"
//         value={form.padecimiento}
//         onChange={handleChange}
//         placeholder="Padecimiento actual (máximo 200 caracteres)"
//         maxLength={200}
//         className="input h-24"
//       />

//       {/* Enfermedades */}
//       <div>
//         <h3 className="text-lg font-semibold text-purple-700">Enfermedades</h3>
//         <div className="flex flex-col md:flex-row gap-4 mt-2">
//           <label><input type="checkbox" name="enfermedades.diabetes" checked={form.enfermedades.diabetes} onChange={handleChange} /> Diabetes</label>
//           <label><input type="checkbox" name="enfermedades.hipertension" checked={form.enfermedades.hipertension} onChange={handleChange} /> Hipertensión</label>
//           <input type="text" name="enfermedades.otras" value={form.enfermedades.otras} onChange={handleChange} placeholder="Otras enfermedades" className="input" />
//         </div>
//       </div>

//       {/* Alergias */}
//       <div>
//         <h3 className="text-lg font-semibold text-purple-700">Alergias</h3>
//         <div className="flex flex-col md:flex-row gap-4 mt-2">
//           <label><input type="checkbox" name="alergias.medicamentos" checked={form.alergias.medicamentos} onChange={handleChange} /> Medicamentos</label>
//           <label><input type="checkbox" name="alergias.anestesicos" checked={form.alergias.anestesicos} onChange={handleChange} /> Anestésicos</label>
//           <label><input type="checkbox" name="alergias.alimentos" checked={form.alergias.alimentos} onChange={handleChange} /> Alimentos</label>
//         </div>
//       </div>

//       <button
//         type="submit"
//         className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition w-full md:w-auto"
//       >
//         Registrar Paciente
//       </button>
//     </form>
//   );
// };

// export default Pacientes;


  
