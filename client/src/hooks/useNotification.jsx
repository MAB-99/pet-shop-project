import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAuth from './useAuth';
import { API_URL } from '../lib/constants';

const useNotifications = () => {
    const { auth } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Función para pedir datos al servidor
    const fetchNotifications = useCallback(async () => {
        if (!auth._id) return; // Si no está logueado, no hacemos nada

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.get(`${API_URL}/api/notification`, config);

            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Error cargando notificaciones", error);
        }
    }, [auth._id]);

    // Función para marcar una como leída
    const markAsRead = async (id, link) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_URL}/api/notification/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Actualizamos visualmente rápido (Optimistic Update)
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));

        } catch (error) {
            console.error("Error al marcar como leída", error);
        }
    };

    // Efecto: Cargar al inicio y luego cada 30 segundos
    useEffect(() => {
        fetchNotifications();

        const interval = setInterval(fetchNotifications, 30000); // Polling
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return { notifications, unreadCount, markAsRead, refresh: fetchNotifications };
};

export default useNotifications;