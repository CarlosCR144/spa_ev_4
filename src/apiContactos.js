import axios from "axios";

const API_URL_CONTACTOS = "https://jjhhrlizhsxhognquijs.supabase.co/rest/v1/contacto";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaGhybGl6aHN4aG9nbnF1aWpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NTg1NjIsImV4cCI6MjA2NzMzNDU2Mn0.Mjh1lE8W0U_Shhyoe1Taswzj_2YcqqPJejHihm7jg-M";

export const getContactosDatosContacto = async () => {
  const { data } = await axios.get(`${API_URL_CONTACTOS}?select=id_contacto,nombre,apellido,dato_contacto(id_dato_contacto, tipo, correo, telefono, direccion)`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export const getContactos = async () => {
  const { data } = await axios.get(API_URL_CONTACTOS, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
  return data;
};

export const addContacto = async (contacto) => {
  const { data } = await axios.post(API_URL_CONTACTOS, contacto, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
  });
  return data;
};

export const deleteContacto = async (id_contacto) => {
  await axios.delete(`${API_URL_CONTACTOS}?id_contacto=eq.${id_contacto}`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
};
