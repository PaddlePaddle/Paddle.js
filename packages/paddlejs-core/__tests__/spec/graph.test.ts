import Graph from '../../src/graph';
import modelInfo from '../env/mock/model.json';

describe('test graph', () => {

    const graphGenerator = new Graph(modelInfo);
    const weightMap = graphGenerator.createGraph();


    it('test graph map', () => {
        expect(weightMap.length).toBe(7);
    });

    it('test graph api getFeedExecutor', () => {
        const feedOp = graphGenerator.getFeedExecutor();
        expect(feedOp.type).toBe('feed');
    });

    it('test graph api getFetchExecutor, getExecutorById', () => {
        const fetchOp = graphGenerator.getFetchExecutor();
        expect(fetchOp.type).toBe('fetch');
    });

    it('test graph api getExecutorById', () => {
        const thirdOp = weightMap[2];
        const exactIdOp = graphGenerator.getExecutorById(thirdOp.id);
        expect(exactIdOp.type).toBe(thirdOp.type);
    });
});

