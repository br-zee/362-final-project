'use strict';

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({strapi}) => ({
    async create(ctx) {
        const { products, userData } = ctx.request.body.data;

        const line_items = await Promise.all(
            products.map(async (product) => {
                const item = await strapi
                    .service("api::product.product")
                    .findOne(product.id)

                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: item.title,
                            },
                            unit_amount: item.price * 100,
                        },
                        quantity: product.quantity
                    }
            })
        )

        try {
            const customer = await stripe.customers.create({
                email: userData?.email,
            });

            const session = await stripe.checkout.sessions.create({
                line_items,
                mode: 'payment',
                success_url: `${process.env.CLIENT_URL}?success=true`,
                cancel_url: `${process.env.CLIENT_URL}?success=false`,
                shipping_address_collection: {allowed_countries: ["US", "CA"]},
                payment_method_types: ["card"], 
                customer: customer.id
            });

            await strapi.service("api::order.order").create({
                data: {
                    products, 
                    stripeId: session.id,
                    user: userData?.id
                }
            });

            return { stripeSession: session }
        }
        catch(err) {
            ctx.response.status = 500;
            return err;
        }
    }
}));