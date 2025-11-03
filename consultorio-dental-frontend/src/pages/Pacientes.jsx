import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

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
    estadoId: "11", // Guanajuato por defecto
    municipioId: "",
    coloniaId: "",
    cp: "",
    telefonoCasa: "",
    telefonoCelular: "",
    religion: "",
    motivoConsulta: "",
    padecimientoActual: "",
    enfermedades: { diabetes: false, hipertension: false, otras: "" },
    alergias: { medicamentos: false, anestesicos: false, alimentos: false, detalles: "" },
    dentista: "",
  });

  const [listaEstados, setListaEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [colonias, setColonias] = useState([]);
  const sigCanvas = useRef();
  const navigate = useNavigate();
  const pasosTotales = 5;

  // 🔹 Cargar todos los estados al montar el componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const estadosRef = collection(db, "dipomex", "estados", "data");
        const querySnapshot = await getDocs(estadosRef);
        const lista = querySnapshot.docs.map((doc) => ({
          id_estado: doc.id,
          ...doc.data(),
        }));

        const estadosFormateados = lista.map((e) => ({
          id_estado: e.estado_id || e.id_estado,
          nombre_estado: e.nombre_estado || e.ESTADO || e.nombre || "Sin nombre",
        }));

        setListaEstados(estadosFormateados);
        console.log("✅ Estados cargados:", estadosFormateados);
      } catch (error) {
        console.error("❌ Error al obtener estados:", error);
      }
    };

    fetchEstados();
  }, []);

  // 🔹 Cargar municipios cuando cambia el estado seleccionado
  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        if (!formData.estadoId) return;
        const estadoRef = doc(db, "dipomex", "estados", "data", formData.estadoId);
        const estadoSnap = await getDoc(estadoRef);

        if (estadoSnap.exists()) {
          const data = estadoSnap.data();
          if (Array.isArray(data.municipios)) {
            const municipiosFormateados = data.municipios.map((m) => ({
              id_municipio: m.municipio_id,
              nombre_municipio: m.nombre_municipio,
              colonias: m.colonias || [],
            }));
            setMunicipios(municipiosFormateados);
            setColonias([]);
            console.log("✅ Municipios cargados:", municipiosFormateados);
          }
        }
      } catch (error) {
        console.error("❌ Error al obtener municipios:", error);
      }
    };

    fetchMunicipios();
  }, [formData.estadoId]);

  // 🔹 Cargar colonias cuando cambia el municipio seleccionado
  useEffect(() => {
    if (!formData.municipioId || municipios.length === 0) {
      setColonias([]);
      return;
    }

    const municipioSeleccionado = municipios.find(
      (m) => String(m.id_municipio) === String(formData.municipioId)
    );

    if (municipioSeleccionado && Array.isArray(municipioSeleccionado.colonias)) {
      setColonias(municipioSeleccionado.colonias);
      console.log("✅ Colonias cargadas:", municipioSeleccionado.colonias);
    } else {
      setColonias([]);
      console.warn("⚠️ No se encontraron colonias para este municipio");
    }
  }, [formData.municipioId, municipios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleEnfermedad = (key) => {
    setFormData((prev) => ({
      ...prev,
      enfermedades: { ...prev.enfermedades, [key]: !prev.enfermedades[key] },
    }));
  };

  const toggleAlergia = (key) => {
    setFormData((prev) => ({
      ...prev,
      alergias: { ...prev.alergias, [key]: !prev.alergias[key] },
    }));
  };

  const algunaAlergia = Object.values(formData.alergias).some((v) => v === true);

  const siguientePaso = () => setPaso((prev) => Math.min(prev + 1, pasosTotales));
  const pasoAnterior = () => setPaso((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      // Capturar la firma como imagen base64
      let firmaURL = "";
      if (sigCanvas.current) {
        // Si falla getTrimmedCanvas, usar fallback manual
        try {
          firmaURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
        } catch {
          console.warn("⚠️ No se pudo usar getTrimmedCanvas(), usando getCanvas() como respaldo");
          firmaURL = sigCanvas.current.getCanvas().toDataURL("image/png");
        }
      }

      // Crear objeto para guardar
      const dataPaciente = {
        ...formData,
        fechaRegistro: new Date(),
        firma: firmaURL || null,
      };

      // Guardar en la colección "pacientes"
      const docRef = await addDoc(collection(db, "pacientes"), dataPaciente);
      alert(`✅ Paciente registrado con ID: ${docRef.id}`);

      // Resetear el formulario
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
        estadoId: "11",
        municipioId: "",
        coloniaId: "",
        cp: "",
        telefonoCasa: "",
        telefonoCelular: "",
        religion: "",
        motivoConsulta: "",
        padecimientoActual: "",
        enfermedades: { diabetes: false, hipertension: false, otras: "" },
        alergias: { medicamentos: false, anestesicos: false, alimentos: false, detalles: "" },
        dentista: "",
      });
      if (sigCanvas.current) sigCanvas.current.clear();
    } catch (error) {
      console.error("❌ Error al guardar paciente:", error);
      alert("Hubo un error al guardar el paciente en Firestore");
    }
  };


  return (
    <div className="max-w-3xl mx-auto mt-8 bg-violet-200 p-6 rounded-xl shadow-lg">
      <div className="mb-4">
        <button
          onClick={() => navigate("/Dashboard")}
          className="bg-[#5f6c5d] hover:bg-[#4b5849] text-white px-4 py-2 rounded-xl transition-all shadow-md hover:scale-105"
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
              <label className="block font-medium mb-1">Estado</label>
              <select
                name="estadoId"
                value={formData.estadoId}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                {listaEstados.length === 0 ? (
                  <option value="">Cargando estados...</option>
                ) : (
                  <>
                    <option value="">Selecciona un estado</option>
                    {listaEstados.map((e) => (
                      <option key={e.id_estado} value={e.id_estado}>
                        {e.nombre_estado}
                      </option>
                    ))}
                  </>
                )}
              </select>

              <label className="block font-medium mb-1">Municipio</label>
              <select
                name="municipioId"
                value={formData.municipioId}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Selecciona un municipio</option>
                {municipios.map((m) => (
                  <option key={m.id_municipio} value={m.id_municipio}>
                    {m.nombre_municipio}
                  </option>
                ))}
              </select>

              <label className="block font-medium mb-1">Colonia</label>
              <select
                name="coloniaId"
                value={formData.coloniaId}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                disabled={colonias.length === 0}
              >
                <option value="">Selecciona una colonia</option>
                {colonias.map((c, idx) => (
                  <option key={idx} value={c.colonia_id || idx}>
                    {c.nombre_colonia || c.COLONIA || c.nombre || "Sin nombre"}
                  </option>
                ))}
              </select>

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
            <select name="dentista" className="input mb-4 w-full" onChange={handleChange}>
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

      <div className="flex justify-between mt-6">
        {paso > 1 && (
          <button
            onClick={pasoAnterior}
            className="bg-stone-400 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Atrás
          </button>
        )}
        {paso < pasosTotales ? (
          <button
            onClick={siguientePaso}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 ml-auto"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-auto"
          >
            Registrar Paciente
          </button>
        )}
      </div>
    </div>
  );
};

export default Pacientes;
