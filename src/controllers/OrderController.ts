import {getConnection} from "typeorm";
import {Order} from "../entities/Order";

const OrderController = {
    create: async (req: any, res: any) => {
        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Order)
                .values({
                        Processor: req.body.Processor,
                        RAM: req.body.RAM,
                        Motherboard: req.body.Motherboard,
                        Cabinet: req.body.Cabinet,
                        Storage: req.body.Storage,
                        Graphics: req.body.Graphics,
                        user: req.body.whoSentTheRequest
                    }
                )
                .returning('id')
                .execute();
            return res.status(200).send({data: 'Successful added your order to cart.'})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetch: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Order, 'order')
                .where({user: req.body.whoSentTheRequest, status: 'Order Placed'})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetchCartItems: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Order, 'order')
                .where({user: req.body.whoSentTheRequest, status: 'Added to Cart'})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetchPendingOrders: async (_req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .where({status: 'Added to Cart'})
                .getMany()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(500)
        }
    },
    fetchAllOrders: async (_req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .getMany()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(500)
        }
    },
    fetchIndividualPendingOrder: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .where({id: req.params.id, status: 'Order Pending'})
                .execute()
            return res.status(201).send({data: result})
        } catch (err) {
            res.send(400).send({data: 'Something went wrong.'})
        }
    },
    updateIndividualPendingOrder: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Order)
                .set({status: 'In Process'})
                .where({id: req.params.id})
                .returning("*")
                .execute();
            return res.status(200).send({data: result})
        } catch (err) {
            res.send(500)
        }
    },
    updateIndividualCartItems: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .update(Order)
                .set({status: 'Order Placed'})
                .where({user: req.body.whoSentTheRequest, status: 'Added to Cart'})
                .returning("*")
                .execute();
            return res.status(200).send({data: result})
        } catch (err) {
            res.send(500)
        }
    },
    destroy: async (req: any, res: any) => {

        if (!parseInt(req.params.id)) {
            return res.status(400).send({errors: {data: 'Not a valid id.'}})
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .delete()
                .from(Order)
                .where({id: parseInt(req.params.id), user: req.body.whoSentTheRequest, status: 'Added to Cart'})
                .execute();
            return res.status(200).send({data: 'Successfully deleted the item from Cart.'})
        } catch (err) {
            return res.status(500).send({data: null, errors: {data: 'Some error occurred'}})
        }
    }
}

export default OrderController