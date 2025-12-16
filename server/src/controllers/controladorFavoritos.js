import Favorito from '../models/Favorite.js';

export const agregarFavorito = async (req, res) => {
  try {
    const { videoId, titulo, descripcion, imagenUrl } = req.body;
    const usuarioId = req.usuarioId; 

    const existe = await Favorito.findOne({ where: { videoId, usuarioId } });
    if (existe) {
      return res.status(400).json({ mensaje: 'Ya tienes este video en favoritos.' });
    }

    const nuevoFavorito = await Favorito.create({
      videoId, titulo, descripcion, imagenUrl, usuarioId
    });

    res.status(201).json({ mensaje: 'Video agregado a tus favoritos', favorito: nuevoFavorito });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar favorito.' });
  }
};

export const misFavoritos = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const lista = await Favorito.findAll({ where: { usuarioId } });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar tus favoritos.' });
  }
};

export const eliminarFavorito = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;
    const borrado = await Favorito.destroy({ where: { id, usuarioId } });
    if (!borrado) return res.status(404).json({ mensaje: 'No encontrado.' });
    res.json({ mensaje: 'Eliminado.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar.' });
  }
};