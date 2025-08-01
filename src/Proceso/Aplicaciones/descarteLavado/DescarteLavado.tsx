import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, Button, Alert } from "react-native";
import FormInput from "../../../UI/components/FormInput";
import { sumarDatos } from "./func/functions";
import { datosPredioType } from "./types/types";
import useEnvContext from "../../../hooks/useEnvContext";
import { getCredentials } from "../../../../utils/auth";
import useForm from "../../../hooks/useForm";
import { FormState, labelsForm, formInit, FormCategory, formSchema } from "./validations/validations";
import { useAppStore } from "../../../stores/useAppStore";

export default function DescarteLavado(): React.JSX.Element {
    const { url } = useEnvContext();
    const setLoading = useAppStore((state) => state.setLoading);
    const loading = useAppStore((state) => state.loading);

    const { formState, setFormState, validateForm, formErrors, resetForm } = useForm<FormState>(formInit);
    const [datosPredio, setDatosPredio] = useState<datosPredioType>({
        _id: "",
        enf: "",
        tipoFruta: "",
        nombrePredio: "",
    });
    const fetchWithTimeout = (direccion: string, options: object, timeout = 5000): any => {
        return Promise.race([
            fetch(direccion, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), timeout)
            ),
        ]);
    };
    const obtenerLote = async () => {
        try {
            setLoading(true);
            const requestENF = await fetch(`${url}/variablesDeProceso/predioProcesoDescarte`);
            const responseServerPromise = await requestENF.json();
            const response: datosPredioType = responseServerPromise.response;
            setDatosPredio({
                _id: response._id,
                enf: response.enf,
                tipoFruta: response.tipoFruta,
                nombrePredio: response.nombrePredio,
            });
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (name: keyof FormState, value: number, type: keyof FormCategory): void => {
        setFormState({
            ...formState,
            [name]: {
                ...formState[name],
                [type]: value,
            },
        });

    };

    const guardarDatos = async (): Promise<any> => {
        try {
            console.log("Datos a guardar:", formState);
            const isValid = validateForm(formSchema);
            if (!isValid) {
                return;
            }
            if (datosPredio.enf === "") {
                throw new Error("Recargue el predio que se está vaciando");
            }
            setLoading(true);
            const data = sumarDatos(formState, datosPredio);
            const request = {
                action: "ingresar_descarte_lavado",
                _id: datosPredio._id,
                data: data,
            };
            const token = await getCredentials();
            const responseJSON = await fetchWithTimeout(`${url}/proceso/ingresar_descarte_lavado`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`,
                },
                body: JSON.stringify(request),
            });
            const response = await responseJSON.json();
            if (response.status !== 200) {
                throw new Error(`Error guardando los datos ${response.message}`);
            }
            Alert.alert("Guardado con exito");
            resetForm();
        } catch (err) {
            if (err instanceof Error) {
                Alert.alert(`${err.name}: ${err.message}`);
            }
        } finally {
            setLoading(false);
            setDatosPredio({
                _id: "",
                enf: "",
                tipoFruta: "",
                nombrePredio: "",
            });
        }
    };

    return (
        <ScrollView style={styles.constainerScroll}>

            <View style={styles.container}>
                <Text style={styles.textInputs}>
                    Descarte Lavado
                </Text>
                <Text>Numero de lote:</Text>
                <Text>{datosPredio.nombrePredio}</Text>
                <Text>{datosPredio.enf}</Text>
                <Button
                    color="#49659E"
                    title="Cargar predio"
                    onPress={obtenerLote}
                />
                {Object.keys(labelsForm).map(item => (
                    <View style={styles.containerForm} key={item}>
                        <Text style={styles.textInputs}>{labelsForm[item as keyof typeof labelsForm]}</Text>
                        <FormInput
                            label="N° de canastillas"
                            value={String(formState[item as keyof FormState].canastillas || '')}
                            onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), 'canastillas')}
                            placeholder="N. de canastillas"
                            type="numeric"
                            error={formErrors[item as keyof FormState]}
                        />
                        <FormInput
                            label="Kilos"
                            value={String(formState[item as keyof FormState].kilos || '')}
                            onChangeText={(value): void => handleChange(item as keyof FormState, Number(value), 'kilos')}
                            placeholder="Kilos"
                            type="numeric"
                            error={formErrors[item as keyof FormState]}
                        />
                    </View>
                ))}
                <View style={styles.viewBotones}>
                    <Button disabled={loading} title="Guardar" color="#49659E" onPress={guardarDatos} />
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    constainerScroll: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 16,
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginTop: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        marginBottom: 20,
    },
    containerForm: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 20,
        width: '100%',
    },
    textInputs: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333", // Texto más oscuro
        marginBottom: 5,
    },
    loader: {
        marginTop: 250,
        alignSelf: "center",
    },
    viewBotones: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "90%",
        marginTop: 20,
    },
});
