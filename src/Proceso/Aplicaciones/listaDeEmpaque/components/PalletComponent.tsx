import React, { useContext, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { contenedorSeleccionadoContext, contenedoresContext, palletSeleccionadoContext } from "../ListaDeEmpaque";
import { PalletAsyncData } from "../types/types";
import { getPalletButtonStyle } from "../utils/pallets";


type propsType = {
    pallet: number;
    handleClickPallet: (data: number) => void;
    openPalletSettings: () => void;
    palletsAsyncData: PalletAsyncData;
};

export default React.memo(PalletComponent);

function PalletComponent({
    pallet,
    handleClickPallet,
    openPalletSettings,
    palletsAsyncData,
}: propsType): React.JSX.Element {
    const palletSeleccionado = useContext(palletSeleccionadoContext);
    const idContenedor = useContext(contenedorSeleccionadoContext);
    const contenedoresList = useContext(contenedoresContext);

    const contenedor = useMemo(
        () => contenedoresList.find(cont => cont._id === idContenedor),
        [contenedoresList, idContenedor]
    );

    const palletData = useMemo(
        () => contenedor?.pallets?.[pallet] ?? null,
        [contenedor, pallet]
    );

    const totalCajas = useMemo(
        () => palletData?.EF1?.reduce((acu, item) => acu + item.cajas, 0) ?? 0,
        [palletData]
    );

    const palletFree = useMemo(() => {
        if (!palletData?.listaLiberarPallet) { return false; }
        return Object.values(palletData.listaLiberarPallet).every(val => val === true);
    }, [palletData]);

    const longPressHandle = () => {
        handleClickPallet(Number(pallet));
        openPalletSettings();
    };

    if (!palletData) {
        return (
            <View style={styles.palletContainer}>
                <Text>Pallet no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.palletContainer}>
            <TouchableOpacity
                style={[
                    styles.palletButtonBase,
                    getPalletButtonStyle(
                        Number(pallet) === palletSeleccionado,
                        palletFree,
                        palletsAsyncData?.selectedColor,
                        styles
                    ),
                ]}
                onPress={() => handleClickPallet(Number(pallet))}
                onLongPress={longPressHandle}
            >
                <View style={styles.headerRow}>
                    <Image
                        source={require('../../../../../assets/palletIMG.webp')}
                        style={styles.image}
                    />
                    <Text style={styles.textCalibre}>
                        {palletData?.settings?.calibre ?? ''}
                    </Text>
                </View>

                <View style={styles.infoContainer}>
                    {/* Cajas totales */}
                    <Text style={styles.textPalletCajas}>
                        {totalCajas}
                        {palletsAsyncData?.cajasContadas !== '' && (
                            <>
                                {" | "}
                                {totalCajas - Number(palletsAsyncData?.cajasContadas || 0)}
                            </>
                        )}
                    </Text>

                    {/* tipoCaja y calidad */}
                    <Text style={styles.textDetalle}>
                        Tipo Caja: {palletData?.settings?.tipoCaja ?? 'N/A'}
                    </Text>
                    <Text style={styles.textDetalle}>
                        Calidad: {palletData?.settings?.calidad ?? 'N/A'}
                    </Text>
                </View>

            </TouchableOpacity>
            <Text style={styles.fonts}>
                Pallet {pallet === -1 ? 'sin pallet' : pallet + 1}
            </Text>
        </View>
    );
}



const styles = StyleSheet.create({
    palletContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: 8,
    },
    palletButtonBase: {
        width: 110,
        height: 120,
        margin: 5,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#52006A',
        padding: 8,
        justifyContent: 'center',
    },
    palletNormal: {
        backgroundColor: 'white',
    },
    palletLiberado: {
        backgroundColor: '#158433', // Un color suave que indique liberado
    },
    palletSelected: {
        backgroundColor: '#D53B29', // Color rojo para indicar seleccionado
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    image: {
        width: 40,
        height: 40,
        marginRight: 10,
        resizeMode: 'contain',
    },
    textCalibre: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    textPalletCajas: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    textDetalle: {
        fontSize: 12,
        color: '#555',
    },
    fonts: {
        color: 'white',
        fontSize: 12,
        marginTop: 4,
    },
});
