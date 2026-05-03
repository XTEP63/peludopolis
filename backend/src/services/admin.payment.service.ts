import * as repo from "../repositories/admin.payment.repository";
import { PaymentRow } from "../repositories/admin.payment.repository";

/* GET - Todos los pagos con filtros opcionales */
export const getAllPayments = async (filters: any) => {
    return repo.findAllPayments(filters);
};