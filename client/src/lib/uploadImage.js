// Reemplaza con tus datos reales de Cloudinary
const CLOUD_NAME = "dkgohh1ds";
const UPLOAD_PRESET = "petshop_upload"; // El nombre que pusiste en el paso 1

const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error('Error en la subida a Cloudinary');
        }

        const data = await response.json();
        return data.secure_url; // Retornamos la URL de la imagen en internet

    } catch (error) {
        console.error("Error subiendo imagen:", error);
        return null;
    }
};

export default uploadImage;