import chai from 'chai';
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
chai.should();

const {expect} = chai;

describe('default test', () => {

    it('no-op', async () => {
        expect("Hello").to.equal("Hello");
    });
});
