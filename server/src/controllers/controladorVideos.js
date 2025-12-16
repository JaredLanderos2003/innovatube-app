import axios from 'axios';

export const buscarEnYoutube = async (req, res) => {
  try {
    const { busqueda } = req.query; 
    if (!busqueda) {
      return res.status(400).json({ mensaje: 'Por favor escribe algo para buscar.' });
    }

    const respuesta = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet', 
        q: busqueda,     
        type: 'video',   
        maxResults: 12, 
        key: process.env.YOUTUBE_API_KEY
      }
    });

    res.json(respuesta.data.items);

  } catch (error) {
    console.log('Error:');
    res.status(500).json({ mensaje: 'Error al conectar con YouTube.' });
  }
};