
import { z } from 'zod';
import { getErrorMessages } from '../../../../utils/errorsUtils';

export function validarAddItem(request: object) {
    try {
        // Schema principal para validar req.data
        const schema = z.object({
            _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
            pallet: z.number().int().nonnegative(),
            action: z.literal('put_proceso_aplicaciones_listaEmpaque_agregarItem'),
            item: z.object({
                cajas: z.number().int().positive(),
                lote: z.string().regex(/^[0-9a-fA-F]{24}$/),
                calidad: z.string().min(1),
                calibre: z.string(),
                tipoCaja: z.string(),
                tipoFruta: z.string(),
            }),
        });

        schema.parse(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = getErrorMessages(err);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
export function validarDeleteItems(request: object) {
    try {
        const schema = z.object({
            _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
            pallet: z.number().int().nonnegative(),
            seleccion: z.array(z.number().int().nonnegative()),
        });
        schema.parse(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = getErrorMessages(err);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
export function validarRestarItem(request: object) {
    try {
        const schema = z.object({
            _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
            pallet: z.number().int().nonnegative(),
            seleccion: z.number().int().nonnegative(),
            cajas: z.number().int().positive(),
        });
        schema.parse(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = getErrorMessages(err);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
export function validarMoverItem(request: object) {
    try {
        const schema = z.object({
            contenedor1: z.object({
                _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
                numeroContenedor: z.number().int().nonnegative(),
                pallet: z.number().int().nonnegative(),
                seleccionado: z.array(z.number().int().nonnegative()),
            }),
            contenedor2: z.object({
                _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
                numeroContenedor: z.number().int().nonnegative(),
                pallet: z.number().int().nonnegative(),
            }),
            cajas: z.number().int().nonnegative(),

        });
        schema.parse(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = getErrorMessages(err);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
export function validarModificarItem(request: object) {
    try {
        const schema = z.object({
            _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
            pallet: z.number().int().nonnegative(),
            seleccion: z.array(z.number().int().nonnegative()),
            data: z.object({
                calibre: z.string().min(1),
                calidad: z.string().min(1),
                tipoCaja: z.string().min(1),
            }),
        });
        schema.parse(request);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = getErrorMessages(err);
            throw new Error(`Validation error: ${JSON.stringify(errors)}`);
        }
    }
}
