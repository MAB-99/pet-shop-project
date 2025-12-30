import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, Check, Package, Calendar, Info, AlertCircle } from 'lucide-react';

const NotificationMenu = ({ notifications, markAsRead, onClose }) => {

    // Icono según el tipo de notificación
    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package className="h-5 w-5 text-blue-500" />;
            case 'appointment': return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'alert': return <AlertCircle className="h-5 w-5 text-red-500" />;
            default: return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden z-50 origin-top-right"
        >
            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-gray-700">Notificaciones</h3>
                <span className="text-xs text-gray-500">Recientes</span>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                        <Bell className="h-8 w-8 mb-2 opacity-20" />
                        <p className="text-sm">No tienes notificaciones nuevas</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 relative ${!notif.isRead ? 'bg-yellow-50/50' : ''}`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-1 flex-shrink-0">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                        {notif.message}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(notif.createdAt).toLocaleDateString()} - {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>

                                    {notif.link && (
                                        <Link
                                            to={notif.link}
                                            onClick={onClose}
                                            className="text-xs text-yellow-600 hover:text-yellow-700 font-medium mt-1 inline-block"
                                        >
                                            Ver detalles →
                                        </Link>
                                    )}
                                </div>
                                {!notif.isRead && (
                                    <div className="flex-shrink-0 self-center">
                                        <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default NotificationMenu;