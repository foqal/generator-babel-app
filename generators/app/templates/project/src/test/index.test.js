import chai from 'chai';
import spies from "chai-spies";
import chaiAsPromised from "chai-as-promised";
chai.use(spies);
chai.use(chaiAsPromised);
chai.should();

const {expect} = chai;

describe('default test', () => {

    it('no-op', async () => {
        expect("Hello").to.equal("Hello");
    });
});
