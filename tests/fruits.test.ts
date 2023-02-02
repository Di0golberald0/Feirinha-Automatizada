import fruitsRepository from '../src/repositories/fruits-repository';
import fruitsService from '../src/services/fruits-service';
import supertest from 'supertest';
import app from '../src/app';
import exp from 'constants';

const api = supertest(app);

describe('createFruit', () => {
    it('should return 201 if fruit input is valid', async () => {
        const melancia = {
            name: 'Melancia',
            price: 8
        };
        const response = await api.post('/fruits').send(melancia);
        expect(response.status).toBe(201);
    });

    it('should return the correct fruit', () => {
        const name = 'Melancia';
        const melancia = {
            id: 1,
            name: name,
            price: 8
        };
        const response = fruitsRepository.getSpecificFruitByName(name);
        expect(response).toEqual(melancia);
    });

    it('should return 409 if fruit already exists', async () => {
        const melancia = {
            name: 'Melancia',
            price: 8
        };

        const response = await api.post('/fruits').send(melancia);
        expect(response.status).toBe(409);
    });

    it('should throw conflict message if fruit already exists', () => {
        const melancia = {
            name: 'Melancia',
            price: 8
        };

        try {
            fruitsService.createFruit(melancia);
            fail('should throw conflict message');
        } catch (e) {
            expect(e.message).toBe('This fruit already exists!');
        }
    })
})

describe('Testando fruits-service', () => {
    it('Testando getFruits', () => {
        const requisito = fruitsRepository.getFruits();
        expect(requisito).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ] || [])
        )
    });

    it('Testando getSpecificFruit id', () => {
        const id = 1;
        const idExists = fruitsService.getSpecificFruit(id);
       expect(idExists).toEqual({
        id: id,
        name: expect.any(String),
        price: expect.any(Number)
       })
    })

    it('should return 404 if id does not exist', async () => {
        const id = 10;
        const response = await api.get(`/fruits/${id}`);
        expect(response.status).toBe(404);
    });

})