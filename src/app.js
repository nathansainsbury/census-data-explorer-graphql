const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const util = require('util');

const connection = require('./connection');
const query = util.promisify(connection.query).bind(connection);
const app = express();

const schema = buildSchema(`
    type codelistDef{
        ID: Int
        NAME: String
        MNU: String
        SEE_ALSO: String
        DESCRP: String
        COVERAGE: String
    }

    type codes{
        CLID: Int
        ID: Int
        DESCRP: String
        MNU: String
    }

    type Query{
        getTopic(MNU: String, DESCRP: String, LIMIT: Int, SKIP: Int): [codelistDef]
        getFilters(CLID: Int, MNU: String, ID: [Int]): [codes]
    }
`);

const rootValue = {
    getTopic: async ({ MNU, DESCRP, LIMIT=10, SKIP=0}) => {
        if(MNU){
            const response = await query(`SELECT * FROM codelist_def WHERE MNU = ? LIMIT ? OFFSET ?;`, [MNU, LIMIT, SKIP]);
            return response;
        }
        if(DESCRP){
            const response = await query(`SELECT * FROM codelist_def WHERE DESCRP LIKE '%${DESCRP}%' LIMIT ? OFFSET ?;`, [LIMIT, SKIP]);
            return response;
        }
    },

    getFilters: async({ CLID, MNU, ID }) => {
        if(CLID){
            const response = await query(`SELECT codes.CLID, codes.ID, codes.DESCRP, codelist_def.MNU FROM codes JOIN codelist_def ON codelist_def.ID = codes.CLID WHERE codes.CLID = ?;`, [CLID]);
            return response;
        }
        if(MNU){
            const response = await query(`SELECT codes.CLID, codes.ID, codes.DESCRP, codelist_def.MNU FROM codes JOIN codelist_def ON codelist_def.ID = codes.CLID WHERE codelist_def.MNU = ?;`, [MNU]);
            return response;   
        }
        if(ID){
            const response = await query(`SELECT codes.CLID, codes.ID, codes.DESCRP, codelist_def.MNU FROM codes JOIN codelist_def ON codelist_def.ID = codes.CLID WHERE codes.ID IN (?);`, [ID]);
            return response;    
        }
    }
}

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('listening to graphql server on port 4000');
});
