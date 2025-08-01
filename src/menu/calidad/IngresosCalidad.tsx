import { Animated, Text, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from "react";
import { CargoType } from '../../../types/cargosType';

type propsType = {
    permisos: CargoType | undefined
    seleccionWindow: (e: string) => void
}

export default function IngresosCalidad(props: propsType): React.JSX.Element {
    const clasificacion_descarte = useRef(new Animated.Value(1)).current;
    const higiene_personal = useRef(new Animated.Value(1)).current;

    const [permisos, setPermisos] = useState<string[]>();

    useEffect(() => {
        if (props.permisos) {
            const perm = Object.keys(props.permisos.Calidad["Ingresos Calidad"]);
            setPermisos(perm);
        }
    }, [props.permisos]);

    const handlePressIn = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 0.9, // Reducir el tamaño al presionar
            useNativeDriver: true,
        }).start();
    };
    const handlePressOut = (scale: Animated.Value) => {
        Animated.spring(scale, {
            toValue: 1, // Restaurar el tamaño original
            useNativeDriver: true,
        }).start();
    };
    return (
        <View style={styles.container}>

            {permisos?.includes('Ingreso Clasificacion descarte') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66b6701177549ed0672a9022")}
                    onPressIn={() => handlePressIn(clasificacion_descarte)}
                    onPressOut={() => handlePressOut(clasificacion_descarte)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: clasificacion_descarte }] }]}>
                        <Icon name="flask" size={24} color="#fff" />
                        <Text style={styles.text}>Clasificaciíon descarte</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>

            )}
            {permisos?.includes('Higiene personal') && (
                <TouchableWithoutFeedback
                    onPress={() => props.seleccionWindow("66c5130bb51eef12da89050e")}
                    onPressIn={() => handlePressIn(higiene_personal)}
                    onPressOut={() => handlePressOut(higiene_personal)}
                >
                    <Animated.View style={[styles.button, { transform: [{ scale: higiene_personal }] }]}>
                        <Icon name="flask" size={24} color="#fff" />
                        <Text style={styles.text}>Higiene personal</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            )}
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1, // Hace que el contenedor ocupe todo el espacio disponible
        alignItems: 'center', // Centra horizontalmente
        backgroundColor: '#f5f5f5', // Fondo opcional para visualizar el centrado
        width: '100%',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7D9F3A',
        gap: 9,
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        width: '95%',
        marginTop: 10,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
