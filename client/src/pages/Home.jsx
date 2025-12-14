import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Scissors, Heart, Award, Clock, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '../lib/constants';

const Home = () => {
    const features = [
        {
            icon: ShoppingBag,
            title: 'Productos de Calidad',
            description: 'Amplio catálogo de alimentos, juguetes y accesorios.',
        },
        {
            icon: Scissors,
            title: 'Peluquería Profesional',
            description: 'Servicio de grooming con profesionales para tu mascota.',
        },
        {
            icon: Heart,
            title: 'Atención Personalizada',
            description: 'Asesoramiento experto para el cuidado que merecen.',
        },
        {
            icon: Award,
            title: 'Marcas Reconocidas',
            description: 'Trabajamos con las mejores marcas del mercado.',
        },
    ];

    return (
        <>
            <Helmet>
                <title>FIDO'S PET SHOP - Pet Shop y Peluquería Canina en Córdoba</title>
                <meta name="description" content="FIDO'S PET SHOP: tu tienda de confianza en Córdoba." />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* HERO SECTION */}
                <section className="relative h-[600px] overflow-hidden">
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Perros y gatos felices"
                        src="https://seguros.elcorteingles.es/content/dam/eci-seguros/es/blog/blog-julio-2023/incluir-mascota-seguro-hogar.jpg"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/80 to-yellow-800/40" />
                    <div className="relative container mx-auto px-4 h-full flex items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-2xl text-white"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                                Cuidamos a tu mascota como si fuera nuestra
                            </h1>
                            <p className="text-xl mb-8 text-gray-100 font-light">
                                Productos de calidad y peluquería profesional en Córdoba.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/tienda">
                                    <button className="flex items-center px-8 py-4 bg-white text-yellow-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-lg transform hover:-translate-y-1">
                                        <ShoppingBag className="mr-2 h-5 w-5" />
                                        Ver Productos
                                    </button>
                                </Link>
                                <Link to="/peluqueria">
                                    <button className="flex items-center px-8 py-4 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition shadow-lg transform hover:-translate-y-1 border-2 border-transparent">
                                        <Scissors className="mr-2 h-5 w-5" />
                                        Solicitar Turno
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Por qué elegirnos?</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Somos tu aliado de confianza para el cuidado integral de tu mascota.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-6 rounded-xl bg-yellow-50/50 border border-yellow-100 hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                        <feature.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* STORE PREVIEW SECTION */}
                <section className="py-20 bg-yellow-50/30">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <img className="rounded-2xl shadow-2xl w-full h-[400px] object-cover hover:shadow-3xl transition-shadow duration-500" alt="Interior Tienda" src="https://i0.wp.com/animalcenter.com.ar/wp-content/uploads/2020/05/animal_center_inicio_galeria_locales_exposicion_mar_del_plata_02.jpg?fit=800%2C800&ssl=1" loading="lazy" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl font-bold text-gray-800 mb-6">Nuestra Tienda</h2>
                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    Contamos con un amplio catálogo de productos de las mejores marcas.
                                    Desde alimentos balanceados premium hasta los juguetes más divertidos y accesorios de moda.
                                </p>
                                <Link to="/tienda">
                                    <button className="px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-md">
                                        Explorar Productos
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* VISIT US SECTION */}
                <section className="py-20 bg-white text-center">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Visitanos!</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
                            Encontrá todo lo que necesitás para tu mascota en un solo lugar.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center p-4">
                                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                    <MapPin className="h-8 w-8 text-yellow-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Ubicación</h3>
                                {/* CORRECCIÓN: Usamos la constante que tenemos disponible */}
                                <p className="text-gray-600">{CONTACT_INFO.FULL_ADDRESS}</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                    <Clock className="h-8 w-8 text-yellow-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Horarios</h3>
                                <p className="text-gray-600">Lun-Vie: 9-19hs <br /> Sáb: 9-14hs</p>
                            </div>
                            <div className="flex flex-col items-center p-4">
                                <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                    <Heart className="h-8 w-8 text-yellow-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Compromiso</h3>
                                <p className="text-gray-600">Cuidado y amor por tu mascota</p>
                            </div>
                        </div>
                    </div>
                </section>
            </motion.div>
        </>
    );
};

export default Home;