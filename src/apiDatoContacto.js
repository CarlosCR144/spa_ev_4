import axios from "axios";

const API_URL_DATO_CONTACTO = "https://jjhhrlizhsxhognquijs.supabase.co/rest/v1/dato_contacto";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaGhybGl6aHN4aG9nbnF1aWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTg1NjIsImV4cCI6MjA2NzMzNDU2Mn0.Mjh1lE8W0U_Shhyoe1Taswzj_2YcqqPJejHihm7jg-M";

// export const getContactosDatosContacto = async () => {
//   const { data } = await axios.get(`${API_URL_DATO_CONTACTO}?select=*,contacto(id_contacto)`, {
//     headers: {
//       apikey: API_KEY,
//       Authorization: `Bearer ${API_KEY}`,
//     },
//   });
//   return data;
// };

export const getDatosContacto = async (id_contacto) => {
  const { data } = await axios.get(`${API_URL_DATO_CONTACTO}?select=${id_contacto}`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export const addDatosContacto = async (datos_contacto) => {
  const { data } = await axios.post(API_URL_DATO_CONTACTO, datos_contacto, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
  });
  return data;
};

export const deleteDatosContacto = async (id_dato_contacto) => {
  console.log("Eliminando dato de contacto con ID:", id_dato_contacto);
  await axios.delete(`${API_URL_DATO_CONTACTO}?id_dato_contacto=eq.${id_dato_contacto}`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
};
