'use strict';

const { Contract } = require('fabric-contract-api');

class ProductVerification extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        console.info('============= END : Initialize Ledger ===========');
    }

    async registerProduct(ctx, serialNumber, productHash, company) {
        console.info('============= START : Register Product ===========');

        const exists = await this.productExists(ctx, serialNumber);
        if (exists) {
            throw new Error(`The product ${serialNumber} already exists`);
        }

        const product = {
            serialNumber,
            productHash,
            company,
            timestamp: new Date().getTime(),
            isRegistered: true,
            docType: 'product',
        };

        await ctx.stub.putState(serialNumber, Buffer.from(JSON.stringify(product)));
        console.info('============= END : Register Product ===========');
    }

    async verifyProduct(ctx, serialNumber) {
        console.info('============= START : Verify Product ===========');
        const productJSON = await ctx.stub.getState(serialNumber);
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${serialNumber} does not exist`);
        }
        console.info('============= END : Verify Product ===========');
        return productJSON.toString();
    }

    async productExists(ctx, serialNumber) {
        const productJSON = await ctx.stub.getState(serialNumber);
        return productJSON && productJSON.length > 0;
    }

}

module.exports = ProductVerification;
