import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Switch } from "react-native";
import HorizontalLine from "../../../../components/HorizontalLine";
import { contenedoresContext, contenedorSeleccionadoContext } from "../ListaDeEmpaque";
import { obtenerResumen } from "../controller/resumenes";

export default function ResumenListaEmpaque(): React.JSX.Element {
    const contenedores = useContext(contenedoresContext);
    const numeroContenedor = useContext(contenedorSeleccionadoContext);
    const [cajasTotal, setCajasTotal] = useState<number>(0);
    const [kilosTotal, setKilosTotal] = useState<number>(0);
    const [cajasCalidad, setCajasCalidad] = useState<object>();
    const [kilosCalidad, setkilosCalidad] = useState<object>();
    const [cajasCalibre, setCajasCalibre] = useState<object>();
    const [kilosCalibre, setkilosCalibre] = useState<object>();
    const [soloHoy, setSoloHoy] = useState<boolean>(false);
    const toggleSwitch = () => setSoloHoy(previousState => !previousState);
    useEffect(() => {
        let cont;
        if (numeroContenedor === undefined || numeroContenedor === "") {
            cont = contenedores;
        } else {
            const contenedor = contenedores?.find(c => c._id === numeroContenedor);
            cont = [contenedor];
        }
        const resumen = obtenerResumen(cont, soloHoy);
        if (resumen !== null) {
            const {
                kilos_por_calibre,
                kilos_por_calidad,
                cajas_por_calibre,
                cajas_por_calidad,
                kilo_total,
                total_cajas,

            } = resumen;
            setKilosTotal(kilo_total);
            setCajasCalidad(cajas_por_calidad);
            setCajasTotal(total_cajas);
            setkilosCalidad(kilos_por_calidad);
            setCajasCalibre(cajas_por_calibre);
            setkilosCalibre(kilos_por_calibre);
        }
    }, [numeroContenedor, contenedores, soloHoy]);
    return (
        <View style={styles.container1}>
            <View style={styles.container2}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Resumen</Text>
                    <View style={styles.containerSoloHoy}>
                        <Text>Solo hoy</Text>
                        <Switch
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={soloHoy ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={soloHoy}
                        />
                    </View>
                </View>
                <HorizontalLine />
                <View style={styles.containerResumenes}>
                    <View style={styles.containerItem}>
                        <Text>Total:</Text>
                        <HorizontalLine />

                        <View>
                            <Text>{cajasTotal.toLocaleString('es-CO')} cajas</Text>
                            <Text>{kilosTotal.toLocaleString('es-CO')} Kg</Text>
                        </View>
                    </View>
                    <View style={styles.containerItem}>
                        <Text>Por calidad</Text>
                        <HorizontalLine />

                        <View>
                            {cajasCalidad && Object.entries(cajasCalidad).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} cajas  </Text>
                            ))}
                            <HorizontalLine />

                            {kilosCalidad && Object.entries(kilosCalidad).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} Kg </Text>
                            ))}
                        </View>
                    </View>
                    <View style={styles.containerItem}>
                        <Text>Por calibre</Text>
                        <HorizontalLine />

                        <View>
                            {cajasCalibre && Object.entries(cajasCalibre).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"}  {value.toLocaleString('es-CO')} cajas </Text>
                            ))}
                            <HorizontalLine />

                            {kilosCalibre && Object.entries(kilosCalibre).map(([key, value]) => (
                                <Text key={key}> Calidad {key + " ➜"} {value.toLocaleString('es-CO')} Kg </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </View>

        </View>
    );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        width: '100%',
        height: windowHeight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2', // Leve tono gris para destacar el contenedor blanco
    },
    container2: {
        backgroundColor: 'white',
        width: '90%',
        height: '90%',
        borderRadius: 18,
        padding: 15,
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    containerSoloHoy: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelSoloHoy: {
        fontSize: 14,
        marginBottom: 4,
        color: '#333',
        fontWeight: '500',
    },
    containerResumenes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        flexWrap: 'wrap',
        gap: 12,
    },
    containerItem: {
        flexGrow: 1,
        minWidth: '28%', // Ajusta el ancho mínimo para que quepan 3 items en una fila (si el espacio lo permite)
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 15,
        padding: 15,
        backgroundColor: '#FAFAFA',
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#444',
    },
    dataContainer: {
        marginTop: 10,
    },
    dataText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
});
