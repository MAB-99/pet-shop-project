import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock } from 'lucide-react';
import { CONTACT_INFO } from '../lib/constants'; // <--- Ajustado el path

const About = () => {
    const values = [
        {
            icon: Heart,
            title: 'Amor por los Animales',
            description: 'Cada mascota es tratada con el cariño y respeto que merece',
        },
        {
            icon: Award,
            title: 'Calidad Garantizada',
            description: 'Trabajamos solo con productos y marcas de primera línea',
        },
        {
            icon: Users,
            title: 'Equipo Profesional',
            description: 'Personal capacitado y con amplia experiencia en el sector',
        },
        {
            icon: Clock,
            title: 'Compromiso',
            description: 'Atención personalizada y seguimiento continuo',
        },
    ];

    return (
        <>
            <Helmet>
                <title>Sobre Nosotros - Conoce FIDO'S PET SHOP</title>
                <meta name="description" content="Conoce la historia de FIDO'S PET SHOP, tu pet shop de confianza. Equipo profesional comprometido con el bienestar de tu mascota." />
                <meta name="keywords" content="pet shop córdoba, sobre fidos, equipo veterinario, historia fidos" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-yellow-50/70"
            >
                <section className="relative h-[400px] overflow-hidden">
                    <img
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Equipo de FIDO'S PET SHOP sonriendo con mascotas"
                        src="https://images.unsplash.com/photo-1682001370529-878ec33a474f"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/70 to-yellow-800/50" />
                    <div className="relative container mx-auto px-4 h-full flex items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-white max-w-2xl"
                        >
                            <h1 className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
                            <p className="text-xl text-gray-100">
                                Más de 10 años cuidando a las mascotas de Córdoba
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-4xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
                                <div className="space-y-4 text-gray-700 text-lg">
                                    <p>
                                        FIDO'S PET SHOP nació en 2013 con un sueño: crear un espacio donde las mascotas
                                        reciban el mejor cuidado posible y sus dueños encuentren todo lo necesario para
                                        su bienestar.
                                    </p>
                                    <p>
                                        Comenzamos como una pequeña tienda en el corazón de Córdoba, y con
                                        el tiempo nos expandimos para ofrecer también servicios de peluquería profesional,
                                        siempre manteniendo nuestro compromiso con la calidad y el trato personalizado.
                                    </p>
                                    <p>
                                        Hoy nos enorgullece recibirte en nuestro local ubicado en <strong>{CONTACT_INFO.ADDRESS}</strong>,
                                        donde continuamos trabajando con la misma pasión del primer día, reconocidos por nuestra dedicación
                                        y el amor genuino que sentimos por cada mascota que pasa por nuestras puertas.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
                                    alt="Interior acogedor de la tienda FIDO'S PET SHOP con productos"
                                    src="https://images.unsplash.com/photo-1685821200796-9570453587f5"
                                    loading="lazy"
                                />
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Valores</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Los principios que guían nuestro trabajo diario
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <value.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </motion.div>
        </>
    );
};

export default About;